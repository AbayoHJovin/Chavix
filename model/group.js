const mongoose = require('mongoose');

const User = require('./model');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
