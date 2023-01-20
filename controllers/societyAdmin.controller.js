const Admin = require("../models/residentialUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const HouseOwner = require("../models/houseOwner");
const UserToken = require("../models/residentialUserToken");
const Society = require("../models/society");
const sendSMS = require("../services/mail");
// socity admin singup
exports.adminsingUp = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.email || !req.body.password) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        };
        let residentialUser = await Admin.findOne({ "email": req.body.email,"isDeleted": false });
        if (residentialUser) {
            if (residentialUser.email == req.body.email) {
                return res.status(200).send({
                    message: locale.valide_phone,
                    success: false,
                    data: {},
                });
            }
        }
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        let password = await bcrypt.hash(req.body.password, 10);
        let society = await Society.findOne({ "_id": req.body.societyId, "isDeleted": false });
        await Admin.create({
            name: req.body.name,
            address: req.body.address,
            email:req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: password,
            designationId: req.body.designationId,
            houseNumber: req.body.houseNumber,
            societyUniqueId: society.uniqueId,
            societyId: req.body.societyId,
            isAdmin: '1',
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
        }).then(async data => {
            data.profileImage = process.env.API_URL + "/" + data.profileImage;
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.user_not_added,
                success: false,
                data: {},
            })
        });
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

exports.adminlogin = async (req, res) => {
    try {
        if (!req.body.password || !req.body.email) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        await Admin.findOne({ 'email': req.body.email, "isDeleted":false }).then(async result => {
            console.log(result);
            if (result == null) {
                return res.status(200).send({
                    message: locale.user_not_exists,
                    success: false,
                    data: {},
                });
            }
            if (result.isAdmin == "0") {
                return res.status(200).send({
                    message: locale.admin_not_valide,
                    success: false,
                    data: {},
                });
            }
            const accessToken = generateAccessToken({ user: req.body.email });
            const refreshToken = generateRefreshToken({ user: req.body.email });
            if (result.societyId){
             let society = await Society.findOne({ '_id': result.societyId, 'status':"active" });
             if(!society){
                 return res.status(200).send({
                     message: locale.society_Status,
                     success: false,
                     data: {},
                 });
             }
            };
            if (result.status == "inactive") {
                return res.status(200).send({
                    message: locale.admin_status,
                    success: false,
                    data: {},
                });
            }
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    result.profileImage = process.env.API_URL + "/" + result.profileImage;
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
            } else {
                return res.status(200).send({
                    message: locale.varify_otp,
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
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.sendInvitetion = async (req, res) => {
    let admin = await helper.validateSocietyAdmin(req);
    let uniqueId = admin.societyUniqueId;
    // let code = await bcrypt.hash(uniqueId, 2);
    console.log(uniqueId);
    let message = locale.invitationcode_text;
    message = message.replace('%InvitationCode%', process.env.API_URL + "/" +"api/user/invitation/accept/"+uniqueId);
    req.body.subject = "M.SOCIETY: Your Invitation Link";
    // await sendSMS.sendEmail(req, res, message);
    return res.status(200).send({
        message: locale.Invitation_send,
        success: true,
        data: {},
    })
};

exports.passwordChange = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        console.log("181", user);
        if (!req.body.oldPassword || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_old_new_password,
                success: false,
                data: {},
            })
        };
        await Admin.findOne({ '_id': user._id }).then(async result => {
            if (await bcrypt.compare(req.body.oldPassword, result.password)) {
                let password = await bcrypt.hash(req.body.newPassword, 10);
                await Admin.updateOne({
                    "_id": result._id,
                }, {
                    $set: {
                        "password": password,
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
                    message: locale.wrong_oldPassword,
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
        if (!req.body.phoneNumber || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_email,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber }).then(async result => {
            if (result) {
                if (result.otp == req.body.otp) {
                    let password = await bcrypt.hash(req.body.newPassword, 10);
                    await ResidentialUser.updateOne({
                        "_id": result._id,
                    }, {
                        $set: {
                            "password": password,
                            "verifyOtp": "1"
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
                    message: id_not_update,
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

exports.logout = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        if (!req.body.refresh_token || !req.body.token) {
            return res.status(200).send({
                message: locale.enter_token,
                success: false,
                data: {},
            });
        }
        refreshTokens = refreshTokens.filter((c) => c != req.body.refresh_token);
        accessTokens = accessTokens.filter((c) => c != req.body.token);
        //Remove token from the userteminal table
        // UserToken.updateOne({
        //     'accountId': user._id
        // }, {
        //     $set: {
        //         refreshTokens: null,
        //         accessTokens: null
        //     }
        // }).then((data) => {
            return res.status(200).send({
                message: locale.logout,
                success: true,
                data: {}
            });
        // });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

exports.makeSupAdmin = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            })
        };
        await Admin.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                "isAdmin": "2"
            }
        }
        ).then(data => {
            return res.status(200).send({
                message: locale.residentialUser_update,
                success: true,
                data: {},
            });
        }).catch(err => {
            return res.status(400).send({
                message: locale.residentialUser_not_update,
                success: false,
                data: {},
            });
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

exports.refreshToken = async (req, res) => {
    try {
        if (!req.body.token || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.refresh_token,
                success: false,
                data: {},
            });
        }
        if (!refreshTokens.includes(req.body.token))
            return res.status(400).send({
                success: false,
                message: locale.refreshToken_invalid,
                data: {},
            });
        refreshTokens = refreshTokens.filter((c) => c != req.body.token);
        //remove the old refreshToken from the refreshTokens list
        const accessToken = generateAccessToken({ user: req.body.phoneNumber });
        const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
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