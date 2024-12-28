const Message = require('../models/messageModel');
const User = require('../models/userModel');
const { getSocketId } = require('./onlineUsers');

/**
 * Mesaj alındığında tetiklenir ve gönderene "Göründü" durumu gönderilir.
 * @param {Socket} socket - Bağlanan socket
 */
function onMessageReceived(socket) {
    socket.on('message_received', async (data) => {
        const { messageId, receiverId } = data;

        try {
            // Mesaj durumunu "Göründü" olarak güncelle
            await Message.setMessageStatus(messageId, 'Göründü');
            console.log(`Mesaj ${messageId}, alıcı ${receiverId} tarafından göründü.`);

            // Alıcıya "Göründü" durumunu gönder
            socket.to(receiverId).emit('message_seen', { messageId });
        } catch (error) {
            console.error('onMessageReceived Hatası:', error.message);
        }
    });
}

/**
 * Yeni mesaj gönderildiğinde diğer kullanıcıya iletir ve durumu günceller.
 * @param {Socket} socket - Bağlanan socket
 */
function onSendMessage(socket) {
    socket.on('send_message', async (data) => {
        const { senderId, receiverId, content, date } = data;

        try {
            const socketId = getSocketId(receiverId);
            const senderUsername = await User.getUsernameById(senderId);
            // Alıcıya mesajı gönder
            socket.to(socketId).emit('message_received', senderUsername, content, date);

            console.log(`Yeni mesaj gönderildi: ${content}`);
        } catch (error) {
            console.error('onSendMessage Hatası:', error.message);
        }
    });
}

/**
 * Mesajı tüm bağlı kullanıcılara yayınlar.
 * @param {Socket} socket - Bağlanan socket
 */
function onBroadcastMessage(socket) {
    socket.on('broadcast_message', (data) => {
        const { chatId, senderId, content } = data;

        try {
            // Tüm bağlı kullanıcılara mesaj yayınla
            socket.broadcast.emit('new_broadcast_message', { chatId, senderId, content });
            console.log('Mesaj yayınlandı:', content);
        } catch (error) {
            console.error('onBroadcastMessage Hatası:', error.message);
        }
    });
}

/**
 * Kullanıcının yazıyor bilgisini diğerine gönderir.
 * @param {Socket} socket - Bağlanan socket
 */
function onTypingStatus(socket) {
    socket.on('typing_status', (data) => {
        const { chatId, senderId, isTyping } = data;

        try {
            // Diğer kullanıcılara "yazıyor" bilgisini gönder
            socket.to(chatId).emit('user_typing', { senderId, isTyping });
            console.log(`Kullanıcı ${senderId}, "yazıyor" durumu gönderildi.`);
        } catch (error) {
            console.error('onTypingStatus Hatası:', error.message);
        }
    });
}

/**
 * Tüm mesajlaşma event handler'larını yükler.
 * @param {Socket} socket - Bağlanan socket
 */
function messageSocketHandlers(socket) {
    onMessageReceived(socket);
    onSendMessage(socket);
    onBroadcastMessage(socket);
    onTypingStatus(socket);
}

module.exports = { messageSocketHandlers };
