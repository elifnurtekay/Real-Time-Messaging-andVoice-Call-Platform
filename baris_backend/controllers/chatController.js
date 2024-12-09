const jwt = require('jsonwebtoken');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
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

const getMessagesByChatId = async (req, res) =>{
  const { chatId } = req.params;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const messages = await Message.loadMessages(chatId);
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veri tabanı hatası' });
  }
}

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
  
module.exports = { getUserChats, getMessagesByChatId, getUserFriends };
