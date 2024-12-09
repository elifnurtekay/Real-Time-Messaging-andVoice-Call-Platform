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
    }
}

module.exports = Friend;
