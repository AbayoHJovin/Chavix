const mongoose = require("mongoose");

const dmSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
dmSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const Dms = mongoose.model("Dms", dmSchema);
module.exports = Dms;
