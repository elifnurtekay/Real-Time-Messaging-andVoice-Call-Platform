const Friend = require('../db/models/Friend');

function onFriendRequest(socket) {
    socket.on('friend_request', async (data) => {
        const { user1Id, user2Id } = data;

        try {
            await Friend.sendFriendRequest(user1Id, user2Id);
            socket.to(user2Id).emit('new_friend_request', { user1Id });
        } catch (error) {
            console.error('onFriendRequest Hatası:', error.message);
        }
    });
}

function friendSocketHandlers(socket) {
    onFriendRequest(socket);
}

module.exports = { friendSocketHandlers };
