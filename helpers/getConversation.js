const { ConversationModel } = require("../models/ConversationModel");

/**
 * Get all conversations for a user, ordered by last update.
 * Returns meta‑data for sidebar (unseen count, lastMsg, etc.).
 *
 * @param {string} currentUserId – MongoDB ObjectId string of the logged‑in user
 * @returns {Promise<Array>}     – List of conversation objects
 */
const getConversation = async (currentUserId) => {
  if (!currentUserId) return [];

  // 1️⃣  Fetch conversations where user is either sender or receiver
  const conversations = await ConversationModel.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("receiver")
    .lean(); // 🚀 lean improves read performance (no Mongoose doc overhead)

  // 2️⃣  Transform each conversation to sidebar‑friendly format
  return conversations.map((conv) => {
    // Count unseen messages *from the OTHER user*
    const unseenMsg = (conv.messages || []).reduce((count, msg) => {
      const msgBy = msg?.msgByUserId?.toString();
      return msgBy !== currentUserId ? count + (msg.seen ? 0 : 1) : count;
    }, 0);

    return {
      _id: conv._id,
      sender: conv.sender,
      receiver: conv.receiver,
      unseenMsg,
      lastMsg: conv.messages?.[conv.messages.length - 1] || null,
    };
  });
};

module.exports = getConversation;
