const onlineUsers = new Map();

function addOnlineUser(userId, socketId) {
  onlineUsers.set(userId, socketId);
}

function removeOnlineUser(socketId) {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      console.log(`Kullanıcı ${userId} çevrim dışı oldu.`);
      return userId; // Silinen kullanıcı ID'sini döndürüyoruz (isteğe bağlı)
    }
  }
}

function getSocketId(userId) {
  return onlineUsers.get(userId);
}

function getUserId(socketId) {
  for (const [key, value] of onlineUsers.entries()) {
    if (value === socketId) {
      return key;
    }
  }
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getSocketId,
  getUserId
};
