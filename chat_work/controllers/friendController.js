const jwt = require('jsonwebtoken');
const Friend = require('../models/friendModel');

const loadFriendRequests = async (req, res) => {
    const token = req.cookies.auth_token
    let userId = null;
    if (token) {
        const decoded = jwt.decode(token);
        userId = decoded.userId;
    } else {
        return res.status(401).json({ message: 'Token bulunamadı.' });
    }

    try {
        const requests = await Friend.loadFriendRequests(userId);
        res.status(200).json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Veri tabanı hatası' });
    }
}

module.exports = { loadFriendRequests };
