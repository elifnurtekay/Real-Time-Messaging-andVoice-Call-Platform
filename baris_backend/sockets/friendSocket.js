const Friend = require('../models/friendModel');
const jwt = require('jsonwebtoken');
const { getSocketId } = require('./onlineUsers');
const { v4: uuidv4 } = require('uuid');

/**
 * Arkadaşlık isteği alındığında tetiklenir.
 * @param {Socket} socket - Bağlanan socket
 */
function onFriendRequest(socket) {
    socket.on('friend_request', async (data) => {
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
        const username = data.username;

        let currentUserId = null;
        if(token){
            try {
                const decoded = jwt.decode(token); // Sadece çözümleme
                currentUserId = decoded.userId;
            } catch (error) {
                console.error('Token çözülemedi', error.message);
            }
        }

        let otherUserId = null
        try {
            otherUserId = await Friend.getFriendIdFromUsername(username);
        } catch (error) {
            console.error('getFriendIdFromUsername Hatası:', error.message);
        }
        
        let existingRequest = null;
        try {
            existingRequest = await Friend.checkFriendRequest(currentUserId, otherUserId);
        } catch (error) {
            console.error('checkFriendRequest Hatası:', error.message);
        }

        const socketId = getSocketId(otherUserId);
        const date = new Date().toLocaleString('tr-TR', { 
            timeZone: 'Europe/Istanbul', 
        });
        let currentUsername = null;

        if(existingRequest.length > 0){
            if(existingRequest[0].status_ === 'Reddedildi'){
                try {
                    await Friend.updateFriendRequest(currentUserId, otherUserId);
                    currentUsername = await Friend.getCurrentUsername(currentUserId);
                    socket.to(socketId).emit('new_friend_request', { reqUsername: currentUsername, date: date });
                } catch (error) {
                    console.error('Veri tabanı Hatası:', error.message);
                }
            }
        }else{
            try {
                await Friend.insertFriendRequest(currentUserId, otherUserId);
                currentUsername = await Friend.getCurrentUsername(currentUserId);
                socket.to(socketId).emit('new_friend_request', { reqUsername: currentUsername, date: date });
            } catch (error) {
                console.error('Veri tabanı Hatası:', error.message);
            }
        }
        
    });
    
    socket.on('friend_request_rejected', async (data) => {
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
        const username = data.reqUsername;

        let currentUserId = null;
        if(token){
            try {
                const decoded = jwt.decode(token); // Sadece çözümleme
                currentUserId = decoded.userId;
            } catch (error) {
                console.error('Token çözülemedi', error.message);
            }
        }

        let otherUserId = null
        try {
            otherUserId = await Friend.getFriendIdFromUsername(username);
        } catch (error) {
            console.error('getFriendIdFromUsername Hatası:', error.message);
        }

        try {
            await Friend.updateFriendRequestRejected(currentUserId, otherUserId);
        } catch (error) {
            console.error('updateFriendRequestRejected Hatası:', error.message);
        }
    });

    socket.on('friend_request_accepted', async (data) => {
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
        const username = data.reqUsername;

        let currentUserId = null;
        if(token){
            try {
                const decoded = jwt.decode(token); // Sadece çözümleme
                currentUserId = decoded.userId;
            } catch (error) {
                console.error('Token çözülemedi', error.message);
            }
        }

        let otherUserId = null
        try {
            otherUserId = await Friend.getFriendIdFromUsername(username);
        } catch (error) {
            console.error('getFriendIdFromUsername Hatası:', error.message);
        }

        const chatId = uuidv4();
        const memberId = uuidv4();
        const memberIdOther = uuidv4();
        try {
            await Friend.updateFriendRequestAccepted(currentUserId, otherUserId);
            await Friend.createIndividualChat(chatId);
            await Friend.insertChatMembers(memberId, chatId, currentUserId);
            await Friend.insertChatMembers(memberIdOther, chatId, otherUserId);
        } catch (error) {
            console.error('Arkadaşlık verileri işlenemedi:', error.message);
        }
    });
}

/**
 * Arkadaşlık isteği alındığında tetiklenir.
 * @param {Socket} socket - Bağlanan socket
 */
function friendSocketHandlers(socket) {
    onFriendRequest(socket);
}

module.exports = { friendSocketHandlers };
