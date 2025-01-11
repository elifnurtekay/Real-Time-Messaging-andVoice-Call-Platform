const getConnection = require('../config/db');

const Chat = {
    loadChat: async(userId)=>{
        let connection = await getConnection();
        // profile_photo_url BİLGİSİ ALINACAK
        try {
            const [rows] = await connection.execute(
                `SELECT DISTINCT
                    c.chat_id,
                    CASE 
                        WHEN c.chat_name IS NOT NULL THEN c.chat_name
                        ELSE CONCAT(u.name_, ' ', u.surname)
                    END AS chat_name,
                    CASE 
                        WHEN c.chat_name IS NOT NULL THEN CONCAT(u_sender.name_, ': ', COALESCE(m.message_content, 'Mesaj yok'))
                        ELSE COALESCE(m.message_content, 'Mesaj yok')
                    END AS last_message,
                    COALESCE(m.timestamp_, '1970-01-01 00:00:00') AS last_message_time,
                    COALESCE(m.is_read, 'Gönderilmedi') AS seen,
                    c.is_group,
                    CASE
                        WHEN c.is_group = 1 THEN c.created_at -- Sadece grup sohbeti için oluşturulma tarihi
                        ELSE NULL
                    END AS group_created_at,
                    CASE
                        WHEN c.is_group = 0 THEN (
                            SELECT u.username
                            FROM chat_members cm_receiver
                            LEFT JOIN users u ON cm_receiver.user_id = u.user_id
                            WHERE cm_receiver.chat_id = c.chat_id AND cm_receiver.user_id != ?
                            LIMIT 1
                        )
                        ELSE NULL
                    END AS receiver_username
                FROM chats c
                LEFT JOIN chat_members cm ON c.chat_id = cm.chat_id AND cm.user_id = ?
                LEFT JOIN (
                    SELECT chat_id, MAX(timestamp_) AS max_timestamp
                    FROM messages
                    WHERE status_ != 'Silindi' -- Silinmiş mesajları hariç tut
                    GROUP BY chat_id
                ) latest_messages ON c.chat_id = latest_messages.chat_id
                LEFT JOIN messages m ON c.chat_id = m.chat_id AND m.timestamp_ = latest_messages.max_timestamp
                LEFT JOIN users u_sender ON m.sender_id = u_sender.user_id
                LEFT JOIN chat_members cm_other ON c.chat_id = cm_other.chat_id AND cm_other.user_id != ?
                LEFT JOIN users u ON u.user_id = cm_other.user_id
                WHERE cm.user_id = ? AND cm.is_active = 1;`,
                [userId, userId, userId, userId]
            );
            return rows;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    fetchGroupNames: async(userId)=>{
        let connection = await getConnection();
        // profile_photo_url BİLGİSİ ALINACAK
        try {
            const [rows] = await connection.execute(
                `SELECT c.chat_name
                FROM chats c
                JOIN chat_members cm ON c.chat_id = cm.chat_id
                WHERE cm.user_id = ?
                AND c.is_group = 1;`,
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    createChat: async(chatId, groupName)=>{
        let connection = await getConnection();
        // profile_photo_url BİLGİSİ ALINACAK
        try {
            await connection.execute(
                `INSERT INTO chats 
                VALUES(?, ?, 1, DEFAULT, NULL);`,
                [chatId, groupName]
            );
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }
};

module.exports = Chat;
