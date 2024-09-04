const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserId }, { reciever: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("reciever");

    const conversations = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv.messages.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return prev + (curr.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      return {
        _id: conv._id,
        sender: conv.sender,
        receiver: conv.reciever,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv.messages.length - 1] || {},
      };
    });

    return conversations;
  } else {
    return [];
  }
};

module.exports = getConversation;
