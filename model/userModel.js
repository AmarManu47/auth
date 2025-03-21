const db = require("./db");
const bcrypt = require("bcryptjs");

class User {
  static register(userData, callback) {
    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      };
      db.query("INSERT INTO users SET ?", newUser, callback);
    });
  }

  static findByEmail(email, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  }
}

module.exports = User;
