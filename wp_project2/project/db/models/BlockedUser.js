const db = require('../connection');

class BlockedUser {
    static async blockUser(blockerId, blockedId) {
        try {
            const query = `INSERT INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)`;
            const [result] = await db.execute(query, [blockerId, blockedId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('blockUser Hatası:', error.message, { blockerId, blockedId });
            throw error;
        }
    }

    static async unblockUser(blockerId, blockedId) {
        try {
            const query = `DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`;
            const [result] = await db.execute(query, [blockerId, blockedId]);
            if (result.affectedRows === 0) {
                console.warn('unblockUser: İşlem başarısız, blok bulunamadı.', { blockerId, blockedId });
            }
            return result.affectedRows > 0;
        } catch (error) {
            console.error('unblockUser Hatası:', error.message, { blockerId, blockedId });
            throw error;
        }
    }

    static async isUserBlocked(blockerId, blockedId) {
        try {
            const query = `SELECT 1 FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`;
            const [rows] = await db.execute(query, [blockerId, blockedId]);
            return rows.length > 0;
        } catch (error) {
            console.error('isUserBlocked Hatası:', error.message, { blockerId, blockedId });
            throw error;
        }
    }
}

module.exports = BlockedUser;
