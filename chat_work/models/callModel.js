const getConnection = require('../config/db');

const Call = {
    fetchCall: async(userId)=>{
        let connection;
        try {
            connection = await getConnection(); // Bağlantıyı al
            const [rows] = await connection.execute(`
                SELECT 
                    cl.call_id,
                    cl.caller_id,
                    cl.callee_id,
                    CASE
                        WHEN cl.callee_id = ? THEN CONCAT(caller_user.name_, ' ', caller_user.surname)
                        ELSE CONCAT(callee_user.name_, ' ', callee_user.surname)
                    END AS other_user_name,
                    cl.chat_id,
                    cl.call_type,
                    cl.started_at,
                    cl.ended_at,
                    cl.duration,
                    cl.was_successful,
                    cl.is_missed
                FROM 
                    call_logs AS cl
                JOIN 
                    users AS caller_user ON cl.caller_id = caller_user.user_id
                JOIN 
                    users AS callee_user ON cl.callee_id = callee_user.user_id
                WHERE 
                    cl.caller_id = ?
                    OR cl.callee_id = ?;
            `, [userId, userId, userId]);

            return rows;
        } catch (error) {
            console.error('Veri tabanı sorgu hatası:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release(); // Bağlantıyı serbest bırak
            }
        }
    }
}

module.exports = Call;
