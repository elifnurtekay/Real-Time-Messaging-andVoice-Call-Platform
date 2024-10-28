const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// MySQL bağlantı bilgileri
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10),
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




