const getConnection = require('../config/db');

const Chat = {
    loadChat: async(userId)=>{
        let connection = await getConnection();
        // is_group BİLGİSİ ALINACAK
        // profile_photo_url BİLGİSİ ALINACAK
        const [rows] = await connection.execute(
            `SELECT DISTINCT
                c.chat_id,
                CASE 
                    WHEN c.chat_name IS NOT NULL THEN c.chat_name
                    ELSE CONCAT(u.name_, ' ', u.surname)
                END AS chat_name,
                CASE 
                    WHEN c.chat_name IS NOT NULL THEN CONCAT(u_sender.name_, ': ', m.message_content)
                    ELSE m.message_content
                END AS last_message,
                m.timestamp_ AS last_message_time,
                m.is_read AS seen,
                c.is_group
            FROM chats c
            LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id AND cm.user_id = ?
            LEFT JOIN messages m ON c.chat_id = m.chat_id 
                AND m.message_id = (
                    SELECT MAX(message_id) FROM messages WHERE chat_id = c.chat_id
                )
            LEFT JOIN users u_sender ON m.sender_id = u_sender.user_id
            LEFT JOIN chat_members cm_other ON c.chat_id = cm_other.chat_id AND cm_other.user_id != ?
            LEFT JOIN users u ON u.user_id = cm_other.user_id
            WHERE cm.user_id = ? AND cm.is_active = 1;`,
            [userId, userId, userId]
        );
        connection.release();
        return rows;
    }
};

module.exports = Chat;
