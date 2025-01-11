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
    profile_photo_url VARCHAR(512)
);

CREATE TABLE chats(
	chat_id VARCHAR(36) PRIMARY KEY,
    chat_name VARCHAR(100),
    is_group BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chat_photo_url VARCHAR(512)
);

CREATE TABLE messages(
	message_id VARCHAR(36) PRIMARY KEY,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36), -- INDIVIDUAL CHATS
    chat_id VARCHAR(36) NOT NULL, -- GROUP CHATS
    message_content TEXT NOT NULL,
    timestamp_ TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read ENUM("Gönderildi","İletildi","Görüldü") DEFAULT "Gönderildi",
    status_ ENUM("Orijinal","Düzenlendi", "Silindi") DEFAULT "Orijinal",
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id), 
    FOREIGN KEY (receiver_id) REFERENCES users(user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
);

CREATE TABLE chat_members(
	member_id VARCHAR(36) PRIMARY KEY,
    chat_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    left_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE medias(
	media_id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    media_type ENUM("Fotoğraf","Video","Ses","Bağlantı", "Kişi", "Konum","Belge", "Anket"),
    media_url VARCHAR(512) NOT NULL,
    sended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(message_id)
);

CREATE TABLE blocked_users(
	blocker_id VARCHAR(36),
    blocked_id VARCHAR(36),
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(user_id),
    FOREIGN KEY (blocked_id) REFERENCES users(user_id)
);

CREATE TABLE friends (
    user1_id VARCHAR(36),
    user2_id VARCHAR(36),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_ ENUM('Beklemede', 'Kabul Edildi', 'Reddedildi') DEFAULT 'Beklemede',
    PRIMARY KEY (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE call_logs (
    call_id VARCHAR(36) PRIMARY KEY,
    caller_id VARCHAR(36) NOT NULL,
    callee_id VARCHAR(36),
    chat_id VARCHAR(36) NOT NULL,
    call_type ENUM("Sesli","Görüntülü") NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP NOT NULL,
    duration TIME,
    was_successful BOOLEAN DEFAULT TRUE,
    is_missed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (caller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (callee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE
);
