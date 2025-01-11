const express = require('express');
const router = express.Router();
const { getUserCalls } = require('../controllers/callController');

router.get('/load', getUserCalls);

module.exports = router;