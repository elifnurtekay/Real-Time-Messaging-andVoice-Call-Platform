const express = require('express');
const router = express.Router();
const { login, protectedRoute, getUserId} = require('../controllers/authController');

router.post('/login', login);
router.get('/anasayfa', protectedRoute);
router.get('/get-user-id', getUserId);

module.exports = router;
