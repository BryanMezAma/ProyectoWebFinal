"use strict";

const jwt = require("jsonwebtoken");

let privateKey = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
    let token = req.get("x-auth");
    

    if (token == undefined) {
        return res.status(403).type("text/plain").send("Missing token");
    }

    jwt.verify(token, privateKey, (err, decoded) => {
        
        if (err)
            return res.status(403).type("text/plain").send("Invalid token");

        req.userInfo = decoded;
        next();
    });
};

exports.verifyToken = verifyToken;