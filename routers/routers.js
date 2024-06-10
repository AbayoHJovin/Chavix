const port = 1025;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../model/model");
const Dms = require("../model/dms");
const Messages = require("../model/messages");
const Group = require("../model/group");

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
    return res.status(401).json({ msg: e.message || "Something went wrong" });
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
  const { dm, senderName, msg } = req.body;
  try {
    if (!msg || !senderName || !dm) {
      throw new Error("No msg obtained");
    }
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const timeString = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    const sendMsg = await Messages.create({
      dm: dm,
      senderName: senderName,
      text: msg,
      time: timeString,
    });
    return res.status(201).json({ resp: "Messages added" });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});
app.get("/saved", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new Error("Not signed in");
    }
    const findMessage = await Messages.find({ dm: id });
    return res.status(200).json({
      resp: findMessage,
      sender: findMessage.senderName,
    });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});

app.get("/showGroups", async (req, res) => {
  try {
    const retrieveAll = await Group.find({});
    if (!retrieveAll) {
      throw new Error("No users");
    }
    return res.status(200).json({ resp: retrieveAll });
  } catch (e) {
    return res.status(401).json({ resp: e.message || "Something went wrong" });
  }
});

app.post("/createGrp", async (req, res) => {
  const { grpName, members } = req.body;
  try {
    if (!grpName || !members) {
      throw new Error("No details entered");
    }
    const newGrp = await Group.create({
      groupName: grpName,
      members: members,
    });
    return res
      .status(201)
      .json({ message: "Group created successfully", data: newGrp });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Something went wrong" });
  }
});

app.post("/checkIfUserExists", async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid userId or groupId" });
    }


    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.includes(userId);
    if (isMember) {
      return res.status(200).json({ message: `User is already a member of the group`, group });
    }

    group.members.push(userId);
    await group.save();

    return res.status(200).json({ message: `You have joined`, group });

  } catch (e) {
    return res.status(500).json({ message: e.message || "Something went wrong" });
  }
});
