//Loding Modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");
require("../models/Post");
const Post = mongoose.model("posts");
const {admin} = require("../helper/admin")

router.get("/", admin, (req, res) => {
  res.render("admin/index");
});

//List Category
router.get("/categories", admin, (req, res) => {
  Category.find()
    .sort({ date: "desc" })
    .lean()
    .then((categories) => {
      res.render("admin/categories/categories", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to list Categories");
      res.redirect("/admin");
    });
});

//Show form add
router.get("/category/add", admin, (req, res) => {
  res.render("admin/categories/categoriesadd");
});

//Validate and Save
router.post("/category/new", admin, (req, res) => {
  var errors = [];

  if (req.body.name.length < 2) {
    errors.push({ text: "Name is too small" });
  }

  if (errors.length > 0) {
    res.render("/admin/categories/categoriesadd", { errors: errors });
  } else {
    const newCategory = {
      name: req.body.name,
      slug: req.body.slug,
    };

    new Category(newCategory)
      .save()
      .then(() => {
        req.flash("success_msg", "Category saved !");
        res.redirect("/admin/categories");
      })
      .catch((err) => {
        req.flash("error_msg", "Error to saved, contact John !");
        res.redirect("/admin/");
      });
  }
});

//Show form Edit
router.get("/category/edit/:id", admin, (req, res) => {
  Category.findOne({ _id: req.params.id })
    .lean()
    .then((category) => {
      res.render("admin/categories/categoriesedit", { category: category });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Category");
      res.redirect("/admin");
    });
});

//Update Category
router.post("/category/update", admin, (req, res) => {
  var errors = [];

  if (req.body.name.length < 2) {
    errors.push({ text: "Name is too small" });
  }

  if (errors.length > 0) {
    res.render("admin/categories/categoriesedit", { errors: errors });
  } else {
    Category.findOne({ _id: req.body.id })
      .then((category) => {
        category.name = req.body.name;
        category.slug = req.body.slug;
        category
          .save()
          .then(() => {
            req.flash("success_msg", "Category updated !");
            res.redirect("/admin/categories/categories");
          })
          .catch((err) => {
            req.flash("error_msg", "Error to updated, contact John !");
            res.redirect("/admin");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "Error to get Category");
        res.redirect("/admin");
      });
  }
});

//Delete Category
router.post("/category/destroy", admin, (req, res) => {
  Category.remove({ _id: req.body.id })
    .then((category) => {
      req.flash("success_msg", "Category deleted !");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      req.flash("error_msg", "Error to delete Category");
      res.redirect("/admin");
    });
});

//*************** Posts ****************
//List Posts
router.get("/posts", admin, (req, res) => {
  Post.find()
    .populate("category")
    .sort({ date: "desc" })
    .lean()
    .then((posts) => {
      res.render("admin/posts/posts", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Posts");
      res.redirect("/admin");
    });
});

//Show form add new post
router.get("/post/add", admin, (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      res.render("admin/posts/postsadd", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Categories select");
      res.redirect("/admin");
    });
});

//Validate and Save
router.post("/post/new", admin, (req, res) => {
  var errors = [];

  if (req.body.title.length < 2) {
    errors.push({ text: "Name is too small" });
  }

  if (req.body.content.length < 2) {
    errors.push({ text: "Content is too small" });
  }

  if (req.body.slug.length < 2) {
    errors.push({ text: "Slug is too small" });
  }

  if (req.body.description.length < 2) {
    errors.push({ text: "Description is too small" });
  }

  if (req.body.category.length < 2) {
    errors.push({ text: "Category is invalid, register new category" });
  }

  if (errors.length > 0) {
    res.render("/admin/postsadd", { errors: errors });
  } else {
    const newPost = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      description: req.body.description,
      category: req.body.category,
    };

    new Post(newPost)
      .save()
      .then(() => {
        req.flash("success_msg", "Post saved !");
        res.redirect("/admin/posts");
      })
      .catch((err) => {
        req.flash("error_msg", "Error to saved, contact John !");
        res.redirect("/admin/");
      });
  }
});

//Show form Edit
router.get("/post/edit/:id", admin, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .populate("category")
    .then((post) => {
      Category.find()
        .where("_id")
        .ne(post.category._id)
        .lean()
        .then((categories) => {
          res.render("admin/posts/postsedit", {
            post: post,
            categories: categories,
          });
        })
        .catch((err) => {
          req.flash("error_msg", "Error to get Category");
          res.redirect("/admin");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Error to get Post");
      res.redirect("/admin");
    });
});

//Update Post
router.post("/post/update", admin, (req, res) => {
  var errors = [];

  if (req.body.title.length < 2) {
    errors.push({ text: "Name is too small" });
  }

  if (req.body.content.length < 2) {
    errors.push({ text: "Content is too small" });
  }

  if (req.body.slug.length < 2) {
    errors.push({ text: "Slug is too small" });
  }

  if (req.body.description.length < 2) {
    errors.push({ text: "Description is too small" });
  }

  if (req.body.category.length < 2) {
    errors.push({ text: "Category is invalid, register new category" });
  }

  if (errors.length > 0) {
    res.render("admin/postsedit", { errors: errors });
  } else {
    Post.findOne({ _id: req.body.id })
      .then((post) => {
        (post.title = req.body.title),
          (post.slug = req.body.slug),
          (post.content = req.body.content),
          (post.description = req.body.description),
          (post.category = req.body.category),
          post
            .save()
            .then(() => {
              req.flash("success_msg", "Post updated !");
              res.redirect("/admin/posts");
            })
            .catch((err) => {
              req.flash("error_msg", "Error to updated, contact John !");
              res.redirect("/admin");
            });
      })
      .catch((err) => {
        req.flash("error_msg", "Error to get Post");
        res.redirect("/admin");
      });
  }
});

router.post("/post/destroy", admin, (req, res) => {
  Post.remove({ _id: req.body.id })
    .then((post) => {
      req.flash("success_msg", "Post deleted !");
      res.redirect("/admin/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Error to delete Post");
      res.redirect("/admin");
    });
});

module.exports = router;
