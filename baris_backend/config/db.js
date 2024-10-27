const mysql = require('mysql2/promise');

// MySQL bağlantı bilgileri
const pool = mysql.createPool({
    host: 'localhost',        // MySQL sunucusu adresi
    user: 'root',             // MySQL kullanıcı adı
    password: '123456',     // MySQL kullanıcı şifresi
    database: 'messaging_app_db',// Veritabanı adı
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getConnection() {
    try {
        const connection = await pool.getConnection(); // Bağlantıyı aç
        console.log('Bağlantı başarılı');
        return connection; // Bağlantıyı döndür
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error); // Hata mesajı
        throw error; // Hata varsa fırlat
    }
}

module.exports = getConnection;




