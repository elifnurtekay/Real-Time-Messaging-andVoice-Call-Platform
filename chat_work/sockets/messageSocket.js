const Message = require('../models/messageModel');
const User = require('../models/userModel');
const { getSocketId } = require('./onlineUsers');

let actions = [];

/**
 * Mesaj alındığında tetiklenir ve gönderene "Görüldü" durumu gönderilir.
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

    socket.on('group_message_received', async (data) => {
        const { success, action, group_name, msg_Id, senderId, message_id } = data;
        const socketId = getSocketId(senderId);
        const groupName = getGroupSlug(group_name);
        const roomSize = socket.adapter.rooms.get(groupName)?.size || 0;

        try {
            if(success){
                actions.push(action);
                let messageStatus;
                if(actions.length === roomSize - 1){
                    for(let i = 0; i < actions.length; i++){
                        if(actions[i] === 'forwarded'){
                            messageStatus = 'forwarded'
                            await Message.setMessageStatus(message_id, 'İletildi');
                            socket.to(socketId).emit('message_forwarded', msg_Id);
                            break;
                        }else{
                            messageStatus = 'seen'
                        }
                    }
                    if(messageStatus === 'seen'){
                        await Message.setMessageStatus(message_id, 'Görüldü');
                        socket.to(socketId).emit('message_seen', msg_Id);
                    }else{
                        console.log("Mesaj iletildi.")
                    }
                }else{
                    await Message.setMessageStatus(message_id, 'İletildi');
                    socket.to(socketId).emit('message_forwarded', msg_Id);
                }
                actions = [];
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
    socket.on('send_group_message', async (data, senderId, group_name, msg_Id, message_id) => {
        const { content, date } = data;
        console.log(group_name);
        console.log(typeof(group_name));
        const groupName = getGroupSlug(group_name);
        
        try {
            // Tüm bağlı kullanıcılara mesaj yayınla
            const senderUsername = await User.getUsernameById(senderId);
            socket.broadcast.to(groupName).emit('new_group_message', senderUsername, group_name, content, date, senderId, msg_Id, message_id);
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

function getGroupSlug(groupName) {
    return groupName
    .toLowerCase()
    .replace(/ç/g, 'c')         // 'ç' -> 'c'
    .replace(/ğ/g, 'g')         // 'ğ' -> 'g'
    .replace(/ı/g, 'i')         // 'ı' -> 'i'
    .replace(/ö/g, 'o')         // 'ö' -> 'o'
    .replace(/ş/g, 's')         // 'ş' -> 's'
    .replace(/ü/g, 'u')         // 'ü' -> 'u'
    .replace(/[.]/g, '-')       // '.' -> '-'
    .replace(/[^\w\s-]/g, '')   // Diğer özel karakterleri kaldırır
    .replace(/\s+/g, '-')       // Boşlukları `-` ile değiştirir
    .replace(/--+/g, '-')       // Ardışık tireleri tek tireye dönüştürür
    .trim(); // Baş ve sondaki boşlukları kaldırır
}

module.exports = { messageSocketHandlers };
