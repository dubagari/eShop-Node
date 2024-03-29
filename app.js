/** @format */

const express = require("express");

const bodyParser = require("body-parser");

const path = require("path");

const rooRouter = require("./util/path");
const mongoConnect = require("./util/database").mongoConnect;

const shopRoute = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const error404 = require("./controller/error");
const User = require("./model/users");

const app = express();

app.use(express.static(path.join(rooRouter, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findUserById("65a20d27147c75ed79ef3f2a")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(error404.error404);

mongoConnect(() => {
  app.listen(3000);
});
