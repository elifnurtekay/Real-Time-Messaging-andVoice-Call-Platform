const express = require('express');
const { getMessageByChatId, deleteMessage, setMessageStatus, saveMessage } = require('../controllers/messageControllers');
const protectedRoute = require('../middleware/protectedRoute'); // Koruma için middleware

const router = express.Router();

/**
 * @route GET /message/:chatId
 * @desc Belirli bir sohbetin mesajlarını getirir
 * @access Private
 */
router.get('/:chatId', protectedRoute, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const paginationParams = {
      limit: req.query.limit || 20,
      offset: req.query.offset || 0,
    };
    const messages = await getMessageByChatId(chatId, paginationParams);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Mesajları alma hatası:', error);
    res.status(500).json({ success: false, message: 'Mesajlar alınamadı' });
  }
});

/**
 * @route DELETE /message/:messageId
 * @desc Bir mesajı siler
 * @access Private
 */
router.delete('/:messageId', protectedRoute, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    await deleteMessage(messageId);
    res.status(200).json({ success: true, message: 'Mesaj başarıyla silindi' });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    res.status(500).json({ success: false, message: 'Mesaj silinemedi' });
  }
});

/**
 * @route POST /message/status
 * @desc Mesaj durumunu günceller
 * @access Private
 */
router.post('/status', protectedRoute, async (req, res) => {
  try {
    const { messageId, status } = req.body;
    await setMessageStatus(messageId, status);
    res.status(200).json({ success: true, message: 'Mesaj durumu güncellendi' });
  } catch (error) {
    console.error('Mesaj durumu güncelleme hatası:', error);
    res.status(500).json({ success: false, message: 'Mesaj durumu güncellenemedi' });
  }
});

/**
 * @route POST /message
 * @desc Yeni mesaj kaydeder
 * @access Private
 */
router.post('/', protectedRoute, async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    const newMessage = await saveMessage(chatId, senderId, content);
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Mesaj kaydetme hatası:', error);
    res.status(500).json({ success: false, message: 'Mesaj kaydedilemedi' });
  }
});

module.exports = router;
