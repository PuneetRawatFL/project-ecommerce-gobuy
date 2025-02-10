const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//creating secret key
const SECRET_KEY = "puneet@123";
// const tokenBlacklist =

//creating connection
const connection = require("../config/dbConnection.js");

const userController = async (req, res) => {
    console.log(req.body);

    //destructuring
    const { action, fname, lname, email, password, passwordConfirm } = req.body;

    console.log(action);

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
                        {
                            name: fname,
                            email: email,
                            password: hashPassword,
                            created_on: new Date(),
                            status: "active",
                        },
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

    if (action === "resetPassword") {
        // console.log("reset password");
        return res.status(200).json("reset pasword");
    }
};
module.exports = userController;
