const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getuserDetailsfromtoken = require("../helpers/getuserdetailsfromtoken");
const getConversation = require("../helpers/getconversation");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", (socket) => {
  console.log("Connected user:", socket.id);

  const token = socket.handshake.auth.token;

  // Get current user details
  getuserDetailsfromtoken(token).then(async (user) => {
    if (!user) {
      console.error("Invalid user token");
      return;
    }

    // Join a room specific to the user
    socket.join(user._id?.toString());
    onlineUser.add(user._id?.toString());

    io.emit("onlineUser", Array.from(onlineUser));

    // Handle message-page event
    socket.on("message-page", async (userId) => {
      const userDetails = await UserModel.findById(userId).select("-password");

      if (!userDetails) {
        console.error(`User not found: ${userId}`);
        return;
      }

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };

      socket.emit("message-user", payload);

      // Get previous messages
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user._id, reciever: userId },
          { sender: userId, reciever: user._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      if (getConversationMessage) {
        socket.emit("message", getConversationMessage?.messages);
      } else {
        socket.emit("message", []);
      }
    });

    // Handle new message event
    socket.on("new message", async (data) => {
      const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = data;

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender, reciever: receiver },
          { sender: receiver, reciever: sender },
        ],
      });

      if (!conversation) {
        const newConversation = new ConversationModel({
          sender,
          reciever: receiver,
        });
        conversation = await newConversation.save();
      }

      const message = new MessageModel({
        text,
        imageUrl,
        videoUrl,
        msgByUserId,
      });
      const savedMessage = await message.save();

      await ConversationModel.updateOne(
        { _id: conversation._id },
        { $push: { messages: savedMessage._id } }
      );

      const updatedConversation = await ConversationModel.findOne({
        $or: [
          { sender, reciever: receiver },
          { sender: receiver, reciever: sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(sender).emit("message", updatedConversation.messages || []);
      io.to(receiver).emit("message", updatedConversation.messages || []);

      //send conversation
      const conversationSender = await getConversation(sender);
      const conversationReceiver = await getConversation(receiver);

      io.to(sender).emit("conversation", conversationSender);
      io.to(receiver).emit("conversation", conversationReceiver);
    });

    // Handle sidebar event
    socket.on("sidebar", async (currentUserId) => {
      const conversation = await getConversation(currentUserId);
      socket.emit("conversation", conversation);
    });

    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, reciever: msgByUserId },
          { sender: msgByUserId, reciever: user?._id },
        ],
      });

      const conversationmsegId = conversation?.messages || [];

      const updataMessages = await MessageModel.updateMany(
        {
          _id: { $in: conversationmsegId },
          msgByUserId: msgByUserId,
        },
        { $set: { seen: true } }
      );
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user._id?.toString());
      io.emit("onlineUser", Array.from(onlineUser));
      console.log("Disconnected user:", socket.id);
    });
  });
});

module.exports = { app, server };
