const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/models/Users');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // UUID içe aktarımı

/**
 * Kullanıcı kaydı
 */
exports.register = async (req, res) => {
  console.log('Fonksiyon çalışıyor...');
  const { name, surname, username, email, password} = req.body;

  try {
    /*if (!password) {
      throw new Error("Şifre eksik.");
    }*/
   
    console.log(req.body); //log
    
    // Kullanıcıyı oluştur
    const newUser = await User.create({ 
      user_id: uuidv4(),
      name,
      surname,
      username,
      email,
      password });
    console.log('Kullanıcı oluşturuldu...');

    res.status(201).json({ success: true, message: 'Kullanıcı başarıyla kaydedildi!' });
  } catch (err) {
    console.error('Kayıt işlemi başarısız:', err);
    res.status(500).json({ success: false, message: 'Kayıt başarısız oldu.', error: err.message });
  }
};

/**
 * Kullanıcı girişi
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Request Body:', req.body);

  try {
    /*if (!password) {
      throw new Error("Şifre eksik.");
    }*/

    // Kullanıcıyı email veya username ile bul
    const user = (await User.findByUsername(username));
    //log
    console.log('username:', username);
    console.log('User from DB:', user);

      //(await User.findByEmail(username)) || (await User.findByUsername(username));
      
    if (!user) {
      console.log('kullanıcı yok...')
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Şifreyi kontrol et
    console.log('şifre kontrolü yapılıyor...')
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('şifre kontrolü yapıldı...')
    console.log(isMatch)
    if (!isMatch) {
      console.log('şifre kontrolü yanlış...')
      return res.status(401).json({ success: false, message: 'Geçersiz şifre.' });
    }

    // JWT oluştur
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Çerezi ayarla
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: 'Giriş başarılı!' });
  } catch (err) {
    console.error('Giriş işlemi başarısız:', err);
    res.status(500).json({ success: false, message: 'Giriş başarısız oldu.', error: err.message });
  }
};

/**
 * Şifre sıfırlama isteği
 */
exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Şifre sıfırlama tokeni oluştur
    const resetToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    
    // Şifre sıfırlama bağlantısı
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // E-posta gönder
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Şifre Sıfırlama Talebi',
      text: `Şifre sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Şifre sıfırlama bağlantısı e-posta ile gönderildi.' });
  } catch (err) {
    console.error('Şifre sıfırlama isteği sırasında hata:', err);
    res.status(500).json({ success: false, message: 'Şifre sıfırlama işlemi başarısız oldu.', error: err.message });
  }
};

/**
 * Şifre sıfırlama
 */
exports.resetpassword = async (req, res) => {
  const { token, newpassword } = req.body;

  try {
    if (!newpassword) {
      throw new Error("Yeni şifre eksik.");
    }
    // Token doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Yeni şifreyi hashle ve kaydet
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    const query = 'UPDATE users SET password = ? WHERE user_id = ?';
    await db.promise().query(query, [hashedPassword, user.user_id]);

    res.status(200).json({ success: true, message: 'Şifre başarıyla sıfırlandı.' });
  } catch (err) {
    console.error('Şifre sıfırlama sırasında hata:', err);
    res.status(500).json({ success: false, message: 'Şifre sıfırlama işlemi başarısız oldu.', error: err.message });
  }
};

/**
 * Kullanıcı çıkışı (Çıkış işlemi ve çerez silme)
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Çıkış başarılı. Çerez silindi.' });
};


/**
 * Kullanıcıları arar.
 * @param {Request} req - HTTP isteği.
 * @param {Response} res - HTTP yanıtı.
 */
exports.searchUsers = async (req, res) => {
  try {
      const { searchTerm } = req.query;

      if (!searchTerm || searchTerm.trim() === '') {
          return res.status(400).json({
              success: false,
              message: 'Arama terimi gereklidir.',
          });
      }

      const users = await User.searchUsers(searchTerm.trim());
      res.status(200).json({ success: true, users });
  } catch (error) {
      console.error('searchUsers Hatası:', error.message);
      res.status(500).json({ success: false, message: error.message });
  }
};

