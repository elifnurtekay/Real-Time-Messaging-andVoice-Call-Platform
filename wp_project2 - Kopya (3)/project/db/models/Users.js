const db = require('../connection'); // Veritabanı bağlantısı
const bcrypt = require('bcrypt'); // Şifreleme için bcrypt
const { v4: uuidv4 } = require('uuid'); // UUID oluşturmak için

class User {
  /**
   * Yeni bir kullanıcı oluşturur.
   * @param {Object} param - Kullanıcı bilgileri
   * @param {string} param.username - Kullanıcı adı
   * @param {string} param.email - Kullanıcı e-posta adresi
   * @param {string} param.password - Şifrelenmiş kullanıcı şifresi
   */
  static async create({ name, surname, username, email, password }) {
    try {
        const user_id = uuidv4(); // UUID oluştur
        const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hashle
        const query = 'INSERT INTO users (user_id, name, surname, username, email, password) VALUES (?, ?, ?, ?, ?, ?)';
        const [results] = await db.query(query, [user_id, name, surname, username, email, hashedPassword]);
        return { user_id, affectedRows: results.affectedRows };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Kullanıcı oluşturulamadı.');
    }
}


  /**
   * Kullanıcıyı e-posta ile arar.
   * @param {string} email - Kullanıcı e-posta adresi
   * @returns {Object|null} - Kullanıcı bilgileri veya null
   */
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      console.log("arama gerçekleşti")
      const [results] = await db.query(query, [email]);
      //console.log(results)
      return results[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Kullanıcı aranırken bir hata oluştu.');
    }
  }

  static async findByUsername(username) {
    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        console.log("arama gerçekleşti")
        const [results] = await db.query(query, [username]);
        return results[0] || null;
    } catch (error) {
        console.error('Kullanıcı adıyla kullanıcı aranırken hata:', error.message);
        throw new Error('Kullanıcı adı ile kullanıcı aranırken bir hata oluştu.');
    }
  }

  /**
   * Kullanıcı kimlik bilgilerini doğrular.
   * @param {string} username - Kullanıcının kullanıcı adı
   * @param {string}password - Kullanıcının şifresi
   * @returns {Object|null} - Kullanıcı bilgileri veya doğrulama başarısızsa null
   */
  static async authenticate(username,password) {
    try {
      const user = await this.findByUsername(username);
      if (!user) return null;

      const ispasswordMatch = await bcrypt.compare(password, user.password);
      console.log(ispasswordMatch)
      return ispasswordMatch ? user : null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw new Error('Kimlik doğrulama işlemi sırasında bir hata oluştu.');
    }
  }

  /**
   * ID ile kullanıcı arar.
   * @param {string} id - Kullanıcının ID'si
   * @returns {Object|null} - Kullanıcı bilgileri veya null
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE user_id = ?';
      const [results] = await db.query(query, [id]);
      return results[0] || null;
    } catch (error) {
      console.error('ID ile kullanıcı aranırken hata:', error);
      throw error;
    }
  }

  /**
     * Kullanıcıları arar.
     * @param {string} searchTerm - Aranacak terim (isim veya kullanıcı adı).
     * @returns {Promise<object[]>} Arama sonucunda bulunan kullanıcılar.
     */
  static async searchUsers(searchTerm) {
    try {
        const query = `
            SELECT 
                user_id, username, profile_photo_url 
            FROM 
                users 
            WHERE 
                username LIKE ? OR full_name LIKE ?
        `;
        const [rows] = await db.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
        return rows;
    } catch (error) {
        console.error('searchUsers Hatası:', error.message);
        throw error;
    }
  }

}

module.exports = User;
