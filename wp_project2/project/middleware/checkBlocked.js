const BlockedUser = require('../models/BlockedUser');

async function checkBlocked(req, res, next) {
    const { fromUserId, toUserId } = req.body;

    try {
        const isBlocked = await BlockedUser.isUserBlocked(toUserId, fromUserId);
        if (isBlocked) {
            return res.status(403).json({ success: false, message: 'Mesaj gönderilemiyor, kullanıcı sizi engelledi.' });
        }
        next();
    } catch (error) {
        console.error('checkBlocked Hatası:', error.message);
        res.status(500).json({ success: false, message: 'Blok kontrolü yapılamadı.' });
    }
}

module.exports = checkBlocked;
