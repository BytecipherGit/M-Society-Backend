const User = require("../models/superAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.singup = async (req, res) => {
    try {

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(async data => {
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: {},
            })

        }).catch(err => {
            console.log(err);
            return res.status(200).send({
                message: locale.user_not_added,
                success: false,
                data: {},
            })
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

// accessTokens functionality
let accessTokens = [];

// accessTokens
function generateAccessToken(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
    });
    accessTokens.push(accessToken);
    return accessToken;
}

// refreshTokens after the access token expires
let refreshTokens = [];

function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1hr",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
}

exports.login = async (req, res) => {
    try {
        if (!req.body.password || !req.body.email) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: true,
                data: {},
            })
        };
        await User.findOne({ 'email': req.body.email }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.email });
            const refreshToken = generateRefreshToken({ user: req.body.email });
            if (req.body.password == result.password) {
                return res.status(200).send({
                    message: locale.login_success,
                    success: true,
                    data: result,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            } else {
                return res.status(200).send({
                    message: locale.wrong_username_password,
                    success: true,
                    data: {},
                });
            }
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.user_not_exists,
                success: true,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(200).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.passwordChange = async (req, res) => {
    try {
        if (!req.body.password || !req.body.email || !res.body.changePassword) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: true,
                data: {},
            })
        };
        await User.findOne({ 'email': req.body.email }).then(async result => {
            if (req.body.password == result.password) {
                await User.updateOne({
                    "_id": result._id,
                }, {
                    $set: {
                        "password": req.body.changePassword,
                    }
                }
                );
                return res.status(200).send({
                    message: locale.password_update,
                    success: true,
                    data: {},
                });
            } else {
                return res.status(200).send({
                    message: locale.wrong_username_password,
                    success: true,
                    data: {},
                });
            }
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.user_not_exists,
                success: true,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(200).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.ForgetPassword = async (req, res) => {
    try {
        if (!req.body.email || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_email,
                success: true,
                data: {},
            })
        };
        await User.findOne({ 'email': req.body.email }).then(async result => {
            if (result) {
                await User.updateOne({
                    "_id": result._id,
                }, {
                    $set: {
                        "password": req.body.newPassword,
                    }
                }
                );
                return res.status(200).send({
                    message: locale.password_update,
                    success: true,
                    data: {},
                });
            } else {
                return res.status(200).send({
                    message: id_not_update,
                    success: true,
                    data: {},
                });
            }
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.user_not_exists,
                success: true,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(200).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};