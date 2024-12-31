const Chat = require('../db/models/Chat'); // Chat modelini içe aktar

/**
 * Yeni bir sohbet oluşturur.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.createChat = async (req, res) => {
    try {
        const { chat_name, is_group, chat_photo_url } = req.body;

        if (is_group === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Sohbet tipi (bireysel veya grup) belirtilmelidir.',
            });
        }

        const newChat = await Chat.createChat({ chat_name, is_group, chat_photo_url });
        res.status(201).json({ success: true, chat: newChat });
    } catch (error) {
        console.error('createChat Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Belirtilen sohbet ID'sine ait bilgileri getirir.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.getChatById = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const chat = await Chat.findChatById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Sohbet bulunamadı.' });
        }

        res.status(200).json({ success: true, chat });
    } catch (error) {
        console.error('getChatById Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Sohbete yeni bir üye ekler.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.addMemberToChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const { userId, isAdmin } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı ID gereklidir.',
            });
        }

        const success = await Chat.addMemberToChat(chatId, userId, isAdmin || false);
        if (success) {
            res.status(200).json({ success: true, message: 'Kullanıcı sohbete eklendi.' });
        }
    } catch (error) {
        console.error('addMemberToChat Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Sohbetten bir üyeyi çıkarır.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.removeMemberFromChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const userId = req.params.userId;

        const success = await Chat.removeMemberFromChat(chatId, userId);
        if (success) {
            res.status(200).json({ success: true, message: 'Kullanıcı sohbetten çıkarıldı.' });
        } else {
            res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
    } catch (error) {
        console.error('removeMemberFromChat Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Sohbet bilgilerini günceller.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.updateChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const updatedData = req.body;

        const success = await Chat.updateChat(chatId, updatedData);
        if (success) {
            res.status(200).json({ success: true, message: 'Sohbet güncellendi.' });
        } else {
            res.status(404).json({ success: false, message: 'Sohbet bulunamadı.' });
        }
    } catch (error) {
        console.error('updateChat Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Kullanıcının sohbet listesini getirir.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user.id; // Oturum açmış kullanıcı ID'si
        const chats = await Chat.getChatsByUserId(userId);

        res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error('getUserChats Hatası:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};