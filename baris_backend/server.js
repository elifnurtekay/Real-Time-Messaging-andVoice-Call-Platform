const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const callRoutes = require('./routes/callRoutes');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const authenticateToken = require('./middleware/auth');
const cookieParser = require('cookie-parser'); // cookie-parser modülünü dahil edin

dotenv.config(); // Çevresel değişkenleri yükle
const app = express();
app.use(express.json()); // JSON isteği gövdesini işlemek için
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Kullanıcı rotalarını ekle
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/call', callRoutes);

// Ana sayfa rotası (HTML dosyasını sun)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Korunan rotayı tanımlayın
app.get('/anasayfa', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
