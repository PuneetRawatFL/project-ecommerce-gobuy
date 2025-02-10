const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//creating secret key
const SECRET_KEY = "puneetAdmin@123";

//creating connection
const connection = require("../config/dbConnection.js");

const adminController = async (req, res) => {
    console.log(req.body);

    //destructuring
    const { action, fname, lname, email, password, passwordConfirm } = req.body;

    console.log(action);

    //for login
    if (action === "login") {
        // res.json(req.body.email);

        connection.query(
            "select * from admin where email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                }
                if (results.length == 0) {
                    return res.json("No such admin found!");
                }

                const admin = results[0];
                console.log("admin: ", admin);
                const isMatch = await bcrypt.compare(password, admin.password);

                if (!isMatch) {
                    return res.status(400).json("Invalid credentials");
                }

                //generating jwt
                const token = jwt.sign(
                    { id: admin.adminId, email: admin.email, name: admin.name },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );

                //send as cookie
                // document.cookie = `token =${token}`;
                // res.cookie("token", token, { httpOnly: false });
                res.cookie("token", token, {
                    httpOnly: false,
                    domain: "localhost",
                    path: "/",
                });

                // console.log(token);

                return res.status(200).json({
                    message: "admin logged in successfully",
                    result: admin,
                    token: token,
                });
            }
        );
    }

    //for register
    if (action === "register") {
        connection.query(
            "select email from admin where email = ?",
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
                        "Insert into admin set ?",
                        { name: fname, email: email, password: hashPassword },
                        (error, results) => {
                            if (error) {
                                console.error(error);
                            } else {
                                console.log(results);
                                return res
                                    .status(200)
                                    .json("admin registered successfully");
                            }
                        }
                    );
                }
            }
        );
    }
};
module.exports = adminController;
