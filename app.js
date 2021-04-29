//Loding Modules
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParse = require("body-parser");
const admin = require("./routes/admin");
const user = require("./routes/user");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Post.js");
const Post = mongoose.model("posts");
require("./models/Category");
const Category = mongoose.model("categories");
const passport = require("passport");
require("./config/auth")(passport)
const {adminHelper} = require("./helper/admin")

//Variables
const port = 8081;
const mongoAtlasUri = "URL MONGO";

//Config
  //Session
    app.use(
      session({
        secret: "blogJohnny",
        resave: true,
        saveUninitialized: true,
      })
    );

  //Passaport
      app.use(passport.initialize());
      app.use(passport.session());

  //Flash
    app.use(flash());

  //Middlewares
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg");
      res.locals.error_msg = req.flash("error_msg");
      res.locals.error = req.flash("error");
      res.locals.user = req.user;
      res.locals.admin = adminHelper;
      next();
    });

  //BodyParse
    app.use(bodyParse.urlencoded({ extended: true }));
    app.use(bodyParse.json());

  //Handlebars
    app.engine("handlebars", handlebars({ defaultLayout: "main" }));
    app.set("view engine", "handlebars");

  //Public
    app.use(express.static(path.join(__dirname, "public")));

  //Mogoose
    mongoose
      .connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Connected with mongo");
      })
      .catch((erro) => {
        console.log("Erro " + erro);
      });

//Routes
app.use('/admin', admin);
app.use('/user', user);

app.get("/", (req, res) => {
  Post.find()
    .populate("category")
    .sort({ date: "desc" })
    .lean()
    .then((posts) => {
      res.render("website/index", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Posts");
      res.redirect("/404");
    });
});

app.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate("category")
    .lean()
    .then((post) => {
      if (post) {
        res.render("website/posts/index", { post: post });
      } else {
        req.flash("error_msg", "Post não existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Posts " + err);
      res.redirect("/");
    });
});

app.get("/categories", (req, res) => {
  Category.find()
    .sort({ date: "desc" })
    .lean()
    .then((categories) => {
      res.render("website/categories/index", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to list Categories");
      res.redirect("/");
    });
});

app.get("/post/category/:slug", (req, res) => {
  Category.findOne({ slug: req.params.slug })
    .sort({ date: "desc" })
    .lean()
    .then((category) => {
      if (category) {
        Post.find({ category: category._id })
          .sort({ date: "desc" })
          .lean()
          .then((posts) => {
            res.render("website/categories/categoryposts", {
              category: category,
              posts: posts,
            });
          })
          .catch(() => {
            req.flash("error_msg", "Error to find post of this category");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Error to find this category");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Error to list post of this category");
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("Error");
});

//Others
app.listen(port, () => console.log(`Start Serv!`));
