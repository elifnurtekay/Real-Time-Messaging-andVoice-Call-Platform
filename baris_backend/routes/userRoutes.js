const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loadProfileDetails, 
    getBlockedUsers, 
    findMatchedUsers,
    getReceiverProfile,
    getGroupMembers
} = require('../controllers/userController'); // Fonksiyonunuzu doğru import edin

// Kayıt rotası
router.post('/register', async (req, res) => {
    const { name, surname, username, password, email, about } = req.body;
    
    if (!name || !surname || !username || !password || !email) {
        return res.status(400).json({ message: 'Ad, soyad, kullanıcı adı, şifre ve e-mail zorunludur' });
    }

    try {
        await registerUser(name, surname, username, password, email, about);
        res.status(201).json({ message: 'Kayıt başarılı!' });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    // Token cookie'sini temizle
    res.clearCookie('auth_token');
    res.send('Logged out and token cleared.');
});

router.get('/profile', loadProfileDetails);
router.get('/blocked', getBlockedUsers);
router.post('/find', findMatchedUsers);
router.post('/get-receiver-profile', getReceiverProfile);
router.post('/get-group-members', getGroupMembers);

module.exports = router;
