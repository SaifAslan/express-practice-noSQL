const http = require("http");

require("dotenv").config();

const sequelize = require("./utils/database");

const express = require("express");

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const { get404 } = require("./controllers/error");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

const server = http.createServer(app);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    user.createCart();
  })
  .then(() => {
    server.listen(3000);
  })
  .catch((err) => console.log(err));

//module.exports = path.dirname(require.main.filename);
