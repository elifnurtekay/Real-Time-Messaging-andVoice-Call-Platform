const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const login = async (req, res) => {
  const { username, password } = req.body;
    
  try {
    const user = await User.findByUsername(username);

    if (!user) return res.status(401).json({ message: "Kullanıcı bulunamadı" });

    const isPasswordValid = await bcrypt.compare(password, user.password_);

    if (!isPasswordValid) return res.status(401).json({ message: "Şifre yanlış" });

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false, // HTTPS üzerinde çalışıyorsanız true yapın
      maxAge: 60 * 60 * 1000 // 1 saat
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

// Korumalı route
const protectedRoute = async (req, res) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.status(401).json({ message: 'Yetkisiz erişim' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Erişim izni verildi', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = { login, protectedRoute };