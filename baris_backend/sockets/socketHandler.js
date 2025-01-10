const { messageSocketHandlers } = require('./messageSocket');
const { friendSocketHandlers } = require('./friendSocket');
const { chatSocketHandlers } = require('./chatSocket');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { addOnlineUser, removeOnlineUser, getUserId } = require('./onlineUsers');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { getFriendIdFromUsername } = require('../models/friendModel');

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

        chatSocketHandlers(socket);

        // WebRTC sinyalleşme işlemleri
        webRTCSignalHandlers(socket);

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
 * WebRTC sinyalleşme olaylarını yönetir.
 * @param {Socket} socket - Bağlanan socket
 */
function webRTCSignalHandlers(socket) {
    // Offer gönderme
    socket.on("offer", async(data) => {
        const receiverId = await getFriendIdFromUsername(data.target)
        socket.to(receiverId).emit("offer", {
        sdp: data.sdp,
        sender: socket.id,
        sender_username: data.target
        });
    });
   
    // Answer gönderme
    socket.on("answer", (data) => {
        socket.to(data.target).emit("answer", {
            sdp: data.sdp,
            sender: socket.id,
        });
   
        socket.emit("answer", {
            sdp: data.sdp,
            sender: socket.id,
        });
       
    });
   
    socket.on("endCall", async(data) => {
       // Diğer kullanıcıya görüşmenin sona erdiğini bildir
       console.log('çalışıyorum2');
       const receiverId = await getFriendIdFromUsername(data.target)
       socket.to(receiverId).emit("endCall");
    });
   
}

/**
 * Yeni bir bağlantı kurulduğunda kullanıcıyı doğrular ve ilgili socket event'lerini bağlar.
 * @param {Socket} socket - Bağlanan socket
 */
async function onConnection(socket) {
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
        await User.addLastLogin(userId);
        const groupNames = await Chat.fetchGroupNames(userId);
        // Kullanıcıyı kendi odasına dahil et
        socket.join(userId);
        groupNames.forEach(groupName =>{
            const roomName = createRoomSlug(groupName.chat_name);
            socket.join(`${roomName}`);
        });
        console.log(`Kullanıcı ${userId}, oda ${userId}'e bağlandı.`);
        console.log([...socket.adapter.rooms.keys()]);
        console.log([...socket.adapter.rooms.get(`${socket.id}`)]);
        console.log([...socket.adapter.rooms.entries()]
        .filter(([key, value]) => !value.has(key)) // Soket ID'leri hariç tut
        .map(([key]) => key));

    } else {
        console.log(`Kimlik doğrulanmadan bağlanma isteği: ${socket.id}`);
        socket.disconnect();
    }
}

/**
 * Kullanıcı bağlantıyı kopardığında gerekli işlemleri yapar.
 * @param {Socket} socket - Bağlantısı kopan socket
 */
async function onDisconnect(socket) {
    const userId = getUserId(socket.id);
    await User.setOnlineStatus(userId);
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
    socket.on('logout', async (user_id) => {
        const cookies = socket.handshake.headers.cookie;
        const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('auth_token=')).split('=')[1] : null;
        let userId = null;
        if (token) {
            try {
                // JWT doğrulama ve çözümleme
                const decoded = jwt.decode(token);
                userId = decoded.userId; // Token'den userId'yi al
            } catch (err) {
                console.error('Geçersiz token:', err.message);
            }
        }
        console.log(userId);
        await fetch('http://localhost:3000/api/users/logout', {
            method: 'POST',
            credentials: 'include', // Eğer JWT çerezde saklanıyorsa bunu ekleyin
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({ userId }) 
        })
        .then(response => {
            if (response.ok) {
                console.log('User logged out:', user_id);
                socket.emit('logged_out', { message: 'Çıkış başarılı.' });
            } else {
                console.error('Çıkış yapılamadı');
            }
        })
        .catch(error => console.error('Error:', error)); 
        
    });
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

module.exports = { 
    initializeSocket,
};
