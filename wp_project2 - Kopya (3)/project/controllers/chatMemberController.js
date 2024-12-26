const ChatMember = require('../db/models/chatMember');

/**
 * Belirli bir sohbete üye ekler.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.addMemberToChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { userId, isAdmin } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Sohbet ID ve kullanıcı ID gereklidir.',
            });
        }

        const memberId = await ChatMember.addMember(chatId, userId, isAdmin || false);
        return res.status(201).json({
            success: true,
            message: 'Üye başarıyla eklendi.',
            memberId,
        });
    } catch (error) {
        console.error('addMemberToChat Hatası:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Üye eklenirken bir hata oluştu.',
        });
    }
};

/**
 * Belirli bir sohbete ait üyeleri getirir.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.getChatMembers = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: 'Sohbet ID gereklidir.',
            });
        }

        const members = await ChatMember.getMembersByChatId(chatId);
        return res.status(200).json({
            success: true,
            message: 'Sohbet üyeleri başarıyla alındı.',
            members,
        });
    } catch (error) {
        console.error('getChatMembers Hatası:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Üyeler alınırken bir hata oluştu.',
        });
    }
};

/**
 * Kullanıcının katıldığı sohbetleri getirir.
 * @param {Request} req - HTTP isteği
 * @param {Response} res - HTTP yanıtı
 */
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user?.userId; // JWT ile doğrulanmış kullanıcı ID'si

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı doğrulanamadı.',
            });
        }

        const chats = await ChatMember.getUserChats(userId);
        return res.status(200).json({
            success: true,
            message: 'Kullanıcı sohbetleri başarıyla alındı.',
            chats,
        });
    } catch (error) {
        console.error('getUserChats Hatası:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Sohbetler alınırken bir hata oluştu.',
        });
    }
};
