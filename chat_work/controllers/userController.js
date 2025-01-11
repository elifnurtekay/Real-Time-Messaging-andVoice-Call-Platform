const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const getConnection = require('../config/db');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');

dotenv.config();
const saltRounds = 10;

// Kullanıcı kaydı fonksiyonu
async function registerUser(name, surname, username, password, email, about) {
    let connection;
    try {
        
        // Şifre ve salt değerlerini kontrol et
        if (!password) {
            throw new Error('Şifre alanı boş olamaz.');
        }

        const userId = uuidv4(); // Benzersiz user_id oluştur
        const hashedPassword = await bcrypt.hash(password, saltRounds)
    
        connection = await getConnection(); // Bağlantıyı aç
        const query = 'INSERT INTO users (user_id, name_, surname, username, password_, email, about) VALUES (?, ?, ?, ?, ?, ?, ?)';

        await connection.execute(query, [userId, name, surname, username, hashedPassword, email, about]);
        
        connection.release(); // Bağlantıyı serbest bırak       
    } catch (error) {
        console.error('Kayıt sırasında hata oluştu:', error);
        throw error;  // Hata fırlatın ki dışarıdaki try-catch bunu yakalayabilsin
    } finally {
        if (connection && connection.release) {
            connection.release(); // Bağlantıyı serbest bırak
        }
    }
}

const loadProfileDetails = async (req,res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    try {
        const decoded = jwt.decode(token); // Sadece çözümleme
        const userId = decoded.userId; // Kullanıcının ID'si

        const profileDetail = await User.getUserProfileDetails(userId);
        res.status(200).json({ profileDetail });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: 'Veri tabanı hatası' });
    }
}

const getBlockedUsers = async(req,res) =>{
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    try {
        const decoded = jwt.decode(token); // Sadece çözümleme
        const userId = decoded.userId; // Kullanıcının ID'si

        const blockedUsers = await User.getBlockedUsers(userId);
        res.status(200).json({ blockedUsers });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ message: 'Veri tabanı hatası' });
    }
}

const findMatchedUsers = async(req, res)=>{
    const searchValue = req.body.searchQuery;
    const token = req.cookies.auth_token;
    
    if(!searchValue){
        return res.status(400).json({ message: 'Aranan metin bulunamadı.' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }
    const decoded = jwt.decode(token); // Sadece çözümleme
    const userId = decoded.userId; // Kullanıcının ID'si
    try {
        const matchedUsers = await User.findMatchedUsers(searchValue, userId);
        res.status(200).json({ exists: matchedUsers.length > 0, users: matchedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı arama sırasında hata oluştu', error });
    }
}

const getReceiverProfile = async(req, res)=>{
    const receiverUsername = req.body.username;
    try {
        const userProfileDetail = await User.getReceiverProfileDetail(receiverUsername);
        res.status(200).json({ receiverProfile: userProfileDetail });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı profil bilgisi alma hatası', error });
    }
}

const getGroupMembers = async(req, res)=>{
    const { chat_name, created_at } = req.body;
    try {
        const chatId = await Message.getChatIdForGroup(chat_name, created_at);
        const members = await User.getChatMembers(chatId);
        const membersJson = members.map(member => ({
            fullName: member.full_name,    // full_name doğrudan eklenir
            isAdmin: member.is_admin       // is_admin'ı isAdmin olarak ekle
        }));
        res.status(200).json({ members: membersJson });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı profil bilgisi alma hatası', error });
    }
}

module.exports = {
    registerUser,
    loadProfileDetails,
    getBlockedUsers,
    findMatchedUsers,
    getReceiverProfile,
    getGroupMembers
};
