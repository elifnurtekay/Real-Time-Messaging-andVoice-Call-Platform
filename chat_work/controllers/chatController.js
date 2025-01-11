const jwt = require('jsonwebtoken');
const Chat = require('../models/chatModel');
const Friend = require('../models/friendModel');

const getUserChats = async (req, res) => {
  // Cookie'den token'ı al
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı.' });
  }
  
  try {
    // Token'dan user_id'yi çözümle
    const decoded = jwt.decode(token); // Sadece çözümleme
    const userId = decoded.userId; // Kullanıcının ID'si
        
    // Kullanıcıya ait chat'leri getir
    const chats = await Chat.loadChat(userId)
    res.status(200).json({ chats });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: 'Veri tabanı hatası' });
  }
};

const getUserFriends = async (req, res) =>{
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı.' });
  }
  try {
    // Token'dan user_id'yi çözümle
    const decoded = jwt.decode(token); // Sadece çözümleme
    const userId = decoded.userId; // Kullanıcının ID'si
        
    // Kullanıcıya ait friend'leri getir
    const friends = await Friend.loadFriend(userId);
    res.status(200).json({ friends });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: 'Veri tabanı hatası' });
  }
}
  
module.exports = { 
  getUserChats, 
  getUserFriends 
};
