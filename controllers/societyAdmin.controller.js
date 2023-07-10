const Admin = require("../models/residentialUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const HouseOwner = require("../models/houseOwner");
const UserToken = require("../models/residentialUserToken");
const Society = require("../models/society");
const sendEmail = require("../services/mail");
const Designation = require("../models/designation");
const SendSSM = require("../services/msg");
// socity admin singup
exports.adminsingUp = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.password) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        };
        // let residentialUser = await Admin.findOne({ "phoneNumber": req.body.phoneNumber, "isDeleted": false });
        // if (residentialUser) {
        //     if (residentialUser.email == req.body.email) {
        //         return res.status(200).send({
        //             message: locale.use_email,
        //             success: false,
        //             data: {},
        //         });
        //     }
        // }
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        let password = await bcrypt.hash(req.body.password, 10);
        let society = await Society.findOne({ "_id": req.body.societyId, "isDeleted": false });
        await Admin.create({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
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
        expiresIn: "1d",
    });
    accessTokens.push(accessToken);
    return accessToken;
}

// refreshTokens after the access token expires
let refreshTokens = [];

function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "2d",
    });
    refreshTokens.push(refreshToken);
    return refreshToken;
}

exports.adminlogin = async (req, res) => {
    try {
        if (!req.body.password || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        await Admin.findOne({ 'phoneNumber': req.body.phoneNumber, 'isDeleted': false, 'countryCode': req.body.countryCode, }).then(async result => {
            if (result == null) {
                return res.status(200).send({
                    message: locale.user_not_exists,
                    success: false,
                    data: {},
                });
            }
            if (result.isAdmin == 0) {
                return res.status(200).send({
                    message: locale.valid_admin,
                    success: false,
                    data: {},
                });
            }
            if (result.status == "inactive") {
                return res.status(200).send({
                    message: locale.admin_status,
                    success: false,
                    data: {},
                });
            }
            if (result.societyId) {
                let society = await Society.findOne({ '_id': result.societyId });
                if (society.isVerify == false) {
                    return res.status(200).send({
                        message: locale.society_not_verify,
                        success: false,
                        data: {},
                    });
                }
                if (society.status == "inactive") {
                    return res.status(200).send({
                        message: locale.society_Status,
                        success: false,
                        data: {},
                    });
                }
            };
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    const accessToken = generateAccessToken({ user: req.body.phoneNumber });
                    const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
                    let accessTokenExpireTime = process.env.AUTH_TOKEN_EXPIRE_TIME;
                    accessTokenExpireTime = accessTokenExpireTime.slice(0, -1);
                    console.log("req.body.deviceToken ", req.body.deviceToken);
                    let token = {
                        // 'terminalId': (req.body.terminalId) ? req.body.terminalId : null,
                        'deviceToken': (req.body.deviceToken) ? req.body.deviceToken : null,
                        'accountId': result._id,
                        'userType': "socety-admin",
                        'accessToken': accessToken,
                        'refreshToken': refreshToken,
                        'tokenExpireAt': helper.addHours(accessTokenExpireTime / 60),
                        'deviceType': (req.body.deviceType) ? req.body.deviceType : null,
                        'deviceType': (req.body.deviceType) ? req.body.deviceType : null,
                    };
                    let userToken = await UserToken.findOne({
                        'accountId': result._id
                    });
                    //If token/terminal already exists then update the record
                    if (userToken) {
                        await UserToken.updateOne({
                            'accountId': result._id
                        }, token);
                    } else {
                        await UserToken.create(token);
                    }
                    if (result.profileImage) {
                        result.profileImage = process.env.API_URL + "/" + result.profileImage;
                    }
                    return res.status(200).send({
                        message: locale.login_success,
                        success: true,
                        data: result,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userType: "SOCIETY_ADMIN"
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
    // let message = locale.invitationcode_text;
    // message = message.replace('%InvitationCode%', process.env.API_URL + "/" + "api/user/invitation/accept/" + uniqueId);
    // req.body.subject = "M.SOCIETY: Your Invitation Link";
    //req.body.email=""
    // await sendEmail.sendEmail(req, res, message);
    return res.status(200).send({
        message: locale.Invitation_send,
        success: true,
        data: {},
    })
};

exports.passwordChange = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
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
            message: locale.something_went_wrong,
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
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber, 'countryCode': req.body.countryCode }).then(async result => {
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
            message: locale.something_went_wrong,
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
            message: locale.something_went_wrong,
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
            message: locale.something_went_wrong,
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
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

exports.societyGet = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        await Admin.find({ 'phoneNumber': admin.phoneNumber, 'isDeleted': false }).then(async result => {
            let data = [];
            let detail
            for (let i = 0; i < result.length; i++) {
                let a = await Society.findOne({ societyAdimId: result[i]._id });
                if (admin.societyId.toString() == a._id.toString()) {
                    detail = {
                        "society": a,
                        "isActive": true
                    }
                } else {
                    detail = {
                        "society": a,
                        "isActive": false
                    }
                }
                data.push(detail)
            }
            return res.status(200).send({
                success: true,
                message: locale.society_fetched,
                data: data,
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: locale.something_went_wrong,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}

exports.swichSociety = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        await Admin.findOne({ phoneNumber: admin.phoneNumber, 'societyId': req.body.societyId }).then(async result => {
            const accessToken = generateAccessToken({ user: result.email });
            const refreshToken = generateRefreshToken({ user: result.email });
            return res.status(200).send({
                success: true,
                message: locale.society_Switch,
                data: result,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: locale.something_went_wrong,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}

//residential user add 
exports.userAdd = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        let num = Math.floor(1000 + Math.random() * 9000);
        var pass = "1234"//num.toString();
        let password = await bcrypt.hash(pass, 10);
        let society = await Society.findOne({ "_id": user.societyId });
        let adminIs = 0;
        let desId, userType1;
        if (!req.body.designationId) {
            let des = await Designation.findOne({ "name": "User" });
            desId = des._id;
            userType1 = des.name
        } else {
            let des = await Designation.findOne({ "_id": req.body.designationId });
            if (des.name == "Sub Admin") {
                adminIs = 2;
            }
            desId = req.body.designationId;
            userType1 = des.name
        }
        let resiUser = await Admin.findOne({ "phoneNumber": req.body.phoneNumber, "isDeleted": false, "societyId": user.societyId });
        if (resiUser) {
            return res.status(200).send({
                message: locale.user_exist,
                success: false,
                data: {},
            })
        }
        let resiUserHouseNo = await Admin.findOne({ "houseNumber": req.body.houseNumber, "isDeleted": false, "societyId": user.societyId });
        if (resiUserHouseNo) {
            return res.status(200).send({
                message: locale.house_number,
                success: false,
                data: {},
            })
        }
        await Admin.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: password,
            designationId: desId,
            houseNumber: req.body.houseNumber,
            societyUniqueId: society.uniqueId,
            societyId: user.societyId,
            address: user.address,
            isAdmin: adminIs,
            status: req.body.status,
            occupation: req.body.occupation,
            userType: req.body.userType,
            countryCode: req.body.countryCode
        }).then(async data => {
            // send msg on phone number 
            // let message = locale.password_text;
            // req.body.subject = "M.SOCIETY: Your Account Password";
            // message = message.replace('%PASSWORD%', pass);
            // await SSM.sendSsm(req,res, message)
            if (req.body.userType == "rental") {
                await HouseOwner.create({
                    name: req.body.ownerName,
                    email: req.body.ownerEmail,
                    address: req.body.ownerAddress,
                    phoneNumber: req.body.ownerPhoneNumber,
                    societyId: req.body.societyId,
                    residentialUserId: data._id,
                    status: req.body.status,
                    countryCode: req.body.countryCode
                })
            }
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: data,
                password: pass
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.user_not_added,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}