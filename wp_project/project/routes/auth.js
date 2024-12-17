const express = require('express');
const authController = require('../controllers/authControllers');
const protectedRoute = require('../middleware/protectedRoute');

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', authController.register);

// Kullanıcı girişi (email veya username ile)
router.post('/login', authController.login);

// Korumalı route
router.get('/protected', protectedRoute.protectedRoute);

// Şifre sıfırlama isteği
router.post('/forgot-password', authController.forgotpassword);

// Şifre sıfırlama
router.post('/reset-password', authController.resetpassword);


module.exports = router;
