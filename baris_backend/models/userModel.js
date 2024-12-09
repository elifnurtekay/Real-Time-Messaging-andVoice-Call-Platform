const getConnection = require('../config/db');

const User = {
  findByUsername: async (username) => {
    let connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    
    connection.release();
    return rows[0];
  },
  getUserProfileDetails: async(userId)=>{
    let connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
      CONCAT(name_ , ' ', surname) AS name,
      about,
      email
      FROM users WHERE user_id = ?`,[userId]);

    connection.release();
    
    return rows;
  }
};

module.exports = User;