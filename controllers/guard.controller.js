const Guard = require("../models/guard");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const Society = require("../models/society");
const SSM = require("../services/msg");
const UserToken = require("../models/residentialUserToken");
const Setting = require("../models/setting");

// guard api for admin start
exports.add = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.shift || !req.body.dob || !req.body.joiningDate || !req.body.countryCode) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let existGuard = await Guard.findOne({ "phoneNumber": req.body.phoneNumber, "societyId": admin.societyId, "deleted": false });
        if (existGuard) {
            return res.status(400).send({
                message: locale.guard_exist,
                success: false,
                data: {},
            })
        }
        let image, idProof;
        if (req.files.length == 0) {
            image = "";
            idProof = ""
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == 'profileImage')
                    image = req.files[i].filename;
                if (req.files[i].fieldname == 'idProof')
                    idProof = req.files[i].filename;
            }
        }
        await Guard.create({
            name: req.body.name,
            address: req.body.address,
            shift: req.body.shift,
            phoneNumber: req.body.phoneNumber,
            societyId: admin.societyId,
            societyAdminId: admin._id,
            profileImage: image,
            dob: req.body.dob,
            idProof: idProof,
            countryCode: req.body.countryCode,
            joiningDate: req.body.joiningDate
        }).then(async data => {
            let num = Math.floor(1000 + Math.random() * 9000);
            var pass = "1234"//num.toString();
            let password = await bcrypt.hash(pass, 10);
            // send msg on phone number 
            // let message = locale.guard_msg_text;
            // message = message.replace('%PASSWORD%', pass);
            // await SSM.sendSsm(req,res, message)
            await Guard.updateOne({ "_id": data._id, }, {
                $set: {
                    password: password,
                }
            });
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.id_created_not,
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

exports.update = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let guard = await Guard.findOne({ "_id": req.body.id, "deleted": false });
        let image, idProof;
        if (req.files.length == 0) {
            if (guard.profileImage)
                image = guard.profileImage;
            if (guard.idProof)
                idProof = guard.idProof
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == 'profileImage')
                    image = req.files[i].filename;
                if (req.files[i].fieldname == 'idProof')
                    idProof = req.files[i].filename;
            }
        }
        let password = guard.password
        if (req.body.password) {
            var pass = req.body.password
            password = await bcrypt.hash(pass, 10);
        }
        await Guard.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                shift: req.body.shift,
                phoneNumber: req.body.phoneNumber,
                societyId: req.body.societyId,
                societyAdminId: req.body.societyAdminId,
                status: req.body.status,
                profileImage: image,
                dob: req.body.dob,
                idProof: idProof,
                countryCode: req.body.countryCode,
                joiningDate: req.body.joiningDate,
                password: password
            }
        }
        ).then(async result => {
            let data = await Guard.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;

            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
        }).catch(err => {
            console.log(err);
            return res.status(400).send({
                message: locale.valide_id_not,
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

exports.delete = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Guard.destroy({ "_id": req.body.id }).then(async data => {
            if (data.deletedCount == 0) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            } else {
                return res.status(200).send({
                    message: locale.id_deleted,
                    success: true,
                    data: {},
                })
            }

        }).catch(err => {
            return res.status(400).send({
                message: locale.valide_id_not,
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Guard.findOne({ "_id": req.params.id, "deleted": false }).then(async data => {
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.valide_id_not,
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

exports.all = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "societyId": admin.societyId, "deleted": false };
        await Guard.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }

                if (doc.length > 0) {
                    for (let step = 0; step < doc.length; step++) {
                        if (doc[step].profileImage) {
                            doc[step].profileImage = process.env.API_URL + "/" + doc[step].profileImage
                        }
                        if (doc[step].idProof) {
                            doc[step].idProof = process.env.API_URL + "/" + doc[step].idProof
                        }
                    }
                }
                let totalData = await Guard.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                if (!doc) {
                    return res.status(200).send({
                        success: true,
                        message: locale.is_empty,
                        data: {},
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: locale.id_fetched,
                    data: doc,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
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
// guard api for admin end

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

//login
exports.login = async (req, res) => {
    try {
        if (!req.body.password || !req.body.phoneNumber || !req.body.countryCode) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        const currentDate = new Date().toLocaleDateString('en-CA');
        await Guard.findOne({ 'phoneNumber': req.body.phoneNumber, 'deleted': false, 'countryCode': req.body.countryCode, }).populate('societyId').then(async result => {
            if (result == null) {
                return res.status(200).send({
                    message: locale.user_not_exists,
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
                let society = await Society.findOne({ '_id': result.societyId, 'status': "active" });
                if (!society) {
                    return res.status(200).send({
                        message: locale.society_Status,
                        success: false,
                        data: {},
                    });
                }
            };
            const subDate = result.joiningDate.toLocaleDateString('en-CA');
            if (subDate > currentDate) {
                return res.status(200).send({
                    message: "Your Joining Date Is Not Started",// yet please try the date",
                    success: false,
                    data: {},
                });
            }
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    const accessToken = generateAccessToken({ user: req.body.phoneNumber });
                    const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
                    let accessTokenExpireTime = process.env.AUTH_TOKEN_EXPIRE_TIME;
                    accessTokenExpireTime = accessTokenExpireTime.slice(0, -1);
                    let token = {
                        // 'terminalId': (req.body.terminalId) ? req.body.terminalId : null,
                        'deviceToken': (req.body.deviceToken) ? req.body.deviceToken : null,
                        'accountId': result._id,
                        'userType': 'guard',
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
                        UserToken.create(token);
                    }
                    if (result.profileImage) {
                        result.profileImage = process.env.API_URL + "/" + result.profileImage;
                    }
                    return res.status(200).send({
                        success: true,
                        message: locale.login_success,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        data: result,
                        // isVerified: (user.accountVerified) ? user.accountVerified : false
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

//send otp
exports.sendotp = async (req, res) => {
    try {
        if (!req.body.phoneNumber || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_phoneNumber,
                success: false,
                data: {},
            });
        }
        await Guard.findOne({ "phoneNumber": req.body.phoneNumber, 'countryCode': req.body.countryCode })
            .then(async result => {
                const new2 = result.otpDate.toLocaleDateString('en-CA');
                const new1 = new Date().toLocaleDateString('en-CA');
                if (result.otpCount == 3) {
                    if (new2 != new1) {
                        await Guard.updateOne({
                            "_id": result._id,
                        }, {
                            $set: {
                                "otpCount": 0,
                                "otpDate": new1
                            }
                        }
                        );
                    } else {
                        return res.status(200).send({
                            message: locale.otp_limit,
                            success: false,
                            data: {},
                        });
                    }
                }
                if (result) {
                    let oldOtpCount = await Guard.findOne({ "_id": result._id });
                    let count = oldOtpCount.otpCount + 1;
                    await Guard.updateOne({
                        "_id": result._id,
                    }, {
                        $set: {
                            "otp": "1234",//otp,
                            "verifyOtp": "0",
                            "otpCount": count,
                            "otpDate": new1
                        }
                    }
                    );
                    // send msg on phone number 
                    // let message = locale.otp_text;
                    // // // req.body.subject = "M.SOCIETY: Your Account Password";
                    // message = message.replace('%OTP%', otp);
                    // await SSM.sendSsm(req,res, message)
                    return res.status(200).send({
                        message: locale.otp_send,
                        success: true,
                        data: { "otp": "1234" },//otp
                    });
                } else {
                    return res.status(200).send({
                        message: locale.user_not_added,
                        success: false,
                        data: {},
                    });
                }
            }).catch(err => {
                return res.status(400).send({
                    message: locale.user_not_exists,
                    success: false,
                    data: {},
                });
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

//forget password
exports.ForgetPassword = async (req, res) => {
    try {
        if (!req.body.phoneNumber || !req.body.newPassword || !req.body.countryCode) {
            return res.status(200).send({
                message: locale.enter_email,
                success: false,
                data: {},
            })
        };
        await Guard.findOne({ 'phoneNumber': req.body.phoneNumber, 'countryCode': req.body.countryCode }).then(async result => {
            if (result) {
                if (result.otp == req.body.otp) {
                    let password = await bcrypt.hash(req.body.newPassword, 10);
                    await Guard.updateOne({
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
                    return res.status(200).send({
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
                message: locale.user_not_exists,
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

//changes password
exports.passwordChange = async (req, res) => {
    try {
        let user = await helper.validateGuard(req);
        if (!req.body.oldPassword || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_old_new_password,
                success: false,
                data: {},
            })
        };
        await Guard.findOne({ '_id': user._id }).then(async result => {
            if (await bcrypt.compare(req.body.oldPassword, result.password)) {
                let password = await bcrypt.hash(req.body.newPassword, 10);
                await Guard.updateOne({
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
                message: locale.user_not_exists,
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

//update profile
exports.updateGuard = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let guard = await Guard.findOne({ "_id": req.body.id, "deleted": false });
        let image, idProof;
        if (req.files.length == 0) {
            if (guard.profileImage)
                image = guard.profileImage;
            if (guard.idProof)
                idProof = guard.idProof
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == 'profileImage')
                    image = req.files[i].filename;
                if (req.files[i].fieldname == 'idProof')
                    idProof = req.files[i].filename;
            }
        }
        // let password = guard.password
        // if(req.body.password){
        //     var pass = req.body.password
        //     password = await bcrypt.hash(pass, 10);
        // }
        await Guard.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                profileImage: image,
                dob: req.body.dob,
                idProof: idProof,
                // password: password
            }
        }
        ).then(async result => {
            let data = await Guard.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;

            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.valide_id_not,
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

exports.logout = async (req, res) => {
    try {
        let guard = await helper.validateGuard(req);
        if (!req.body.refresh_token || !req.body.token) {
            return res.status(200).send({
                message: locale.enter_token,
                success: false,
                data: {},
            });
        }
        //remove the old refreshToken from the refreshTokens list
        refreshTokens = refreshTokens.filter((c) => c != req.body.refresh_token);
        accessTokens = accessTokens.filter((c) => c != req.body.token);
        //Remove token from the userteminal table
        await UserToken.updateOne({
            'accountId': guard._id, userType: "guard"
        }, {
            $set: {
                refreshTokens: null,
                accessTokens: null,
                deviceToken: null,
                deviceType: null
            }
        });
        return res.status(200).send({
            message: locale.logout,
            success: true,
            data: {},
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//guard list for app
exports.Appall = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var query = { "societyId": admin.societyId, "deleted": false, "status": "active" };
        await Guard.find(query).sort({ createdDate: -1 }).then(async result => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].profileImage) {
                    result[i].profileImage = process.env.API_URL + "/" + result[i].profileImage;
                }
                if (result[i].idProof) {
                    result[i].idProof = process.env.API_URL + "/" + result[i].idProof;
                }
            }
            return res.status(200).send({
                success: true,
                message: locale.id_fetched,
                data: result,
            });
        }).catch(err => {
            return res.status(400).send({
                message: locale.user_not_exists,
                success: false,
                data: {},
            });
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

//update setting
exports.updateSetting = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        await Setting.updateOne({
            "societyId": user.societyId,
        }, {
            $set: {
                guardApproveSetting: req.body.visitorsVerification,
            }
        }
        ).then(async result => {
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: {},
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.id_not_update,
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

//fetch setting 
exports.setting = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        await Setting.findOne({
            "societyId": user.societyId,
        }).then(async result => {
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: result,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.id_not_fetched,
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

// guard api for guard end