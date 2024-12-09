const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const getConnection = require('../config/db');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

        const [result] = await connection.execute(query, [userId, name, surname, username, hashedPassword, email, about]);
        
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

module.exports = {
    registerUser,
    loadProfileDetails
};
