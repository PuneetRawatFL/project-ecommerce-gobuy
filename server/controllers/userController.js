const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//creating secret key
const SECRET_KEY = "puneet@123";
// const tokenBlacklist =

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

const userController = async (req, res) => {
    console.log(req.body);

    //destructuring
    const { action, fname, lname, email, password, passwordConfirm } = req.body;

    console.log(action);

    //for login
    if (action === "login") {
        // res.json(req.body.email);

        connection.query(
            "select * from users where email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                }
                if (results.length == 0) {
                    return res.json("No such user found!");
                }

                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json("Invalid credentials");
                }

                //generating jwt
                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                //send as cookie
                // res.cookie("token", token, { httpOnly: false });
                res.cookie("token", token, {
                    httpOnly: false,
                    domain: "localhost",
                    path: "/",
                });

                console.log(token);

                return res.status(200).json({
                    message: "User logged in successfully",
                    result: user,
                });
            }
        );
    }

    //for register
    if (action === "register") {
        connection.query(
            "select email from users where email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                }

                if (results.length > 0) {
                    return res.json("Email already in use");
                }
                if (password !== passwordConfirm) {
                    return res.json("Password do not match");
                } else {
                    let hashPassword = await bcrypt.hash(password, 8);
                    console.log(hashPassword);

                    connection.query(
                        "Insert into users set ?",
                        { name: fname, email: email, password: hashPassword },
                        (error, results) => {
                            if (error) {
                                console.error(error);
                            } else {
                                console.log(results);
                                return res
                                    .status(200)
                                    .json("user registered successfully");
                            }
                        }
                    );
                }
            }
        );
    }
};
module.exports = userController;
