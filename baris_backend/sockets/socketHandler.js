const { messageSocketHandlers } = require('./messageSocket');
const { friendSocketHandlers } = require('./friendSocket');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { addOnlineUser, removeOnlineUser } = require('./onlineUsers');

/**
 * WebSocket sunucusunu başlatır ve gerekli event handler'ları yükler.
 * @param {Server} io - Socket.IO sunucusu
 */
function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('Yeni bir bağlantı kuruldu:', socket.id);

        // Yeni bir bağlantı olduğunda yapılacak işlemler
        onConnection(socket);

        // Mesajlaşma event'lerini bağla
        messageSocketHandlers(socket);

        // friend event'lerini bağla
        friendSocketHandlers(socket);

        onLogout(socket);

        // Bağlantı kopma durumu
        socket.on('disconnect', () => {
            onDisconnect(socket);
        });
    });
}

/**
 * Yeni bir bağlantı kurulduğunda kullanıcıyı doğrular ve ilgili socket event'lerini bağlar.
 * @param {Socket} socket - Bağlanan socket
 */
function onConnection(socket) {
    const cookies = socket.handshake.headers.cookie;
    const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
    let userId = null;
    if (token) {
        try {
            // JWT doğrulama ve çözümleme
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId; // Token'den userId'yi al
        } catch (err) {
            console.error('Geçersiz token:', err.message);
        }
    }
    if (userId) {
        console.log(`Kullanıcı bağlandı: ${userId} (Socket ID: ${socket.id})`);
        addOnlineUser(userId, socket.id);
        // Kullanıcıyı kendi odasına dahil et
        socket.join(userId);
        console.log(`Kullanıcı ${userId}, oda ${userId}'e bağlandı.`);

    } else {
        console.log(`Kimlik doğrulanmadan bağlanma isteği: ${socket.id}`);
        socket.disconnect();
    }
}

/**
 * Kullanıcı bağlantıyı kopardığında gerekli işlemleri yapar.
 * @param {Socket} socket - Bağlantısı kopan socket
 */
function onDisconnect(socket) {
    removeOnlineUser(socket.id);
    console.log(`Bağlantı kesildi: Socket ID ${socket.id}`);
    // Kullanıcı bağlantısı koptuğunda yapılacak işlemleri buraya ekleyin
    // Örneğin, kullanıcı durumunu çevrimdışı olarak güncelleme
}

/**
 * Kullanıcı çıkış yaptığında gerekli işlemleri yapar.
 * @param {Socket} socket - Çıkış yapan socket
 */
function onLogout(socket) {
    socket.on('logout', async (userId) => {
        await fetch('http://localhost:3000/api/users/logout', {
            method: 'POST',
            credentials: 'include' // Eğer JWT çerezde saklanıyorsa bunu ekleyin
        })
        .then(response => {
            if (response.ok) {
                console.log('User logged out:', userId);
                socket.emit('logged_out', { message: 'Çıkış başarılı.' });
            } else {
                console.error('Çıkış yapılamadı');
            }
        })
        .catch(error => console.error('Error:', error)); 
        
    });
}

module.exports = { 
    initializeSocket,
};
