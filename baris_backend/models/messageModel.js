const getConnection = require('../config/db');

const Messages = {
    loadMessages: async(chatId)=>{
        let connection = await getConnection();
        const [rows] = await connection.execute(`
            SELECT * FROM messages WHERE chat_id = ?;`,[chatId]);
        return rows;
    }
}

module.exports = Messages;
