const express = require('express');
const friendControllers = require('../controllers/friendControllers');

//console.log('Friend Controllers:', friendControllers); // Debugging

const router = express.Router();

router.post('/send', friendControllers.sendFriendRequest);
router.get('/requests/:userId', friendControllers.getFriendRequests);
router.post('/accept', friendControllers.acceptFriendRequest);
router.post('/reject', friendControllers.rejectFriendRequest);
router.get('/friends/:userId', friendControllers.getFriends);

module.exports = router;
