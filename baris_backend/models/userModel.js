const getConnection = require('../config/db');

const User = {
  findByUsername: async (username) => {
    console.log(username)
    connection = await getConnection();
    console.log("MySQL Bağlandı")
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log(rows)
    return rows[0];
  }
};

module.exports = User;
