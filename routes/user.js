//Loding Modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/new", (req, res) => {
  var errors = [];

  if (req.body.name.length < 2) {
    errors.push({ text: "Name is too small" });
  }

  if (req.body.email.length < 2) {
    errors.push({ text: "Email is too small" });
  }

  if (req.body.password.length < 5) {
    errors.push({ text: "Password is too small. Min 5 characters" });
  }

  if (req.body.password != req.body.confirm_password) {
    errors.push({ text: "Password and confirm password are differents" });
  }

  if (errors.length > 0) {
    res.render("user/register", { errors: errors });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash("error_msg", "Already have an account with that email!");
          res.redirect("/user/register");
        } else {
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          };

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                req.flash("error_msg", "Error to save user **!");
                res.redirect("/");
              }
              newUser.password = hash;

              new User(newUser)
                .save()
                .then(() => {
                  req.flash("success_msg", "User saved !");
                  res.redirect("/");
                })
                .catch((err) => {
                  req.flash("error_msg", "Error to saved user, contact John !");
                  res.redirect("/user/register");
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Internal error");
        res.redirect("/");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Bye Bye, see you soon !");
  res.redirect("/");
});

module.exports = router;
