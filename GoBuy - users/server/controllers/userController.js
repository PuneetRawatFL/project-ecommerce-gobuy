const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//creating secret key
const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const tokenBlacklist =

//creating connection
const connection = require("../config/dbConnection.js");

const userController = async (req, res) => {
    // console.log(req.body);

    //destructuring
    const { action, fname, lname, email, password, passwordConfirm } = req.body;

    // console.log(action);

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
                    return res.status(400).json("No such user exists");
                }

                if (results[0].user_status === "inactive") {
                    return res.status(400).json("User account is inactive");
                }

                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json("Wrong Password");
                }

                //generating jwt
                const token = jwt.sign(
                    { id: user.id, email: user.email },
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
                    message: "User logged in successfully",
                    result: user,
                    token: token,
                });
            }
        );
    }

    //for register
    if (action === "register") {
        const now = new Date();
        connection.query(
            "select email from users where email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                }

                if (results.length > 0) {
                    return res.status(400).json("Email already in use");
                }
                if (password !== passwordConfirm) {
                    return res.status(400).json("Password do not match");
                } else {
                    let hashPassword = await bcrypt.hash(password, 8);
                    console.log(hashPassword);

                    connection.query(
                        "Insert into users set ?",
                        {
                            name: fname,
                            email: email,
                            password: hashPassword,
                            created_on: now,
                            user_status: "active",
                        },
                        (error, results) => {
                            if (error) {
                                console.error(error);
                                return res
                                    .status(400)
                                    .json("Error registering user");
                            } else {
                                // console.log(results);
                                return res.status(200).json({
                                    message: "User Registered successfully",
                                    action: "register",
                                    result: results,
                                    // token: token,
                                });
                            }
                        }
                    );
                }
            }
        );
    }
};
module.exports = userController;
