const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;
class Product {
  constructor(id, title, price, description, imageUrl, userId) {
    this._id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbFn;
    let productData = {
      title: this.title,
      description: this.description,
      price: this.price,
      imageUrl: this.imageUrl,
      userId: this.userId,
    };
    if (this._id) {
      dbFn = db.collection("products").updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        {
          $set: productData,
          $currentDate: { lastModified: true },
        }
      );
    } else {
      dbFn = db.collection("products").insertOne(productData);
    }
    return dbFn;
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findProductById(id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteProductById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
