const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
});

const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('🔌  User connected:', socket.id);

  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token).catch(() => null);
  if (!user || !user._id) {
    console.log('❌  Invalid / missing token. Disconnecting:', socket.id);
    return socket.disconnect();
  }

  const userId = user._id.toString();
  socket.userId = userId;

  socket.join(userId);
  onlineUser.add(userId);
  io.emit('onlineUser', Array.from(onlineUser));
  console.log('✅  Joined room:', userId);

  socket.on('message-page', async (receiverId) => {
    try {
      const receiver = await UserModel.findById(receiverId).select('-password');
      socket.emit('message-user', {
        _id: receiver?._id,
        name: receiver?.name,
        email: receiver?.email,
        profile_pic: receiver?.profile_pic,
        online: onlineUser.has(receiverId),
      });

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId }
        ]
      }).sort({ createdAt: 1 });

      socket.emit('message', messages);
    } catch (err) {
      console.error('❗ message-page error:', err.message);
    }
  });

  socket.on('new message', async (data) => {
    try {
      const msg = new Message({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data.msgByUserId,
      });
      await msg.save();

      const messages = await Message.find({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender }
        ]
      }).sort({ createdAt: 1 });

      io.to(data.sender).emit('message', messages);
      io.to(data.receiver).emit('message', messages);
    } catch (err) {
      console.error('❗ new message error:', err.message);
    }
  });

  socket.on('seen', async (msgByUserId) => {
    try {
      await Message.updateMany(
        {
          sender: msgByUserId,
          receiver: userId,
          msgByUserId,
          seen: false,
        },
        { $set: { seen: true } }
      );

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: msgByUserId },
          { sender: msgByUserId, receiver: userId }
        ]
      });

      io.to(userId).emit('message', messages);
      io.to(msgByUserId).emit('message', messages);
    } catch (err) {
      console.error('❗ seen error:', err.message);
    }
  });

  socket.on('delete-message', async ({ messageId, userId: receiverId }) => {
    try {
      await Message.findByIdAndDelete(messageId);

      const messages = await Message.find({
        $or: [
          { sender: socket.userId, receiver: receiverId },
          { sender: receiverId, receiver: socket.userId }
        ]
      });

      io.to(socket.userId).emit('message', messages);
      io.to(receiverId).emit('message', messages);
    } catch (err) {
      console.error('❗ delete-message error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    onlineUser.delete(userId);
    io.emit('onlineUser', Array.from(onlineUser));
    console.log('❌  Disconnected:', socket.id);
  });
});

module.exports = {
  app,
  server,
};
