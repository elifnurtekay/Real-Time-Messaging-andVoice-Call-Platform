const Chat = require('../db/models/Chat');

/**
 * Chat ile ilgili socket işlemleri
 * @param {Socket} socket - Bağlı socket instance'ı
 */
function chatSocketHandlers(socket) {
    // Yeni bir sohbet oluştur
    socket.on('create_chat', async (data, callback) => {
        const { chat_name, is_group, chat_photo_url } = data;

        try {
            const chat = await Chat.createChat({ chat_name, is_group, chat_photo_url });
            console.log(`Yeni sohbet oluşturuldu: ${chat.chat_id}`);

            // Sohbet oluşturma işlemi başarıyla tamamlandıysa istemciye yanıt gönder
            if (callback) callback({ success: true, chat });
        } catch (error) {
            console.error('Sohbet oluşturma hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });

    // Sohbet bilgilerini güncelle
    socket.on('update_chat', async (data, callback) => {
        const { chatId, chat_name, chat_photo_url } = data;

        try {
            const success = await Chat.updateChat(chatId, { chat_name, chat_photo_url });
            if (success) {
                console.log(`Sohbet güncellendi: ${chatId}`);
                socket.to(chatId).emit('chat_updated', { chatId, chat_name, chat_photo_url });
                if (callback) callback({ success: true });
            } else {
                if (callback) callback({ success: false, message: 'Güncelleme başarısız.' });
            }
        } catch (error) {
            console.error('Sohbet güncelleme hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });

    // Kullanıcının sohbet listesini getir
    socket.on('get_user_chats', async (data, callback) => {
        const { userId } = data;

        try {
            const chats = await Chat.getChatsByUserId(userId);
            console.log(`Kullanıcının sohbetleri alındı (User ID: ${userId})`);

            if (callback) callback({ success: true, chats });
        } catch (error) {
            console.error('Kullanıcı sohbetlerini alma hatası (socket):', error.message);
            if (callback) callback({ success: false, message: error.message });
        }
    });
}

module.exports = { chatSocketHandlers };
