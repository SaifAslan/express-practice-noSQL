const { Sequelize } = require("sequelize");

const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Product;
// const { removeProdFromCartById } = require("./cart");
// const db = require("../utils/database");
// module.exports = class product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       `INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?,  ?, ?)`,
//       [this.title, this.imageUrl, this.description, this.price]
//     );
//   }

//   static fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     console.log("find by",id);
//     return db.execute(`SELECT * FROM products WHERE products.id = ?`, [id]);
//   }

//   static deleteById(id) {}
// };
