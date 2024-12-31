const Chat = require('../models/chatModel');
const { v4: uuidv4 } = require('uuid');
const Friend = require('../models/friendModel');
const jwt = require('jsonwebtoken');
const { getSocketId } = require('./onlineUsers');

/**
 * Chat ile ilgili socket işlemleri
 * @param {Socket} socket - Bağlı socket instance'ı
 */
function chatSocketHandlers(socket) {
    // Yeni bir sohbet oluştur
    socket.on('create_chat', async (data) => {
        const { friendList, group_name } = data;

        const chatId = uuidv4();
        console.log(chatId, group_name);
        try {
            await Chat.createChat(chatId, group_name);
        } catch (error) {
            console.error('Sohbet oluşturma hatası (socket):', error.message);
        }

        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
        let user_id = null;
        if(token){
            try {
                const decoded = jwt.decode(token); // Sadece çözümleme
                user_id = decoded.userId;
            } catch (error) {
                console.error('Token çözülemedi', error.message);
            }
        }
        
        try {
            const memberId = uuidv4();
            await Friend.insertChatMembers(memberId, chatId, user_id)
        } catch (error) {
            console.error('User member eklenemedi', error.message);
        }

        let friendIds = [];
        try {
            for (const friend of friendList) {
                const memberId = uuidv4();
                const userId = await Friend.getFriendIdFromUsername(friend);
                friendIds.push(userId);
                await Friend.insertChatMembers(memberId, chatId, userId)
            }
        } catch (error) {
            console.error('Arkadaşlar gruba eklenemedi', error.message);
        }
        
        const roomSlug = createRoomSlug(group_name);
        socket.join(roomSlug);
        for (const friendId of friendIds) {
            const socket_id = getSocketId(friendId);
            if(socket_id){
                socket.to(socket_id).emit('join_new_group_room', roomSlug);
            }
        }
        socket.emit('group_created');
    });

    socket.on('joinRoom', (roomSlug) => {
        socket.join(roomSlug);
        socket.emit('joined_a_group');
    })
}

function createRoomSlug(groupName) {
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

module.exports = { chatSocketHandlers };
