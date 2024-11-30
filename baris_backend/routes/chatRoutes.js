const express = require('express');
const router = express.Router();
const { getUserChats, getMessagesByChatId } = require('../controllers/chatController');

router.get('/load', getUserChats);
router.get('/:chatId/messages', getMessagesByChatId)

module.exports = router;
