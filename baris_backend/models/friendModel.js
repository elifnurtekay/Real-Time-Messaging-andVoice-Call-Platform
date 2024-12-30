const getConnection = require('../config/db');
const Friend = {
    loadFriend: async(userId)=>{
        let connection = await getConnection();
        const [rows] = await connection.execute(
            `SELECT 
            CASE 
                WHEN user1_id = ? THEN user2_id 
                ELSE user1_id 
            END AS other_user_id,
            users.name_,
            users.surname,
            users.about,
            f.started_at,
            f.status_
            FROM friends f
            JOIN users 
            ON users.user_id = CASE 
                            WHEN user1_id = ? THEN user2_id 
                            ELSE user1_id 
                        END
            WHERE user1_id = ? OR user2_id = ?;`,
            [userId, userId, userId, userId]);
            
        connection.release();
        return rows;
    },
    getFriendIdFromUsername: async(username)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT user_id 
                FROM users 
                WHERE username = ?;`,
                [username]);
            return rows[0].user_id;
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    insertFriendRequest: async(currentUserId, otherUserId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `INSERT INTO friends  
                VALUES (?, ?, DEFAULT, 'Beklemede');`,
                [currentUserId, otherUserId]);
            const [rows] = await connection.execute(
                `SELECT username 
                FROM users 
                WHERE user_id = ?;`,
                [currentUserId]
            );
            return rows[0].username;
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }, 
    loadFriendRequests: async(userId)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT 
                users.username,
                f.started_at
                FROM friends f
                JOIN users
                ON users.user_id = f.user1_id
                WHERE f.user2_id = ? AND f.status_ = 'Beklemede';`,
                [userId]);
            return rows;
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    checkFriendRequest: async(currentUserId, otherUserId)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT *
                FROM friends 
                WHERE (user1_id = ? AND user2_id = ?) 
                OR (user1_id = ? AND user2_id = ?);`,
                [currentUserId, otherUserId, otherUserId, currentUserId]);
            return rows;
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    updateFriendRequest: async(currentUserId, otherUserId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `UPDATE friends 
                SET 
                    status_ = 'Beklemede', 
                    started_at = CURRENT_TIMESTAMP  
                WHERE (user1_id = ? AND user2_id = ?) 
                OR (user1_id = ? AND user2_id = ?);`,
                [currentUserId, otherUserId, otherUserId, currentUserId]);
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    getCurrentUsername: async(userId)=>{
        let connection = await getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT username 
                FROM users 
                WHERE user_id = ?;`,
                [userId]);
            return rows[0].username;
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    updateFriendRequestRejected: async(currentUserId, otherUserId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `UPDATE friends 
                SET status_ = 'Reddedildi' 
                WHERE (user1_id = ? AND user2_id = ?) 
                OR (user1_id = ? AND user2_id = ?);`,
                [currentUserId, otherUserId, otherUserId, currentUserId]);
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    updateFriendRequestAccepted: async(currentUserId, otherUserId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `UPDATE friends 
                SET status_ = 'Kabul Edildi' 
                WHERE (user1_id = ? AND user2_id = ?) 
                OR (user1_id = ? AND user2_id = ?);`,
                [currentUserId, otherUserId, otherUserId, currentUserId]);
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    createIndividualChat: async(chatId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `INSERT INTO chats 
                VALUES (?, NULL, 0, DEFAULT, NULL);`,
                [chatId]);
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    },
    insertChatMembers: async(memberId, chatId, userId)=>{
        let connection = await getConnection();
        try {
            await connection.execute(
                `INSERT INTO chat_members 
                VALUES (?, ?, ?, DEFAULT, NULL, NULL, DEFAULT);`,
                [memberId, chatId, userId]);
        } catch (error) {
            console.error('Veri tabanı hatası:', error);
            throw error;
        } finally {
            if(connection){
                connection.release();
            }
        }
    }
};

module.exports = Friend;
