CREATE TABLE users(
	user_id VARCHAR(36) PRIMARY KEY,
    name_ VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_ VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone_number VARCHAR(15),
	status_ ENUM('çevrim içi','çevrim dışı') DEFAULT 'çevrim dışı',
    account_status ENUM('Aktif','Pasif','Kilitli') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    about VARCHAR(500),
    profile_photo_url VARCHAR(208)
);