const express = require('express');
const router = express.Router();

const {
  createGroup,
  getGroupsByUser,
  getGroupMessages,
  sendGroupMessage
} = require('../controller/groupController');

router.post('/create', createGroup);               // ✅ for /api/group/create
router.get('/:userId', getGroupsByUser);           // ✅ for /api/group/:userId
router.get('/chat/:groupId', getGroupMessages);    // ✅ for /api/group/chat/:groupId
router.post('/message', sendGroupMessage);         // ✅ for /api/group/message

module.exports = router;
