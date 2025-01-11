// onlineUsers.js
const onlineUsers = new Map();

function addOnlineUser(userId, socketId) {
  onlineUsers.set(userId, socketId);
}

function removeOnlineUser(socketId) {
    for (const [userId, id] of onlineUsers.entries()) {
        if (id === socketId) {
            onlineUsers.delete(userId);
            console.log(`Kullanıcı ${userId} için socket ID silindi.`);
            return userId; // Silinen kullanıcı ID'sini döndürüyoruz (isteğe bağlı)
        }
      }
}

function getSocketId(userId) {
  return onlineUsers.get(userId);
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getSocketId,
  onlineUsers, // Eğer doğrudan erişmek isterseniz
};
