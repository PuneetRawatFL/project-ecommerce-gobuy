const mysql = require("mysql");

//creating connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "gobuy",
});

//connecting
connection.connect((err) => {
    if (err) {
        return console.error("Error connecting to database: ", err);
    }

    console.log("database connected");
});
