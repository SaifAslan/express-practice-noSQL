const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
  "node-complete",
  "root",
  process.env.database_password,
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: process.env.database_password,
// });

// module.exports = pool.promise();
