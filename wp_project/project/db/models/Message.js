const db = require('../connection'); // Veritabanı bağlantısı

class Message {
    /**
     * Yeni bir mesaj oluşturur ve kaydeder.
     * @param {object} messageData - Mesaj verisi { chatId, senderId, content, status }
     * @returns {Promise<object>} Oluşturulan mesaj bilgisi
     */
    static async createMessage(messageData) {
        try {
            const { chatId, senderId, content, status } = messageData;

            if (!chatId || !senderId || !content) {
                throw new Error('Sohbet ID, gönderici ID ve mesaj içeriği zorunludur.');
            }

            const query = `INSERT INTO messages (chat_id, sender_id, content, status, created_at) 
                           VALUES (?, ?, ?, ?, NOW())`;
            const [result] = await db.execute(query, [chatId, senderId, content, status || 'Gönderildi']);

            return {
                id: result.insertId,
                chatId,
                senderId,
                content,
                status: status || 'Gönderildi',
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error('createMessage Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Belirtilen sohbet ID'sine ait mesajları getirir.
     * @param {number} chatId - Sohbet ID
     * @param {object} paginationParams - Sayfalama parametreleri { limit, offset }
     * @returns {Promise<array>} Mesaj listesi
     */
    static async findMessagesByChatId(chatId, paginationParams = { limit: 10, offset: 0 }) {
        try {
            const { limit, offset } = paginationParams;

            const query = `SELECT * FROM messages 
                           WHERE chat_id = ? 
                           ORDER BY created_at ASC 
                           LIMIT ? OFFSET ?`;
            const [rows] = await db.execute(query, [chatId, limit, offset]);

            return rows;
        } catch (error) {
            console.error('findMessagesByChatId Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Bir mesajın içeriğini günceller.
     * @param {number} messageId - Mesaj ID
     * @param {string} updatedContent - Güncellenmiş içerik
     * @returns {Promise<boolean>} Güncelleme başarılıysa true
     */
    static async updateMessage(messageId, updatedContent) {
        try {
            const query = `UPDATE messages SET content = ?, updated_at = NOW() WHERE id = ?`;
            const [result] = await db.execute(query, [updatedContent, messageId]);

            return result.affectedRows > 0; // Güncelleme başarılıysa true döner
        } catch (error) {
            console.error('updateMessage Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Mesajı veritabanından siler.
     * @param {number} messageId - Mesaj ID
     * @returns {Promise<boolean>} Silme başarılıysa true
     */
    static async deleteMessage(messageId) {
        try {
            const query = `DELETE FROM messages WHERE id = ?`;
            const [result] = await db.execute(query, [messageId]);

            return result.affectedRows > 0; // Silme başarılıysa true döner
        } catch (error) {
            console.error('deleteMessage Hatası:', error.message);
            throw error;
        }
    }

    /**
     * Mesaj durumunu günceller (Gönderildi, İletildi, Görüldü gibi).
     * @param {number} messageId - Mesaj ID
     * @param {string} status - Yeni mesaj durumu
     * @returns {Promise<boolean>} Güncelleme başarılıysa true
     */
    static async setMessageStatus(messageId, status) {
        try {
            const query = `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?`;
            const [result] = await db.execute(query, [status, messageId]);

            return result.affectedRows > 0; // Güncelleme başarılıysa true döner
        } catch (error) {
            console.error('setMessageStatus Hatası:', error.message);
            throw error;
        }
    }
}

module.exports = Message;

