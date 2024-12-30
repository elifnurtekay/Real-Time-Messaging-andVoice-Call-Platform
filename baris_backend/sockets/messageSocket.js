const Message = require('../models/messageModel');
const User = require('../models/userModel');
const { getSocketId } = require('./onlineUsers');

/**
 * Mesaj alındığında tetiklenir ve gönderene "Göründü" durumu gönderilir.
 * @param {Socket} socket - Bağlanan socket
 */
function onMessageReceived(socket) {
    socket.on('message_received', async (data) => {
        const { success, action, msg_Id, senderId, message_id } = data;
        const socketId = getSocketId(senderId);

        try {
            if(success){
                if(action === 'seen'){
                    await Message.setMessageStatus(message_id, 'Görüldü');
                    socket.to(socketId).emit('message_seen', msg_Id);
                }else{
                    await Message.setMessageStatus(message_id, 'İletildi');
                    socket.to(socketId).emit('message_forwarded', msg_Id);
                }
            }else{
                console.log('Mesaj bulunamadı.');
            }
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
    socket.on('send_message', async (data, sender_id, receiver_id, msg_Id, message_id) => {
        const { content, date } = data;

        try {
            const socketId = getSocketId(receiver_id);
            const senderUsername = await User.getUsernameById(sender_id);
            socket.to(socketId).emit('message_received', senderUsername, content, date, sender_id, msg_Id, message_id); 
            
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
