const SuperAdmin = require("../models/superAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const sendSMS = require("../services/mail");
exports.singup = async (req, res) => {
    try {
        await SuperAdmin.create({
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
            return res.status(400).send({
                message: locale.user_not_added,
                success: false,
                data: {},
            })
        })
    }
    catch (err) {
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
        expiresIn: "45min",
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
                success: false,
                data: {},
            })
        };
        await SuperAdmin.findOne({ 'email': req.body.email }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.email });
            const refreshToken = generateRefreshToken({ user: req.body.email });
            // if (result.verifyOtp=="1"){
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
                        success: false,
                        data: {},
                    });
                }
            // } else {
            //     return res.status(200).send({
            //         message: locale.varify_otp,
            //         success: false,
            //         data: {},
            //     });
            // }
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.user_not_exists,
                success: false,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.passwordChange = async (req, res) => {
    try {
        if (!req.body.password || !req.body.email || !req.body.changePassword) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        await SuperAdmin.findOne({ 'email': req.body.email }).then(async result => {
            if (req.body.password == result.password) {
                await SuperAdmin.updateOne({
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
                    success: false,
                    data: {},
                });
            }
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.user_not_exists,
                success: false,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.ForgetPassword = async (req, res) => {
    try {
        if (!req.body.email || !req.body.newPassword || !req.body.otp) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            })
        };
        await SuperAdmin.findOne({ 'email': req.body.email }).then(async result => {
            if (result) {
                if (result.otp == req.body.otp) {
                    await SuperAdmin.updateOne({
                        "_id": result._id,
                    }, {
                        $set: {
                            "password": req.body.newPassword,
                            "verifyOtp":"1"
                        }
                    }
                    );
                    return res.status(200).send({
                        message: locale.password_update,
                        success: true,
                        data: {},
                    });
                } else {
                    return res.status(400).send({
                        message: locale.otp_not_match,
                        success: false,
                        data: {},
                    });
                }

            } else {
                return res.status(200).send({
                    message: locale.id_not_update,
                    success: false,
                    data: {},
                });
            }
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.user_not_exists,
                success: false,
                data: {},
            })
        });
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.sendotp = async (req, res) => {
    try {
        if (!req.body.email){
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            })
        }
        await SuperAdmin.findOne({ "email": req.body.email })
            .then(async result => {
                let otp = Math.floor(1000 + Math.random() * 9000);
                if (result) {
                    await SuperAdmin.updateOne({
                        "_id": result._id,
                    }, {
                        $set: {
                            "otp": otp,
                            "verifyOtp":"0"
                        }
                    }
                    );
                    // let message = locale.otp_text;
                    // message = message.replace('%OTP%', otp);
                    // req.body.subject = "M.SOCIETY: Your OTP";
                    // sendSMS.sendEmail(req,res,message);
                    return res.status(200).send({
                        message: locale.otp_send,
                        success: true,
                        data: { "otp": otp },
                    });
                } else {
                    return res.status(400).send({
                        message: locale.valide_email,
                        success: false,
                        data: {},
                    });
                }
            }).catch(err => {
                return res.status(400).send({
                    message: err.message + locale.user_not_exists,
                    success: false,
                    data: {},
                });
            })
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }

};

exports.logout = async (req, res) => {
    try {
        let admin = await helper.validateSuperAdmin(req);
        if (!req.body.refresh_token || !req.body.token) {
            return res.status(200).send({
                message: locale.enter_token,
                success: false,
                data: {},
            });
        }
        refreshTokens = refreshTokens.filter((c) => c != req.body.refresh_token);
        accessTokens = accessTokens.filter((c) => c != req.body.token);
        //remove the old refreshToken from the refreshTokens list
        res.status(200).send({
            message: locale.logout,
            success: true,
            data: {},
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        if (!req.body.token || !req.body.email) {
            return res.status(200).send({
                message: locale.refresh_token,
                success: false,
                data: {},
            });
        };
        if (!refreshTokens.includes(req.body.token))
            return res.status(400).send({
                success: false,
                message: locale.refreshToken_invalid,
                data: {},
            });
        refreshTokens = refreshTokens.filter((c) => c != req.body.token);
        //remove the old refreshToken from the refreshTokens list
        const accessToken = generateAccessToken({ user: req.body.phone });
        const refreshToken = generateRefreshToken({ user: req.body.phone });
        //generate new accessToken and refreshTokens
        return res.status(200).send({
            success: true,
            message: locale.token_fetch,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};