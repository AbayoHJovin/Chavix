const port = 1025;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../model/model");
const Dms = require("../model/dms");
const Messages = require("../model/messages");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const url = "mongodb://localhost:27017/chat";
mongoose
  .connect(url)
  .then(() => {
    console.log("User connected to the db");
    app.listen(port, () => {
      console.log(`The server has started on port ${port}`);
    });
  })
  .catch((e) => console.log("error:", e));
app.post("/add", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username);
    if (!username || !email || !password) {
      throw new Error("Missing details");
    }
    const add = await User.create({
      username: username,
      email: email,
      password: password,
    });
    return res.status(201).json({ msg: "Account created" });
  } catch (e) {
    return res.status(201).json({ msg: e.message || "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Invalid credentials");
    }
    const check = await User.findOne({ email: email, password: password });
    if (!check) {
      throw new Error("Invalid credentials");
    }
    const wantedDetails = check.username;
    const userId = check._id;
    return res.status(200).json({ user: wantedDetails, id: userId });
  } catch (e) {
    return res.status(200).json({ msg: e.message || "Something went wrong" });
  }
});
app.get("/all", async (req, res) => {
  try {
    const retrieveAll = await User.find({});
    if (!retrieveAll) {
      throw new Error("No users");
    }
    return res.status(200).json({ resp: retrieveAll });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});

app.post("/dm", async (req, res) => {
  const { senderId, receiverId } = req.body;
  const exists = await Dms.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  });

  if (exists) {
    return res.status(200).json(exists);
  }

  try {
    const createDm = await Dms.create({
      senderId: senderId,
      receiverId: receiverId,
    });
    return res.status(201).json(createDm);
  } catch (e) {
    return res.status(401).json({ msg: e.message || "Something went wrong" });
  }
});
app.post("/msg", async (req, res) => {
  const { dm, msg } = req.body;
  try {
    if (!msg || !dm) {
      throw new Error("No msg obtained");
    }
    const sendMsg = await Messages.create({
      dm: dm,
      text: msg,
    });
    return res.status(201).json({ resp: "Messages added" });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});
app.get("/saved", async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    if (!id) {
      throw new Error("Not signed in");
    }
    const findMessage = await Messages.find({ dm: id });
    // const dm=findMessage[0]
    // console.log(`dm:${dm}`);
    // const findTheOwnersOfMessage = await Dms.findById(dm);
    // console.log(findTheOwnersOfMessage);
    // if (!findTheOwnersOfMessage) {
    //   throw new Error("no messages");
    // }
    // const senderId = findTheOwnersOfMessage.senderId;
    // const receiverId = findTheOwnersOfMessage.receiverId;
    // console.log(receiverId);

    // const findTheSender = await User.findById(senderId);
    // const findTheReceiver = await User.findById(receiverId);
    return res
      .status(200)
      .json({
        resp: findMessage,
        // user:dm
        // sender: findTheSender,
        // receiver: findTheReceiver,
      });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});
