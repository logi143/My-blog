const express = require("express");
const path = require("path");
const app = express();

const mongoose = require("mongoose");

const Blog = require("./models/model");

//connecting to db
const dbURI =
  "mongodb+srv://admin:test4321@blog-db.ni6cwzy.mongodb.net/blogdatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

//setting ejs as view engine
app.set("view engine", "ejs");

//serving static files and middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//routes

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find().then((result) => {
    res.render("index", { title: "All Blogs", blogs: result });
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((result) => {
      res.render("details", { title: "Blog Details", blog: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.get("/create", (req, res) => {
  res.render("create", { title: "create new blog" });
});

app.use((req, res) => {
  res.render("404", { title: "Error" });
});
