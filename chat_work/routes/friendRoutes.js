const express = require('express');
const router = express.Router();
const { loadFriendRequests } = require('../controllers/friendController')

router.get('/requests', loadFriendRequests);

module.exports = router;