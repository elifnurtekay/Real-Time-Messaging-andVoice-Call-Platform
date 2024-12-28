const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesFromChatData} = require('../controllers/messageController')

router.post('/fetch', getMessagesFromChatData);
router.post('/send', sendMessage);

module.exports = router;