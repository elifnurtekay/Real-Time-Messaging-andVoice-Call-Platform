const { messageSocketHandlers } = require('./messageSocket');
const { chatSocketHandlers } = require('./chatSocket');
//const { callSocketHandlers } = require('./callSocket'); // Eğer çağrı event'leri gerekiyorsa
const config = require('../config/index');

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

        // Chat event'lerini bağla
        chatSocketHandlers(socket);

        // Eğer çağrı işlemleri kullanılıyorsa bu event'leri bağla
        //callSocketHandlers(socket);


        // WebSocket ayarlarını logla (isteğe bağlı)
        console.log('WebSocket Ayarları:', {
            host: config.websocket.HOST,
            port: config.websocket.PORT,
            protocol: config.websocket.PROTOCOL,
        });

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
    const userId = socket.handshake.query.userId; // Kullanıcı ID'sini doğrulamak için
    if (userId) {
        console.log(`Kullanıcı bağlandı: ${userId} (Socket ID: ${socket.id})`);
        
        // Kullanıcıyı kendi odasına dahil et
        socket.join(userId);
        console.log(`Kullanıcı ${userId}, oda ${userId}'e bağlandı.`);
    } else {
        console.log(`Kimlik doğrulanmadan bağlanma isteği: ${socket.id}`);
    }
}

/**
 * Kullanıcı bağlantıyı kopardığında gerekli işlemleri yapar.
 * @param {Socket} socket - Bağlantısı kopan socket
 */
function onDisconnect(socket) {
    console.log(`Bağlantı kesildi: Socket ID ${socket.id}`);
    // Kullanıcı bağlantısı koptuğunda yapılacak işlemleri buraya ekleyin
    //akşam ekle (20.12)
    // Örneğin, kullanıcı durumunu çevrimdışı olarak güncelleme
}

module.exports = { initializeSocket };
