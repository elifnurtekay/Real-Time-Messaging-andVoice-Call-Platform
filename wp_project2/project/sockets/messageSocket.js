const Message = require('../db/models/Message');

/**
 * Mesaj alındığında tetiklenir ve gönderene "Göründü" durumu gönderilir.
 * @param {Socket} socket - Bağlanan socket
 */
function onMessageReceived(socket) {
    socket.on('message_received', async (data) => {
        const { message_id, receiver_id } = data;

        try {
            // Mesaj durumunu "Göründü" olarak güncelle
            await Message.setMessageStatus(message_id, 'Göründü');
            console.log(`Mesaj ${message_id}, alıcı ${receiver_id} tarafından göründü.`);

            // Alıcıya "Göründü" durumunu gönder
            socket.to(receiver_id).emit('message_seen', { message_id });
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
        const { chat_id, sender_id, receiver_id, message_content } = data;

        try {
            // Mesajı veritabanına kaydet
            const newMessage = await Message.createMessage({
                chat_id,
                sender_id,
                message_content,
            });

            // Alıcıya mesajı gönder
            socket.to(receiver_id).emit('new_message', newMessage);

            console.log(`Yeni mesaj gönderildi: ${JSON.stringify(newMessage)}`);
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
        const { chat_id, sender_id, message_content } = data;

        try {
            // Tüm bağlı kullanıcılara mesaj yayınla
            socket.broadcast.emit('new_broadcast_message', { chat_id, sender_id, message_content });
            console.log('Mesaj yayınlandı:', message_content);
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
        const { chat_id, sender_id, isTyping } = data;

        try {
            // Diğer kullanıcılara "yazıyor" bilgisini gönder
            socket.to(chat_id).emit('user_typing', { sender_id, isTyping });
            console.log(`Kullanıcı ${sender_id}, "yazıyor" durumu gönderildi.`);
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

