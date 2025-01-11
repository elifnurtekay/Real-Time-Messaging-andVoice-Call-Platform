const jwt = require('jsonwebtoken');
const Call = require('../models/callModel');

const getUserCalls = async(req,res) => {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı.' });
    }
    try {
        // Token'dan user_id'yi çözümle
        const decoded = jwt.decode(token); // Sadece çözümleme
        const userId = decoded.userId; // Kullanıcının ID'si

        const calls = await Call.fetchCall(userId);
        res.status(200).json({ calls })
    } catch (error){
        console.error("Hata:", error);
        res.status(500).json({ message: 'Veri tabanı hatası' });
    }
}

module.exports = { getUserCalls }
