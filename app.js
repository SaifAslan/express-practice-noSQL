const http = require("http");

require("dotenv").config();

const express = require("express");

// var cookieParser = require("cookie-parser");

// const { doubleCsrf } = require("csrf-csrf");

const flash = require("connect-flash");

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const authRoutes = require("./routes/auth");

const { get404 } = require("./controllers/error");
// const { findUserById } = require("./models/user");
// const mongodb = require("mongodb");
const User = require("./models/user");

const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);

// const mongoConnect = require("./utils/database").mongoConnect;
const mongodb_URI = `mongodb+srv://saif:${process.env.mongodb_password}@cluster0.6zbtdaz.mongodb.net/shop?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: mongodb_URI,
  collection: "sessions",
});
const mongoose = require("mongoose");

// const {
//   generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
//   doubleCsrfProtection, // This is the default CSRF protection middleware.
// } = doubleCsrf({});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(flash());

// app.use(cookieParser());

// const myRoute = (request, response) => {
//   const csrfToken = generateToken(response);
//   // You could also pass the token into the context of a HTML response.
//   res.json({ csrfToken });
// };

// app.get("/csrf-token", myRoute);

// app.use(doubleCsrfProtection);

app.use((req, res, next) => {
  User.findById(req.session?.user?._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req,res,next)=>{
//   req.headers['x-csrf-token'] = req.body.csrfToken
//   next()
// })
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

const server = http.createServer(app);

//module.exports = path.dirname(require.main.filename);
// mongoConnect(() => {
// });

mongoose
  .connect(mongodb_URI)
  .then(() => {
    // User.findOne()
    //   .then((user) => {
    //     if (!user) {
    //       const user = new User({
    //         name: "Saif",
    //         email: "saif@gmail.com",
    //         cart: { items: [] },
    //       });
    //       user.save();
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    server.listen(3000);
  })
  .catch((err) => console.log(err));
