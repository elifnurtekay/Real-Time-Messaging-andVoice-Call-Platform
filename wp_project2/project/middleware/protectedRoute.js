const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Korumalı route middleware
 */
const protectedRoute = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Erişim izni yok. Lütfen oturum açın.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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

module.exports = protectedRoute;
