require('dotenv').config(); // Ortam değişkenlerini yükle

module.exports = {
  general: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    CONNECTION_STRING: process.env.CONNECTION_STRING || 'mysql://localhost:27017/wp_project',
  },
  database: {
    HOST: process.env.DB_HOST || 'localhost',  
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'Elif2119!',
    NAME: process.env.DB_NAME || 'wp_project',
  },
  websocket: {
    HOST: process.env.WEBSOCKET_HOST || '0.0.0.0',
    PORT: process.env.WEBSOCKET_PORT || 3001,
    PROTOCOL: process.env.WEBSOCKET_PROTOCOL || 'http',
    MAX_PAYLOAD: process.env.WEBSOCKET_MAX_PAYLOAD || 1048576,
  },
  cors: {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    METHODS: process.env.CORS_METHODS || 'GET,POST',
  },
  redis: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || '',
  },
};