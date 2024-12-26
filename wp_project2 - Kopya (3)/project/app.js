var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const protectedRoute = require('./middleware/protectedRoute');

var cors = require('cors'); 
require('dotenv').config(); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth'); 
var messageRouter = require('./routes/message'); 
var chatRoutes = require('./routes/chat');
var chatMemberRoutes = require('./routes/chatMember');
var friendRoutes = require('./routes/friend');

var app = express();

// Eklenen: HTTP ve Socket.IO modülleri
global.http = require('http');
const { initializeSocket } = require('./sockets/index');
console.log("socket", initializeSocket);

// HTTP sunucusu oluştur
const server = http.createServer(app);

// Socket.IO entegrasyonu
initializeSocket(server);

/*
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');*/

// Middleware'ler
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// URL Encoded Middleware (Form verileri için)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL'si
  credentials: true,
} ));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/chats', chatRoutes);
app.use('/chatMembers', chatMemberRoutes);
app.use('/friends', friendRoutes)


// Ana sayfa rotası (HTML dosyasını sun)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
//homepage
app.get('/anasayfa', protectedRoute, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

/*
// Sunucuyu başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});*/

module.exports = { app, server };

