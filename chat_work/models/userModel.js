const getConnection = require('../config/db');

const User = {
  findByUsername: async (username) => {
    let connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?;', [username]);

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
      FROM users WHERE user_id = ?;`,[userId]);

    connection.release();
    
    return rows;
  },
  getBlockedUsers: async(userId)=>{
    let connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT
        CONCAT(u.name_, ' ', u.surname) AS name_, 
        u.username, 
        u.email
      FROM blocked_users bu
      JOIN users u ON bu.blocked_id = u.user_id
      WHERE bu.blocker_id = ?;`,[userId]);

    connection.release();
    
    return rows;
  },
  findMatchedUsers: async(searchValue, userId)=>{
    let connection = await getConnection();
    try {
      const [rows] = await connection.execute(`
        SELECT 
	        CONCAT(name_, ' ', surname) AS full_name,
	        username
        FROM users
        WHERE 
	        user_id != ?
	        AND (
            username LIKE CONCAT('%', ?, '%')
            OR name_ LIKE CONCAT('%', ?, '%')
            OR surname LIKE CONCAT('%', ?, '%')
          );
        `,[userId, searchValue, searchValue, searchValue]);
      return rows;
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      connection.release();
    }
    
  },
  getUsernameById: async (userId) => {
    let connection = await getConnection();
    try {
      const [rows] = await connection.execute('SELECT username FROM users WHERE user_id = ?;', [userId]);
      return rows[0].username;
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      if (connection){
        connection.release();
      }
    }
  },
  getReceiverProfileDetail: async (username) => {
    let connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT name_,
        surname,
        username,
        email,
        about
        FROM users WHERE username = ?;`, [username]);
      return rows;
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      if (connection){
        connection.release();
      }
    }
    
  },
  getChatMembers: async(chatId)=>{
    let connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
	        CONCAT(u.name_, ' ', u.surname) AS full_name, 
	        cm.is_admin
        FROM chat_members cm
        JOIN users u 
        ON cm.user_id = u.user_id
        WHERE cm.chat_id = ?;`, [chatId]);
      return rows;
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      if (connection){
        connection.release();
      }
    }
  },
  addLastLogin: async(userId) => {
    let connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE users
        SET last_login = CURRENT_TIMESTAMP,
        status_ = "çevrim içi"
        WHERE user_id = ?`, [userId]);
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      if (connection){
        connection.release();
      }
    }
  },
  setOnlineStatus: async(userId) => {
    let connection = await getConnection();
    console.log(userId);
    try {
      await connection.execute(
        `UPDATE users
        SET last_login = CURRENT_TIMESTAMP,
        status_ = "çevrim dışı"
        WHERE user_id = ?`, [userId]);
    } catch (error) {
      console.error('SQL Hatası:', error);
      throw error;
    } finally {
      if (connection){
        connection.release();
      }
    }
  }
};

module.exports = User;
