const ResidentialUser = require("../models/residentialUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const HouseOwner = require("../models/houseOwner");
const UserToken = require("../models/residentialUserToken");
const Society = require("../models/society");
const Designation = require("../models/designation");
const Profession = require("../models/profession");
const SSM = require("../services/msg");
const notificationTable = require("../models/notification");

//residentialUser singup
exports.singUp = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.password || !req.body.uniqueCode || !req.body.userType) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        };
        // let residentialUser = await ResidentialUser.findOne({ "phoneNumber": req.body.phoneNumber,"isDeleted":false });
        // if (residentialUser) {
        //     if (residentialUser.phoneNumber == req.body.phoneNumber) {
        //         return res.status(200).send({
        //             message: locale.valide_phone,
        //             success: false,
        //             data: {},
        //         });
        //     }
        // }
        let society = await Society.findOne({ uniqueId: req.body.uniqueCode, "isDeleted": false });
        if (!society) {
            return res.status(400).send({
                message: locale.society_UniqCode,
                success: false,
                data: {},
            });
        }
        let designation = await Designation.findOne({ name: "Residential User", "isDeleted": false });
        let password = await bcrypt.hash(req.body.password, 10);
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        await ResidentialUser.create({
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            password: password,
            designationId: designation._id,
            houseNumber: req.body.houseNumber,
            societyUniqueId: req.body.uniqueCode,
            societyId: society._id,
            // isAdmin: req.body.isAdmin,
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
            userType: req.body.userType,
            countryCode: req.body.countryCode
        }).then(async data => {
            if (req.body.userType == "rental") {
                await HouseOwner.create({
                    name: req.body.ownerName,
                    email: req.body.ownerEmail,
                    address: req.body.ownerAddress,
                    phoneNumber: req.body.ownerPhoneNumber,
                    societyId: req.body.societyId,
                    residentialUserId: data._id,
                    status: req.body.status,
                    countryCode: ownerCountryCode,
                })
            }
            data.profileImage = process.env.API_URL + "/" + data.profileImage;
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: data,
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

exports.login = async (req, res) => {
    try {
        if (!req.body.password || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_email_phone,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber, "isDeleted": false, 'countryCode': req.body.countryCode }).populate("societyId").then(async result => {
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
                        'userType': 'society-user',
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
                    if (userToken !== null) {
                        await UserToken.updateOne({
                            'accountId': result._id
                        }, token);
                    } else {
                        UserToken.create(token);
                    }
                    if (result.profileImage) {
                        result.profileImage = process.env.API_URL + result.profileImage;
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
                    message: locale.varify_otp,
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

exports.update = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        let user = await ResidentialUser.findOne({ "_id": req.body.id, });
        if (!user) {
            return res.status(400).send({
                message: locale.valide_id_not,
                success: false,
                data: {},
            })
        }
        if(req.body.stayOut==true){
            await ResidentialUser.updateOne({
                "_id": req.body.id,
            }, {
                $set: {
                    stayOut: new Date(),
                    'isDeleted': true,
                    'status': "inactive"
                }
            });
            return res.status(200).send({
                message: locale.user_exit,
                success: true,
                data: { },
            })
        }
        let image;
        if (!req.file) {
            image = user.profileImage;
        } else image = req.file.filename;
        await ResidentialUser.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                // address: req.body.address,
                status: req.body.status,
                // designationId: req.body.designationId,
                // houseNumber: req.body.houseNumber,
                // societyUniqueId: req.body.societyUniqueId,
                // societyId: req.body.societyId,
                // isAdmin: req.body.isAdmin,
                // stayIn:"",
                // stayOut: new Date,
                profileImage: image,
                occupation: req.body.occupation,
            }
        }
        ).then(async result => {
            let data = await ResidentialUser.findOne({ "_id": req.body.id });
            // if (result.modifiedCount == 0) {
            //     return res.status(200).send({
            //         message: "Please Fill New Data",//locale.id_not_update,
            //         success: false,
            //         data: {},
            //     })
            // } else {
            if (data.profileImage) {
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            }
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
            // }
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

exports.delete = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await ResidentialUser.updateOne({
            '_id': req.body.id,
        }, {
            $set: {
                'isDeleted': true,
                'status': "inactive"
            }
        }).then(async data => {
            if (data.deletedCount == 0) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: true,
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

exports.all = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "isDeleted": false, "isAdmin": { $in: [2, 0] }, "societyId": admin.societyId };
        await ResidentialUser.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit)
            .exec((err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                ResidentialUser.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.user_fetched,
                        data: doc,
                        totalPages: page3,
                        // page: page,
                        perPageData: limit,
                        count: count,
                    });
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await ResidentialUser.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {
            if (data) {
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
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

exports.passwordChange = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.oldPassword || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_old_new_password,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ '_id': user._id }).then(async result => {
            if (await bcrypt.compare(req.body.oldPassword, result.password)) {
                let password = await bcrypt.hash(req.body.newPassword, 10);
                await ResidentialUser.updateOne({
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

exports.ForgetPassword = async (req, res) => {
    try {
        if (!req.body.phoneNumber || !req.body.newPassword || !req.body.otp) {
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
                    return res.status(200).send({
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

exports.logout = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
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
        UserToken.updateOne({
            'accountId': user._id
        }, {
            $set: {
                refreshTokens: null,
                accessTokens: null
            }
        }).then((data) => {
            return res.status(200).send({
                message: locale.logout,
                success: true,
                data: {}
            });
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

exports.sendotp = async (req, res) => {
    try {
        if (!req.body.phoneNumber || !req.body.countryCode) {
            return res.status(200).send({
                message: locale.enter_phoneNumber,
                success: false,
                data: {},
            });
        }
        await ResidentialUser.findOne({ "phoneNumber": req.body.phoneNumber, 'countryCode': req.body.countryCode })
            .then(async result => {
                const new2 = result.otpDate.toLocaleDateString('en-CA');
                const new1 = new Date().toLocaleDateString('en-CA');
                if (result.otpCount == 3) {
                    if (new2 != new1) {
                        await ResidentialUser.updateOne({
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
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    let oldOtpCount = await ResidentialUser.findOne({ "_id": result._id });
                    let count = oldOtpCount.otpCount + 1;
                    await ResidentialUser.updateOne({
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
                    // req.body.subject = "M.SOCIETY: Your Account Password";
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

exports.search = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { name: { $regex: req.query.name, $options: "i" }, "societyId": admin.societyId, "isDeleted": false };
        await ResidentialUser.find(query)
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.not_found,
                        data: {},
                    });
                }
                let totalData = await ResidentialUser.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.user_fetched,
                    data: doc,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
                });
            });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.acceptInvitetion = async (req, res) => {
    try {
        let code = req.params.code;
        let society = await Society.findOne({ "uniqueId": code, "isDeleted": false });
        if (society) {
            return res.status(200).send({
                message: locale.Invitation_accept,
                success: true,
                data: {},
            })
        } else {
            return res.status(200).send({
                message: locale.Invitation_code_accept,
                success: true,
                data: {},
            })
        }
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//get profession list
exports.profession = async (req, res) => {
    try {
        await Profession.find({ "status": "active", "deleted": false }).then(data => {
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.not_found,
                success: false,
                data: {},
            })
        })
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
}

exports.getHouseOwner = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await HouseOwner.findOne({ "residentialUserId": req.params.id, "isDeleted": false }).then(data => {
            if (!data) {
                return res.status(400).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
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

exports.allApp = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var query = { "isDeleted": false, "societyId": admin.societyId };//"isAdmin": { $in: [2, 0] },
        await ResidentialUser.find(query).sort({ createdDate: -1 }).then(async result => {
            let newObj;
            let data = []
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].userType == 'rental') {
                        let ownerDetails = await HouseOwner.findOne({ "residentialUserId": result[i]._id, "isDeleted": false });
                        newObj = {
                            "_id": result[i]._id,
                            "name": result[i].name,
                            "status": result[i].status,
                            "address": result[i].address,
                            "email": result[i].email,
                            "phoneNumber": result[i].phoneNumber,
                            "countryCode": result[i].countryCode,
                            "designationId": result[i].designationId,
                            "houseNumber": result[i].houseNumber,
                            "occupation": result[i].occupation,
                            "userType": result[i].userType,
                            "ownerName": ownerDetails.name,
                            "ownerEmail": ownerDetails.email,
                            "ownerCountryCode": ownerDetails.countryCode,
                            "ownerPhoneNumber": ownerDetails.phoneNumber,
                            "ownerAddress": ownerDetails.address,
                        }
                    } else {
                        newObj = {
                            "_id": result[i]._id,
                            "name": result[i].name,
                            "status": result[i].status,
                            "address": result[i].address,
                            "email": result[i].email,
                            "phoneNumber": result[i].phoneNumber,
                            "countryCode": result[i].countryCode,
                            "designationId": result[i].designationId,
                            "houseNumber": result[i].houseNumber,
                            "occupation": result[i].occupation,
                            "userType": result[i].userType,
                            "ownerName": null,
                            "ownerEmail": null,
                            "ownerCountryCode": null,
                            "ownerPhoneNumber": null,
                            "ownerAddress": null,
                        }
                    }
                    data.push(newObj)
                }
                return res.status(200).send({
                    success: true,
                    message: locale.user_fetched,
                    data: data
                });
            } else {
                return res.status(200).send({
                    message: locale.id_not_fetched,
                    success: true,
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

exports.notificationAll = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        var query = { "deleted": false, "userId": user._id };
        await notificationTable.find(query).sort({ createdDate: -1 }).then(async result => {
            if (result) {
                return res.status(200).send({
                    success: true,
                    message: locale.user_fetched,
                    data: result
                });
            } else {
                return res.status(200).send({
                    message: locale.id_not_fetched,
                    success: true,
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