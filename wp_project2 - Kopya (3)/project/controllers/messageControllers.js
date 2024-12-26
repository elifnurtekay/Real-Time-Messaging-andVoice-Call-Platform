const Message = require('../db/models/Message'); // Message modelini içe aktar

/**
 * Belirli bir sohbete ait mesajları getirir.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.getMessageByChatId = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const { limit, offset } = req.query;

        const paginationParams = {
            limit: parseInt(limit, 10) || 10,
            offset: parseInt(offset, 10) || 0,
        };

        const messages = await Message.findMessagesByChatId(chatId, paginationParams);
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('getMessageByChatId Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mesajı siler.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;

        const success = await Message.deleteMessage(messageId);
        if (success) {
            res.status(200).json({ success: true, message: 'Mesaj başarıyla silindi.' });
        } else {
            res.status(404).json({ success: false, message: 'Mesaj bulunamadı.' });
        }
    } catch (error) {
        console.error('deleteMessage Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mesajın durumunu günceller.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.setMessageStatus = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const { is_read } = req.body; // Yeni model yapısına göre `is_read` kullanılıyor.

        if (!is_read) {
            return res.status(400).json({ success: false, message: 'Durum bilgisi gereklidir.' });
        }

        const success = await Message.setMessageStatus(messageId, is_read);
        if (success) {
            res.status(200).json({ success: true, message: 'Mesaj durumu güncellendi.' });
        } else {
            res.status(404).json({ success: false, message: 'Mesaj bulunamadı.' });
        }
    } catch (error) {
        console.error('setMessageStatus Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Yeni mesajı kaydeder.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.saveMessage = async (req, res) => {
    try {
        const { chat_id, sender_id, message_content, receiver_id } = req.body; // Yeni model yapısına uygun isimlendirme

        if (!chat_id || !sender_id || !message_content) {
            return res.status(400).json({
                success: false,
                message: 'Sohbet ID, gönderici ID ve mesaj içeriği gereklidir.',
            });
        }

        const newMessage = await Message.createMessage({
            chatId: chat_id,
            senderId: sender_id,
            content: message_content,
            receiverId: receiver_id,
        });

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error('saveMessage Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
