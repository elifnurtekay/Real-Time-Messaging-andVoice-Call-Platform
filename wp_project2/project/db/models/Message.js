const db = require('../connection'); // Veritabanı bağlantısı

class Message {
    /**
     * Yeni bir mesaj oluşturur ve kaydeder.
     * @param {object} messageData - Mesaj verisi 
     * @param {string} messageData.chatId - Sohbet ID
     * @param {string} messageData.senderId - Gönderici ID
     * @param {string} messageData.messageContent - Mesaj içeriği
     * @param {string} [messageData.isRead] - Mesaj durumu (Gönderildi, İletildi, Görüldü)
     * @returns {Promise<object>} - Oluşturulan mesaj bilgisi
     */
    static async createMessage(messageData) {
        try {
            const { chatId, senderId, messageContent, isRead } = messageData;

            if (!chatId || !senderId || !messageContent) {
                throw new Error('Sohbet ID, gönderici ID ve mesaj içeriği zorunludur.');
            }

            const query = `
                INSERT INTO messages (chat_id, sender_id, message_content, is_read, timestamp_) 
                VALUES (?, ?, ?, ?, NOW())`;
            const [result] = await db.execute(query, [
                chatId,
                senderId,
                messageContent,
                isRead || 'Gönderildi',
            ]);

            return {
                messageId: result.insertId,
                chatId,
                senderId,
                messageContent,
                isRead: isRead || 'Gönderildi',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            console.error('[createMessage] Hata:', error.message, messageData);
            throw error;
        }
    }

    /**
     * Belirtilen sohbet ID'sine ait mesajları getirir.
     * @param {string} chatId - Sohbet ID
     * @param {object} [paginationParams] - Sayfalama parametreleri
     * @param {number} [paginationParams.limit=10] - Kaç mesaj getirileceği
     * @param {number} [paginationParams.offset=0] - Başlangıç noktası
     * @returns {Promise<array>} - Mesaj listesi
     */
    static async findMessagesByChatId(chatId, paginationParams = { limit: 10, offset: 0 }) {
        const { limit, offset } = paginationParams;
        try {
            const query = `
                SELECT * FROM messages 
                WHERE chat_id = ? 
                ORDER BY timestamp_ ASC 
                LIMIT ? OFFSET ?`;
            const [rows] = await db.execute(query, [chatId, limit, offset]);

            return rows;
        } catch (error) {
            console.error('[findMessagesByChatId] Hata:', error.message);
            throw error;
        }
    }

    /**
     * Bir mesajın içeriğini günceller.
     * @param {string} messageId - Mesaj ID
     * @param {string} updatedContent - Güncellenmiş içerik
     * @returns {Promise<boolean>} - Güncelleme başarılıysa true
     */
    static async updateMessage(messageId, updatedContent) {
        try {
            const query = `
                UPDATE messages 
                SET message_content = ?, updated_at = NOW() 
                WHERE message_id = ?`;
            const [result] = await db.execute(query, [updatedContent, messageId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('[updateMessage] Hata:', error.message);
            throw error;
        }
    }

    /**
     * Mesajı veritabanından siler.
     * @param {string} messageId - Mesaj ID
     * @returns {Promise<boolean>} - Silme başarılıysa true
     */
    static async deleteMessage(messageId) {
        try {
            const query = `DELETE FROM messages WHERE message_id = ?`;
            const [result] = await db.execute(query, [messageId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('[deleteMessage] Hata:', error.message);
            throw error;
        }
    }

    /**
     * Mesaj durumunu günceller (Gönderildi, İletildi, Görüldü gibi).
     * @param {string} messageId - Mesaj ID
     * @param {string} status - Yeni mesaj durumu
     * @returns {Promise<boolean>} - Güncelleme başarılıysa true
     */
    static async setMessageStatus(messageId, status) {
        try {
            const query = `
                UPDATE messages 
                SET is_read = ?, updated_at = NOW() 
                WHERE message_id = ?`;
            const [result] = await db.execute(query, [status, messageId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('[setMessageStatus] Hata:', error.message);
            throw error;
        }
    }
}

module.exports = Message;
