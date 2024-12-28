const express = require('express');
const router = express.Router();
const { getUserChats, getUserFriends } = require('../controllers/chatController');

router.get('/load', getUserChats);
router.get('/friends', getUserFriends);

module.exports = router;
