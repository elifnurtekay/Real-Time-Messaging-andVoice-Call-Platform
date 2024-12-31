const BlockedUser = require('../db/models/BlockedUser');

function blockedUserSocketHandlers(socket, io) {
    socket.on('sendMessage', async ({ fromUserId, toUserId, message }) => {
        if (!fromUserId || !toUserId || !message) {
            return socket.emit('error', { message: 'Geçersiz parametreler.' });
        }

        try {
            // Kullanıcının engellenip engellenmediğini kontrol et
            const isBlocked = await BlockedUser.isUserBlocked(toUserId, fromUserId);
            if (isBlocked) {
                return socket.emit('messageBlocked', { message: 'Kullanıcı sizi engelledi.' });
            }

            // Mesaj alıcısının socket odasına mesaj gönder
            const targetSocket = io.sockets.sockets.get(toUserId); // Kullanıcı ID'sini socket ID ile eşleştir
            if (targetSocket) {
                io.to(toUserId).emit('receiveMessage', { fromUserId, message });
            } else {
                socket.emit('error', { message: 'Mesaj alıcıya ulaştırılamadı. Kullanıcı çevrimdışı olabilir.' });
            }
        } catch (error) {
            console.error('sendMessage Hatası:', {
                error: error.message,
                fromUserId,
                toUserId,
                message,
            });
            socket.emit('error', { message: 'Mesaj gönderilemedi.' });
        }
    });
}

module.exports = { blockedUserSocketHandlers };
