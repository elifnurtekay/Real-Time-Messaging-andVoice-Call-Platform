const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Korumalı route middleware
 */
module.exports = (req, res, next) => {
  // Token'i Cookie veya Authorization header'dan al
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Erişim izni yok. Lütfen oturum açın.' 
    });
  }

  try {
    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcı bilgilerini req.user'a ata
    req.user = decoded;

    // İşlemi bir sonraki middleware veya route'a yönlendir
    next();
  } catch (error) {
    console.error('Token doğrulama hatası:', error.message);
    res.status(403).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token.', 
      error: error.message 
    });
  }
};
