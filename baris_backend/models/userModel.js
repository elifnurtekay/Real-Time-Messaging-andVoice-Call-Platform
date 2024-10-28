const getConnection = require('../config/db');

const User = {
  findByUsername: async (username) => {
    
    connection = await getConnection();
    console.log("MySQL Bağlandı")
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    return rows[0];
  }
};

module.exports = User;
