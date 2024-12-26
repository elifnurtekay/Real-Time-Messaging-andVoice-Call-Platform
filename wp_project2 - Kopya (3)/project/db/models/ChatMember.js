const db = require('../connection'); // Veritabanı bağlantısını içeren modül
const { v4: uuidv4 } = require('uuid'); // UUID oluşturmak için

/**
 * ChatMember modeli
 */
const ChatMember = {
    /**
     * Yeni bir üye ekler.
     * @param {string} chatId - Sohbetin ID'si.
     * @param {string} userId - Kullanıcının ID'si.
     * @param {boolean} isAdmin - Kullanıcının admin olup olmadığı.
     * @returns {Promise<string>} Eklenen üyenin ID'si.
     */
    async addMember(chatId, userId, isAdmin = false) {
        const memberId = uuidv4();
        const query = `
            INSERT INTO chat_members (member_id, chat_id, user_id, is_admin)
            VALUES (?, ?, ?, ?)
        `;
        await db.execute(query, [memberId, chatId, userId, isAdmin]);
        return memberId;
    },

    /**
     * Belirli bir sohbete ait tüm üyeleri getirir.
     * @param {string} chatId - Sohbetin ID'si.
     * @returns {Promise<object[]>} Sohbetteki üyelerin listesi.
     */
    async getMembersByChatId(chatId) {
        const query = `
            SELECT cm.*, u.username, u.email
            FROM chat_members cm
            JOIN users u ON cm.user_id = u.user_id
            WHERE cm.chat_id = ? AND cm.is_active = TRUE
        `;
        const [rows] = await db.execute(query, [chatId]);
        return rows;
    },

    /**
     * Belirli bir üyeyi sohbetten çıkarır.
     * @param {string} chatId - Sohbetin ID'si.
     * @param {string} userId - Kullanıcının ID'si.
     * @returns {Promise<boolean>} İşlemin başarılı olup olmadığı.
     */
    async removeMember(chatId, userId) {
        const query = `
            UPDATE chat_members
            SET is_active = FALSE, left_at = CURRENT_TIMESTAMP
            WHERE chat_id = ? AND user_id = ?
        `;
        const [result] = await db.execute(query, [chatId, userId]);
        return result.affectedRows > 0;
    },

    /**
     * Kullanıcının katıldığı sohbetleri getirir.
     * @param {string} userId - Kullanıcının ID'si.
     * @returns {Promise<object[]>} Kullanıcının katıldığı sohbetlerin listesi.
     */
    async getUserChats(userId) {
        const query = `
            SELECT c.*
            FROM chat_members cm
            JOIN chats c ON cm.chat_id = c.chat_id
            WHERE cm.user_id = ? AND cm.is_active = TRUE
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }
};

module.exports = ChatMember;
