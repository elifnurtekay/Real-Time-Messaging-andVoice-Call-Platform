const ChatMember = require('../models/ChatMember');

/**
 * ChatMember ile ilgili socket işlemleri
 * @param {Socket} socket - Bağlı socket instance'ı
 */
function chatMemberSocketHandlers(socket) {
    // Üye ekleme
    socket.on('add_member', async (data, callback) => {
        const { chatId, userId, isAdmin } = data;

        try {
            const memberId = await ChatMember.addMember(chatId, userId, isAdmin);
            console.log(`Yeni üye eklendi: ${userId} (Chat ID: ${chatId})`);
            
            // İlgili sohbete diğer üyeleri bilgilendirme
            socket.to(chatId).emit('member_added', { memberId, chatId, userId, isAdmin });

            // Callback ile işlem sonucunu döndür
            if (callback) callback({ success: true, memberId });
        } catch (error) {
            console.error('Üye ekleme hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });

    // Üye çıkarma
    socket.on('remove_member', async (data, callback) => {
        const { chatId, userId } = data;

        try {
            const success = await ChatMember.removeMember(chatId, userId);
            if (success) {
                console.log(`Üye çıkarıldı: ${userId} (Chat ID: ${chatId})`);
                
                // İlgili sohbete diğer üyeleri bilgilendirme
                socket.to(chatId).emit('member_removed', { chatId, userId });

                if (callback) callback({ success: true });
            } else {
                if (callback) callback({ success: false, message: 'Üye bulunamadı veya zaten çıkarılmış.' });
            }
        } catch (error) {
            console.error('Üye çıkarma hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });

    // Sohbete ait üyeleri listeleme
    socket.on('get_chat_members', async (data, callback) => {
        const { chatId } = data;

        try {
            const members = await ChatMember.getMembersByChatId(chatId);
            console.log(`Chat üyeleri alındı (Chat ID: ${chatId})`);
            
            if (callback) callback({ success: true, members });
        } catch (error) {
            console.error('Üyeleri getirme hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });

    // Kullanıcının katıldığı sohbetleri listeleme
    socket.on('get_user_chats', async (data, callback) => {
        const { userId } = data;

        try {
            const chats = await ChatMember.getUserChats(userId);
            console.log(`Kullanıcının sohbetleri alındı (User ID: ${userId})`);
            
            if (callback) callback({ success: true, chats });
        } catch (error) {
            console.error('Sohbetleri getirme hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });
}

module.exports = { chatMemberSocketHandlers };
