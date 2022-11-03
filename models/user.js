const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

class User {
  constructor(username, email, cart, _id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items?.findIndex(
      (item) => item._id.toString() === product._id.toString()
    );
    let newQuantity = 1;
    let updatedItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedItems.push({
        _id: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    let updatedCart = { items: updatedItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const cartProductIds = this.cart.items.map((prod) => prod._id);
    return db
      .collection("products")
      .find({ _id: { $in: cartProductIds } })
      .toArray()
      .then((prods) => {
        let modifiedProds = [...prods];
        return modifiedProds.map((prod) => {
          return {
            ...prod,
            quantity:
              this.cart.items.find(
                (item) => item._id.toString() === prod._id.toString()
              ).quantity ?? 0,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  static findUserById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }

  deleteItemFromCart(productId) {
    let newItems = this.cart.items.filter(
      (item) => item._id.toString() !== productId
    );
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: newItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart.items = [];
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray()
      .then((orders) => {
        console.log(orders);
        return orders
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
