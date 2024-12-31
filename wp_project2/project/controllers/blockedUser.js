const BlockedUser = require('../models/BlockedUser');

exports.blockUser = async (req, res) => {
    const { blockedId } = req.body;
    const blockerId = req.user?.userId;

    if (!blockedId || !blockerId) {
        return res.status(400).json({ success: false, message: 'Eksik parametreler.' });
    }

    try {
        await BlockedUser.blockUser(blockerId, blockedId);
        res.status(200).json({ success: true, message: 'Kullanıcı bloklandı.' });
    } catch (error) {
        console.error('blockUser Hatası:', { message: error.message, blockerId, blockedId });
        res.status(500).json({ success: false, message: 'Kullanıcı bloklanamadı.' });
    }
};

exports.unblockUser = async (req, res) => {
    const { blockedId } = req.body;
    const blockerId = req.user?.userId;

    if (!blockedId || !blockerId) {
        return res.status(400).json({ success: false, message: 'Eksik parametreler.' });
    }

    try {
        const result = await BlockedUser.unblockUser(blockerId, blockedId);
        if (result) {
            res.status(200).json({ success: true, message: 'Kullanıcı blok kaldırıldı.' });
        } else {
            res.status(404).json({ success: false, message: 'Blok bulunamadı.' });
        }
    } catch (error) {
        console.error('unblockUser Hatası:', { message: error.message, blockerId, blockedId });
        res.status(500).json({ success: false, message: 'Blok kaldırma başarısız.' });
    }
};
