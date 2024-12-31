/*require('dotenv').config(); // .env dosyasını yükle
console.log('DB_NAME from .env:', process.env.DB_NAME); // .env içindeki DB_NAME
console.log('Database Config:', require('../config/index').database); // Config'ten gelen değerler*/

const mysql = require('mysql2/promise');
const config = require('../config/index'); // Config dosyasından ayarları alıyoruz

async function initializeDatabase() {
  try {
    // Ana bağlantıyı oluştur (veritabanı olmadan)
    const connection = await mysql.createConnection({
      host: config.database.HOST,
      user: config.database.USER,
      password: config.database.PASSWORD
    });

    // Veritabanının mevcut olup olmadığını kontrol et
    
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [config.database.NAME]);
    if (databases.length === 0) {
      // Veritabanı yoksa oluştur
      if (!config.database.NAME || config.database.NAME === 'undefined') {
        throw new Error('Database name is not defined in configuration.');
    }
    
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database.NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

      console.log(`Database '${config.database.NAME}' created.`);
    } else {
      console.log(`Database '${config.database.NAME}' already exists.`);     //Database 'undefined' already exists hatayı veren kod
    }

    // Bağlantıyı kapat
    await connection.end();
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    process.exit(1); // Uygulamayı durdur
  }
}

// Bağlantı havuzunu oluştur
const db = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USER,
  password: config.database.PASSWORD,
  database: config.database.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  /*host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.database.NAME,*/
  
});


// Başlatma fonksiyonunu çağır ve bağlantıyı test et
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully.');
    db.getConnection()
      .then(() => {
        console.log('Connected to MySQL database using connection pool.');
      })
      .catch((err) => {
        console.error('Failed to connect to MySQL database:', err.message);
      });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
  });

module.exports = db;
