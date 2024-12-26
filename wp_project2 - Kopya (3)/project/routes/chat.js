const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatControllers');
const protectedRoute = require('../middleware/protectedRoute');  //kullanıcı oturumunu doğrulamak için 

// Yeni bir sohbet oluştur
router.post('/', chatController.createChat);

// Belirli bir sohbeti getir
router.get('/:chatId', chatController.getChatById);

// Sohbete üye ekle
router.post('/:chatId/members', chatController.addMemberToChat);

// Sohbetten üye çıkar
router.delete('/:chatId/members/:userId', chatController.removeMemberFromChat);

// Sohbet bilgilerini güncelle
router.put('/:chatId', chatController.updateChat);

// Kullanıcının sohbet listesini al
router.get('/my-chats', protectedRoute, chatController.getUserChats);

module.exports = router;
