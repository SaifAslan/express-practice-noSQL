const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const Crypto = require("crypto");
const { ObjectId } = require("mongodb");
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.sendGrid_API_key,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage,
  });
};
exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
    isAuthenticated: false,
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  Crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash("error", "Error occured, contact support!");
      return req.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter.sendMail({
          to: req.body.email,
          from: "saifaslan24@gmail.com",
          subject: "Reset password",
          html:
            "<div><h1>reset your password using the link below</h1><a href='http://localhost:3000/reset/" +
            token +
            "'>reset</a></div>",
        });
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  let token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let errorMessage = req.flash("error");
      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage,
        isAuthenticated: false,
        token,
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      const email = req.body.email;
      const password = req.body.password;

      User.findOne({ email })
        .then((user) => {
          if (!user) {
            req.flash("error", "Invalid email. ");
            return res.redirect("/login");
          }
          bcrypt.compare(password, user.password).then((doMatch) => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/");
              });
            }

            req.flash("error", "password is wrong!");
            res.redirect("/login");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email exists already");

        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          let user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          transporter.sendMail({
            to: email,
            from: "saifaslan24@gmail.com",
            subject: "Signup Succeeded",
            html: "<h1>Signup Succeeded!!</h1>",
          });
          res.redirect("/login");
        })

        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSaveNewPassword = (req, res, next) => {
  let password = req.body.password;
  let userId = req.body.userId;
  let passwordToken = req.body.token;
  console.log(password, userId);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.findOne({
        _id: new ObjectId(userId),
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
      })
        .then((user) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
