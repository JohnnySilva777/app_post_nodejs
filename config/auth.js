const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Model User
require("../models/User");
const User = mongoose.model("users");

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, senha, done) => {
        User.findOne({ email: email }).then((user) => {
          if (!user) {
            return done(null, false, { message: "Account not found." });
          }

          bcrypt.compare(senha, user.password, (err, confirm) => {
            if (confirm) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Crendential not correct !",
              });
            }
          });
        });
      }
    )
  );

  //save user session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
