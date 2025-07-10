const GroupModel = require('../models/ConversationModel').GroupModel;
const MessageModel = require('../models/ConversationModel').MessageModel;

/**
 * Create a new group
 * POST /api/group/create
 */
const createGroup = async (req, res) => {
  try {
    const { name, members, createdBy, profile_pic } = req.body;

    if (!name || !members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group must have a name and at least 2 members.",
      });
    }

    const group = await GroupModel.create({
      name,
      members,
      createdBy,
      profile_pic,
    });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all groups for a user
 * GET /api/group/:userId
 */
const getGroupsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const groups = await GroupModel.find({ members: userId }).populate('members');
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get messages of a specific group
 * GET /api/group/chat/:groupId
 */
const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const messages = await MessageModel.find({ groupId }).populate('msgByUserId');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send a new message in group
 * POST /api/group/message
 */
const sendGroupMessage = async (req, res) => {
  try {
    const { text, groupId, senderId, imageUrl, videoUrl } = req.body;

    if (!groupId || !senderId || !(text || imageUrl || videoUrl)) {
      return res.status(400).json({ success: false, message: "Message must contain content." });
    }

    const message = await MessageModel.create({
      text,
      msgByUserId: senderId,
      groupId,
      imageUrl,
      videoUrl,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGroup,
  getGroupsByUser,
  getGroupMessages,
  sendGroupMessage,
};