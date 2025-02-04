const jwt = require("jsonwebtoken");
const SECRET_KEY = "puneet@123";

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("unauthorised");

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Unauthorised");
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
