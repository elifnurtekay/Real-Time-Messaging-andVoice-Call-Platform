const express = require('express');
const router = express.Router();
const { getUserChats, getMessagesByChatId, getUserFriends } = require('../controllers/chatController');

router.get('/load', getUserChats);
router.get('/:chatId/messages', getMessagesByChatId);
router.get('/friends', getUserFriends);

module.exports = router;
