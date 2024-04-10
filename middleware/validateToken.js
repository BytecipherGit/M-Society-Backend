require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");

exports.validateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null)
            return res.status(400).send({
                message: locale.device_token_not_present,
                success: false,
                data: {}
            });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).send({
                    message: locale.device_token_invalid,
                    success: false,
                    data: {}
                });
            } else {
                // if (user.user !== -1) {
                //     let userAccount = await UserAccount.findById(user.user);
                //     if (userAccount.status === 'inactive') {
                //         return res.status(406).send({
                //             message: "Your status is inactive, please contact to administrator!",
                //             success: false,
                //             data: {}
                //         });
                //     }
                // }
                // req.user = user;
                next() //proceed to the next action in the calling function
            }
        }) //end of jwt.verify()
    } else {
        return res.status(400).send({
            message: locale.device_token_not_present,
            success: false,
            data: {}
        });
    }
};