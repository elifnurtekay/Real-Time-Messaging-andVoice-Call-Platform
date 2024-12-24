const Chat = require('../db/models/Chat'); // Chat modeli

function chatSocketHandlers(socket) {
    socket.on('joinChat', async ({ chatId, userId }) => {
        if (!chatId || !userId) {
            return socket.emit('error', { message: 'Geçersiz parametreler.' });
        }

        try {
            const chat = await Chat.findChatById(chatId);
            if (!chat) {
                return socket.emit('error', { message: 'Sohbet bulunamadı.' });
            }

            socket.join(chatId);
            console.log(`Kullanıcı ${userId}, sohbet ${chatId}'e katıldı.`);
            socket.to(chatId).emit('userJoined', { userId, chatId });
        } catch (error) {
            console.error('joinChat Hatası:', error.message);
            socket.emit('error', { message: 'Sohbete katılamadı.' });
        }
    });

    socket.on('leaveChat', async ({ chatId, userId }) => {
        if (!chatId || !userId) {
            return socket.emit('error', { message: 'Geçersiz parametreler.' });
        }

        try {
            socket.leave(chatId);
            console.log(`Kullanıcı ${userId}, sohbet ${chatId}'den ayrıldı.`);
            socket.to(chatId).emit('userLeft', { userId, chatId });
        } catch (error) {
            console.error('leaveChat Hatası:', error.message);
            socket.emit('error', { message: 'Sohbetten çıkılamadı.' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Kullanıcı bağlantısı kesildi: ${socket.id}`);
    });
}

module.exports = { chatSocketHandlers };
