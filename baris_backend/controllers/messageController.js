const Message = require('../models/messageModel');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const sendMessage = async (req, res) => {
    const token = req.cookies.auth_token;
    let senderId = null;
    if (token) {
        const decoded = jwt.decode(token);
        senderId = decoded.userId;
    } else {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    const { variableData, messageContent, chatType } = req.body;
    const messageId = uuidv4();

    // Tarih formatı
    const now = new Date();
    const localTimestamp = now.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    const [date, time] = localTimestamp.split(" ");
    const [day, month, year] = date.split(".");
    const sqlTimestamp = `${year}-${month}-${day} ${time}`;
    
    const isRead = "Gönderildi";
    const status = "Orijinal";

    let chatId = null;
    try {
        if(chatType === "1"){
            chatId = await Message.getChatIdForGroup(variableData.group_name, variableData.created_at);
        }else{
            chatId = await Message.getChatId(senderId, variableData.receiver_username);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Veri tabanı hatası' });
    }

    let receiverId = null;
    try {
        if(chatType === "0"){
            receiverId = await Message.getReceiverId(chatId, senderId);
        }else{
            receiverId = null;
        }       
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: 'Alıcı ID bulunamadı.' });
    }
    
    const allMessageData = {
        message_id: messageId,
        sender_id: senderId,
        receiver_id: receiverId,
        chat_id: chatId,
        message_content: messageContent,
        timestamp_: sqlTimestamp,
        is_read: isRead,
        status_: status,
        updated_at: sqlTimestamp
    };

    try {
        await Message.saveMessagesToDB(allMessageData);
        res.status(200).json({ allMessageData });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: 'Mesajlar veri tabanına kaydedilemedi.' });
    }

};

const getMessagesFromChatData = async (req, res) =>{
    const { chatName, variableData, chatType } = req.body;
    const token = req.cookies.auth_token;
    let senderId = null;
    if (token) {
        const decoded = jwt.decode(token);
        senderId = decoded.userId;
    } else {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
        if(chatType === "1"){
            const messages = await Message.loadGroupMessages(chatName, variableData.createdAt);
            res.status(200).json({ messages });
        }else{
            const messages = await Message.loadMessages(senderId, variableData.receiverUsername);
            // Üst kısımda göstermek için last_login bilgisini döndür
            const lastLogin = await Message.getLastLogin(variableData.receiverUsername);
            const status = await Message.getStatus(variableData.receiverUsername);
            res.status(200).json({ messages, lastLogin, status });
        }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Veri tabanı hatası' });
    }
  }

module.exports = { 
    sendMessage, 
    getMessagesFromChatData
};
