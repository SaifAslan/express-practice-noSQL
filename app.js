const http = require("http");

require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const { get404 } = require("./controllers/error");
const { findUserById } = require("./models/user");
const mongodb = require("mongodb");
const User = require("./models/user");
const mongoConnect = require("./utils/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  findUserById(mongodb.ObjectId("635fd588dae83d79a764d7a9"))
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

const server = http.createServer(app);

//module.exports = path.dirname(require.main.filename);
mongoConnect(() => {
  server.listen(3000);
});
