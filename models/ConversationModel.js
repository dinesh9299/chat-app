const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "", // Fixed typo 'dafault' to 'default'
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const ConversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    reciever: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "message",
      },
    ],
  },
  {
    timestamps: true, // This will also add createdAt and updatedAt fields to the conversation schema
  }
);

const ConversationModel = mongoose.model("conversation", ConversationSchema);

const MessageModel = mongoose.model("message", messageSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
