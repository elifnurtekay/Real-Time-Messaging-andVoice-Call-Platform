const getConnection = require('../config/db');

const User = {
  findByUsername: async (username) => {
    let connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    connection.release();
    return rows[0];
  }
};

module.exports = User;