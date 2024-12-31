const express = require('express');
const router = express.Router();
const { blockUser, unblockUser } = require('../controllers/blockedUser');
const checkBlocked = require('../middleware/checkBlocked');

router.post('/block', checkBlocked, blockUser);
router.post('/unblock', checkBlocked, unblockUser);

module.exports = router;
