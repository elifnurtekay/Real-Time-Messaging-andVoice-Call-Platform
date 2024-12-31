const express = require('express');
const router = express.Router();
const chatMemberController = require('../controllers/chatMemberController');
const protectedRoute = require('../middleware/protectedRoute');

// Belirli bir sohbete üye ekle
router.post('/:chatId/members', protectedRoute, chatMemberController.addMemberToChat);

// Belirli bir sohbete ait üyeleri al
router.get('/:chatId/members', protectedRoute, chatMemberController.getChatMembers);

// Kullanıcının katıldığı sohbetleri al
router.get('/my-chats', protectedRoute, chatMemberController.getUserChats);   //aynısı chatMemberControllers da da var

module.exports = router;
