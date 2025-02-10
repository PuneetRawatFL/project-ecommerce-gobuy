const mysql = require("mysql");

//creating connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "gobuy",
    multipleStatements: true,
});

//connecting
db.connect((err) => {
    if (err) {
        return console.error("Error connecting to database: ", err);
    }

    console.log("database connected");
});

module.exports = db;
