const mongoose = require('mongoose');

/* ------------------------------------------------------------------ */
/* Message Schema — supports direct and group messages                */
/* ------------------------------------------------------------------ */

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: '',
      trim: true,
    },

    imageUrl: {
      type: String,
      default: '',
    },

    videoUrl: {
      type: String,
      default: '',
    },

    seen: {
      type: Boolean,
      default: false,
    },

    msgByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null, // 🆕 Optional: message belongs to a group
    },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------------ */
/* Conversation Schema — for direct 1-on-1 chats                      */
/* ------------------------------------------------------------------ */

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  { timestamps: true }
);

conversationSchema.index(
  { sender: 1, receiver: 1 },
  { unique: false }
);

conversationSchema.virtual('lastMessage', {
  ref: 'Message',
  localField: 'messages',
  foreignField: '_id',
  justOne: true,
  options: { sort: { createdAt: -1 } },
});

/* ------------------------------------------------------------------ */
/* Group Schema                                                       */
/* ------------------------------------------------------------------ */

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    profile_pic: {
      type: String,
      default: '',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------------ */
/* Model Exports                                                      */
/* ------------------------------------------------------------------ */

const MessageModel = mongoose.model('Message', messageSchema);
const ConversationModel = mongoose.model('Conversation', conversationSchema);
const GroupModel = mongoose.model('Group', groupSchema);

module.exports = {
  MessageModel,
  ConversationModel,
  GroupModel,
};