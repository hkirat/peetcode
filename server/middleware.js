const JWT_SECRET = "secret";
var jwt = require('jsonwebtoken');


module.exports = {
    auth: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        // console.log("auth header is " + authHeader + " " + typeof(authHeader));
        if (!authHeader || authHeader === "null") {
            return res.json({msg: "Missing auth header"});
        }
        // const decoded = null;
        const decoded = jwt.verify(authHeader, JWT_SECRET);
        if (decoded && decoded.email) {
            req.email = decoded.email;
            next()
        } else {
            return res.status(403).json({msg: "Incorrect token"});
        }
    }
}