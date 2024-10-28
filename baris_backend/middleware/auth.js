const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token;
  
    if (!token) {
      return res.status(403).json({ message: 'Yetkilendirme gerekli' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        
      if (err) return res.status(403).json({ message: 'Token geçersiz!' });
  
      req.user = user;
      next();
    });
};

module.exports = authenticateToken;
