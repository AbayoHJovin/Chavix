const mongoose = require("mongoose");
const messages = new mongoose.Schema({
  dm: { type: mongoose.Schema.Types.ObjectId, ref: "Dms", required: true },
  text: { type: String, required: true },
});

const model = mongoose.model("messages", messages);
module.exports = model;
