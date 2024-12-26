const Friend = require('../db/models/Friend');

/**
 * Yeni arkadaşlık isteği gönderir.
 */
exports.sendFriendRequest = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        await Friend.sendFriendRequest(user1Id, user2Id);
        res.status(200).json({ success: true, message: 'Arkadaşlık isteği gönderildi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Kullanıcının arkadaşlık isteklerini getirir.
 */
exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.params.userId;
        const requests = await Friend.getFriendRequests(userId);
        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Arkadaşlık isteğini kabul eder.
 */
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        const success = await Friend.acceptFriendRequest(user1Id, user2Id);
        res.status(success ? 200 : 404).json({ success, message: success ? 'Arkadaşlık isteği kabul edildi.' : 'Arkadaşlık isteği bulunamadı.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Arkadaşlık isteğini reddeder.
 */
exports.rejectFriendRequest = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        const success = await Friend.rejectFriendRequest(user1Id, user2Id);
        res.status(success ? 200 : 404).json({ success, message: success ? 'Arkadaşlık isteği reddedildi.' : 'Arkadaşlık isteği bulunamadı.' });
    } catch (error) {
       
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * Kullanıcının mevcut arkadaşlarını getirir.
 */
exports.getFriends = async (req, res) => {
    try {
        const userId = req.params.userId;
        const friends = await Friend.getFriends(userId);
        res.status(200).json({ success: true, friends });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


