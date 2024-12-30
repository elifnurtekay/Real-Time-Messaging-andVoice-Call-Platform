const getConnection = require('../config/db');

const Messages = {
    loadMessages: async(senderId, receiverUsername)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT * FROM messages 
                WHERE chat_id =
                (SELECT DISTINCT c.chat_id
                FROM chats c
                JOIN (
                    SELECT chat_id
                    FROM chat_members
                    WHERE user_id = ?
                ) senderChats ON c.chat_id = senderChats.chat_id
                JOIN (
                    SELECT chat_id
                    FROM chat_members
                    WHERE user_id = (SELECT user_id FROM users WHERE username = ?)
                ) receiverChats ON c.chat_id = receiverChats.chat_id
                WHERE c.is_group = 0);
                `,[senderId, receiverUsername]);
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
    getLastLogin: async(receiverUsername)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT last_login FROM users 
                WHERE username = ?
                `,[receiverUsername]);
            return rows[0].last_login;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    loadGroupMessages: async(chatName, createdAt)=>{
        let connection = await getConnection();
        try {
            const createdAtDate = new Date(createdAt);
            const [rows] = await connection.execute(
                `SELECT * 
                FROM messages 
                WHERE chat_id = (SELECT chat_id FROM chats WHERE chat_name = ? AND created_at = ?);
                `,[chatName, createdAtDate]);
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
    getChatId: async(senderId, receiverUsername)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT DISTINCT c.chat_id
                FROM chats c
                JOIN (
                    SELECT chat_id
                    FROM chat_members
                    WHERE user_id = ?
                ) senderChats ON c.chat_id = senderChats.chat_id
                JOIN (
                    SELECT chat_id
                    FROM chat_members
                    WHERE user_id = (SELECT user_id FROM users WHERE username = ?)
                ) receiverChats ON c.chat_id = receiverChats.chat_id
                WHERE c.is_group = 0;
                `,[senderId, receiverUsername]);
            return rows[0].chat_id;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    getChatIdForGroup: async(groupName, createdAt)=>{
        let connection = await getConnection();
        const createdAtDate = new Date(createdAt);
        try {
            const [rows] = await connection.execute(
                `SELECT chat_id 
                FROM chats 
                WHERE chat_name = ? AND created_at = ?;
                `,[groupName, createdAtDate]);
            return rows[0].chat_id;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    getReceiverId: async(chat_id, sender_id)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT user_id
                FROM chat_members
                WHERE chat_id = ? AND user_id != ?;
                `,[chat_id, sender_id]);
            return rows[0].user_id;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    saveMessagesToDB: async(messageData)=>{
        let connection = await getConnection();
        try {
            await connection.execute(`
                INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `,[messageData.message_id, messageData.sender_id,
                messageData.receiver_id, messageData.chat_id,
                messageData.message_content, messageData.timestamp_,
                messageData.is_read, messageData.status_,
                messageData.updated_at    
                ]
            );
        } catch (error) {
            console.error('Veri tabanı kaydetme hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    setMessageStatus: async(messageId, is_read)=>{
        let connection = await getConnection();
        console.log(messageId, is_read);
        try {
            await connection.execute(`
                UPDATE messages 
                SET is_read = ? 
                WHERE message_id = ?;
                `, [is_read, messageId]);
        } catch (error) {
            console.error('[setMessageStatus] Hata:', error.message);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }
}

module.exports = Messages;
