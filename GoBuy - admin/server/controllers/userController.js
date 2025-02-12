const bcrypt = require("bcryptjs");

//creating connection
const connection = require("../config/dbConnection.js");

const userController = async (req, res) => {
    console.log(req.body);

    //destructuring
    const {
        action,
        fname,
        lname,
        email,
        password,
        passwordConfirm,
        userId,
        newPassword,
        newPasswordConfirm,
    } = req.body;

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
                    return res.status(400).json("Email already in use");
                }
                if (password !== passwordConfirm) {
                    return res.status(400).json("Passwords do not match");
                } else {
                    let hashPassword = await bcrypt.hash(password, 8);
                    // console.log(hashPassword);
                    connection.query(
                        "Insert into users set ?",
                        {
                            name: fname,
                            email: email,
                            password: hashPassword,
                            created_on: new Date(),
                            user_status: "active",
                        },
                        (error, results) => {
                            if (error) {
                                console.error(error);
                            } else {
                                // console.log(results);
                                return res
                                    .status(200)
                                    .json("User registered successfully");
                            }
                        }
                    );
                }
            }
        );
    }

    if (action === "resetPassword") {
        console.log(req.body);
        // console.log(newPassword);
        // console.log(newPasswordConfirm);

        if (newPassword !== newPasswordConfirm) {
            return res.status(400).json("Passwords do not match!");
        }

        let hashPassword = await bcrypt.hash(newPassword, 8);

        connection.query(
            `update users set password = '${hashPassword}' where userId = ${userId}`,
            (error, results) => {
                if (error) return res.status(400).json({ error: error });

                return res.status(200).json("Password changed successfully");
            }
        );
    }
};
module.exports = userController;
