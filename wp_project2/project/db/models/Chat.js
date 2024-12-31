const db = require('../connection'); // Veritabanı bağlantısı
const { v4: uuidv4 } = require('uuid'); // UUID oluşturmak için

class Chat {
    /**
     * Yeni bir sohbet (bireysel veya grup) oluşturur.
     * @param {object} chatData - Sohbet verisi { chat_name, is_group, chat_photo_url }
     * @returns {Promise<object>} Oluşturulan sohbet bilgisi
     */
    static async createChat(chatData) {
        try {
            const { chat_name, is_group, chat_photo_url } = chatData;

            if (is_group === undefined) {
                throw new Error('Sohbet tipi (bireysel veya grup) belirtilmelidir.');
            }

            const chat_id = uuidv4();
            const query = `INSERT INTO chats (chat_id, chat_name, is_group, chat_photo_url, created_at) 
                           VALUES (?, ?, ?, ?, NOW())`;
            await db.execute(query, [chat_id, chat_name, is_group, chat_photo_url]);

            return {
                chat_id,
                chat_name,
                is_group,
                chat_photo_url,
                created_at: new Date().toISOString(),
            };
        } catch (error) {
            console.error('createChat Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Belirtilen sohbet ID'sine göre sohbet bilgilerini getirir.
     * @param {string} chatId - Sohbet ID
     * @returns {Promise<object|null>} Sohbet bilgisi veya null
     */
    static async findChatById(chatId) {
        try {
            const query = `SELECT * FROM chats WHERE chat_id = ?`;
            const [rows] = await db.execute(query, [chatId]);

            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error('findChatById Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Sohbete yeni bir üye ekler.
     * @param {string} chatId - Sohbet ID
     * @param {string} userId - Kullanıcı ID
     * @param {boolean} isAdmin - Kullanıcıyı admin olarak ekleme durumu
     * @returns {Promise<boolean>} Ekleme başarılıysa true
     */
    static async addMemberToChat(chatId, userId, isAdmin = false) {
        try {
            const member_id = uuidv4();
            const query = `INSERT INTO chat_members (member_id, chat_id, user_id, is_admin, joined_at) 
                           VALUES (?, ?, ?, ?, NOW())`;
            await db.execute(query, [member_id, chatId, userId, isAdmin]);

            return true;
        } catch (error) {
            console.error('addMemberToChat Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Bir üyeyi sohbetten çıkarır (aktifliğini pasif yapar).
     * @param {string} chatId - Sohbet ID
     * @param {string} userId - Kullanıcı ID
     * @returns {Promise<boolean>} Çıkarma başarılıysa true
     */
    static async removeMemberFromChat(chatId, userId) {
        try {
            const query = `UPDATE chat_members 
                           SET is_active = FALSE, left_at = NOW() 
                           WHERE chat_id = ? AND user_id = ?`;
            const [result] = await db.execute(query, [chatId, userId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('removeMemberFromChat Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Sohbet bilgilerini günceller.
     * @param {string} chatId - Sohbet ID
     * @param {object} updatedData - Güncellenecek veriler { chat_name, chat_photo_url }
     * @returns {Promise<boolean>} Güncelleme başarılıysa true
     */
    static async updateChat(chatId, updatedData) {
        try {
            const { chat_name, chat_photo_url } = updatedData;

            const query = `UPDATE chats 
                           SET chat_name = ?, chat_photo_url = ? 
                           WHERE chat_id = ?`;
            const [result] = await db.execute(query, [chat_name, chat_photo_url, chatId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('updateChat Hatası:', error.message);
            throw error;
        }
    }
    /**
    * Kullanıcıya ait sohbet listesini getirir.
    * @param {string} userId - Kullanıcı ID
    * @returns {Promise<array>} Kullanıcının sohbet listesi
    */
    static async getChatsByUserId(userId) {
        try {
            const query = `
                SELECT c.chat_id, c.chat_name, c.is_group, c.chat_photo_url, cm.is_admin, cm.joined_at
                FROM chat_members cm
                INNER JOIN chats c ON cm.chat_id = c.chat_id
                WHERE cm.user_id = ? AND cm.is_active = TRUE
                ORDER BY cm.joined_at DESC
            `;
            const [rows] = await db.execute(query, [userId]);
            return rows;
        } catch (error) {
            console.error('getChatsByUserId Hatası:', error.message);
            throw error;
        }
    }

}

module.exports = Chat;
