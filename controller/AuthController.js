const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");

exports.showRegister = (req, res) => res.render("register");
exports.showLogin = (req, res) => res.render("login");

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  User.findByEmail(email, (err, users) => {
    if (users.length > 0) {
      return res.send("Email already exists!");
    }

    User.register({ username, email, password }, (err) => {
      if (err) throw err;
      res.redirect("/login");
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, (err, users) => {
    if (users.length === 0) {
      return res.send("User not found!");
    }

    const user = users[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        req.session.user = user;
        res.redirect("/dashboard");
      } else {
        res.send("Invalid credentials!");
      }
    });
  });
};

exports.dashboard = (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
