const db = require('../connection'); // Veritabanı bağlantısı

class Friend {
    /**
     * Yeni arkadaşlık isteği oluşturur.
     * @param {string} user1Id - İsteği gönderen kullanıcı.
     * @param {string} user2Id - İsteği alan kullanıcı.
     * @returns {Promise<object>} Yeni arkadaşlık kaydı.
     */
    static async sendFriendRequest(user1Id, user2Id) {
        const query = `INSERT INTO friends (user1_id, user2_id, status_) VALUES (?, ?, 'Beklemede')`;
        const [result] = await db.execute(query, [user1Id, user2Id]);
        return result;
    }

    /**
     * Kullanıcının arkadaşlık isteklerini getirir.
     * @param {string} userId - Kullanıcı ID.
     * @returns {Promise<object[]>} Arkadaşlık istekleri.
     */
    static async getFriendRequests(userId) {
        const query = `SELECT * FROM friends WHERE user2_id = ? AND status_ = 'Beklemede'`;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    /**
     * Bir arkadaşlık isteğini kabul eder.
     * @param {string} user1Id - İsteği gönderen kullanıcı.
     * @param {string} user2Id - İsteği alan kullanıcı.
     * @returns {Promise<boolean>} Güncelleme başarılı mı.
     */
    static async acceptFriendRequest(user1Id, user2Id) {
        const query = `UPDATE friends SET status_ = 'Kabul Edildi' WHERE user1_id = ? AND user2_id = ?`;
        const [result] = await db.execute(query, [user1Id, user2Id]);
        return result.affectedRows > 0;
    }

    /**
     * Bir arkadaşlık isteğini reddeder.
     * @param {string} user1Id - İsteği gönderen kullanıcı.
     * @param {string} user2Id - İsteği alan kullanıcı.
     * @returns {Promise<boolean>} Güncelleme başarılı mı.
     */
    static async rejectFriendRequest(user1Id, user2Id) {
        const query = `UPDATE friends SET status_ = 'Reddedildi' WHERE user1_id = ? AND user2_id = ?`;
        const [result] = await db.execute(query, [user1Id, user2Id]);
        return result.affectedRows > 0;
    }

    /**
    * Kullanıcının mevcut arkadaşlarını getirir.
    * @param {string} userId - Kullanıcı ID.
    * @returns {Promise<object[]>} Kullanıcının arkadaş listesi.
    */
    static async getFriends(userId) {
        const query = `
            SELECT 
                u.user_id, u.username, u.profile_photo_url 
            FROM 
                friends f
            JOIN 
                users u 
            ON 
                (f.user1_id = u.user_id AND f.user2_id = ?) OR (f.user2_id = u.user_id AND f.user1_id = ?)
            WHERE 
                f.status_ = 'Kabul Edildi'
        `;
        const [rows] = await db.execute(query, [userId, userId]);
        return rows;
    }

}

module.exports = Friend;
