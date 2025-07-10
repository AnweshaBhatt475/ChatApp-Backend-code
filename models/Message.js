const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  imageUrl: String,
  videoUrl: String,
  audioUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
