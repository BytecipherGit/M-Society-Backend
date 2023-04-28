const ServiceProvider = require("../models/serviceProvider");
const Society = require("../models/society");
const Profession = require("../models/profession");
const ViewCount = require("../models/serviceViewCount");
const ServiceProviderSub = require("../models/serviceProviderSub");
const Subscription = require("../models/serviceSubscription");
const helper = require("../helpers/helper");
const sendEmail = require("../services/mail");
const sendSMS = require("../services/msg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.add = async (req, res) => {
    try {
        // if (!req.body.name || !req.body.phoneNumber || !req.body.serviceName || !req.body.state || !req.body.countryCode || !req.body.country||!req.body.idProofType) {
        //     return res.status(200).send({
        //         message: locale.enter_all_filed,
        //         success: false,
        //         data: {}
        //     })
        // }
        let ser = await ServiceProvider.findOne({ phoneNumber: req.body.phoneNumber });
        if (ser) {
            return res.status(200).send({
                message: locale.valide_phone,
                success: false,
                data: {}
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
        // let phone = [];
        // if (req.body.telephoneNumber) {            
        //     phone[0] = req.body.telephoneNumber
        //     if (req.body.otherNumber)
        //         phone[1] = req.body.otherNumber
        // }
        await ServiceProvider.create({
            societyId: req.body.societyId,
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            serviceName: req.body.serviceName,
            status: 'inactive',
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            countryCode: req.body.countryCode,
            state: req.body.state,
            country: req.body.country,
            city: req.body.city,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            isVerify: false,
            profileImage: image,
            idProof: idProof,
            idProofType: req.body.idProofType,
            email: req.body.email,
            otherPhoneNumber: req.body.otherPhoneNumber,
            webUrl: req.body.webUrl,
        }).then(data => {
            // send msg for registration 
            // let message = locale.service_registration;
            // req.bsody.subject = "M.SOCIETY: Register Your Service Registration Request";
            // req.body.phone = req.body.phoneNumber;
            // message = message.replace('%SERVICENAME%', req.body.serviceName);
            // await sendSMS.sendSsm(req,res, message)

            //send email for registration
            //let message = locale.service_registration;
            //message = message.replace('%SERVICENAME%', req.body.serviceName);
            //req.body.subject = "M.SOCIETY: Register Your Service Registration Request";
            // await sendSMS.sendEmail(req, res, message);

            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.id_created_not,
                success: false,
                data: {}
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {}
        })
    }
};

exports.findAll = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let query = { "deleted": false };
        if (req.query.status == "verify")
            query = { "deleted": false, isVerify: true }

        if (req.query.status == "unverify")
            query = { "deleted": false, isVerify: false }

        if (req.query.status == "active" || req.query.status == "inactive")
            query = { "deleted": false, status: req.query.status }

        await ServiceProvider
            .find(query).sort({ createdDate: -1 })//.populate("subscriptionId")
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let count = await ServiceProvider.find(query);
                let page1 = count.length / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.service_fetch,
                    data: doc,
                    totalPages: page3,
                    count: count.length,
                    perPageData: limit
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

exports.findOne = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await ServiceProvider.findOne({ _id: req.params.id }).populate("societyId").then(data => {
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {}
                })
            }
            if (data.profileImage) {
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            }
            if (data.idProof) {
                data.idProof = process.env.API_URL + "/" + data.idProof;
            }
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.id_created_not,
                success: false,
                data: {}
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {}
        })
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
        let condition;
        let user = await ServiceProvider.findOne({ "_id": req.body.id });
        // if (req.body.isVerify) {
        //     let num = Math.floor(1000 + Math.random() * 9000);
        //     var pass = "1234"//num.toString();
        //     let password = await bcrypt.hash(pass, 10);
        //     condition = {
        //         isVerify: req.body.isVerify,
        //         status: req.body.status,
        //         verifyDate: new Date(),
        //         password: password
        //     }
        // } else 
        if (req.body.societyId) {
            user.societyId.push(req.body.societyId)
            condition = {
                societyId: user.societyId,
            }
        } else {
            let image, idProof;
            if (req.files.length == 0) {
                image = user.image;
                // idProof = user.idProof
            } else {
                for (let i = 0; i < req.files.length; i++) {
                    if (req.files[i].fieldname == 'profileImage')
                        image = req.files[i].filename;
                    // if (req.files[i].fieldname == 'idProof')
                    //     idProof = req.files[i].filename;
                }
            }
            condition = {
                name: req.body.name,
                status: req.body.status,
                address: req.body.address,
                profileImage: image
            }
        }

        await ServiceProvider.updateOne({
            "_id": req.body.id,
        }, {
            $set: condition
        }).then(async result => {
            let data = await ServiceProvider.findOne({ "_id": req.body.id });
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.valide_id_not,
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
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await ServiceProvider.destroy({ "_id": req.params.id }).then(async data => {
            // if (data.modifiedCount == 0) {
            //     return res.status(200).send({
            //         message: locale.valide_id_not,
            //         success: true,
            //         data: {},
            //     })
            // } else {
            return res.status(200).send({
                message: locale.id_deleted,
                success: true,
                data: {},
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

exports.allSociety = async (req, res) => {
    try {
        let query = { "isDeleted": false, "isVerify": true, city: req.params.city };
        await Society.find(query).sort({ createdDate: -1 }).then(async (data) => {
            if (data.length == 0) {
                return res.status(200).send({
                    success: true,
                    message: locale.id_fetched,
                    data: [],
                })
            }
            return res.status(200).send({
                success: true,
                message: locale.id_fetched,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.something_went_wrong,
                success: false,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//get service list
exports.serviceList = async (req, res) => {
    try {
        await Profession.find({ "status": "active", "service": true, "deleted": false }).then(data => {
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

//Add service Name
exports.serviceAdd = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(200).send({
                message: locale.profession_name_not,
                success: false,
                data: {},
            });
        }
        let name = req.body.name;
        const firstLetterCap = await name.charAt(0).toUpperCase() + name.slice(1);
        let professionName = await Profession.findOne({ "name": firstLetterCap, "deleted": false });
        if (professionName) {
            if (professionName.name == firstLetterCap) {
                return res.status(200).send({
                    message: locale.profession_name,
                    success: false,
                    data: {},
                })
            }
        }
        await Profession.create({
            name: firstLetterCap,
            service: true
        }).then(async data => {
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
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.list = async (req, res) => {
    try {
        let query = { "deleted": false };
        await ServiceProvider
            .find().sort({ createdDate: -1 })
            .then(async (data) => {
                if (data.length == 0) {
                    return res.status(200).send({
                        success: true,
                        message: locale.service_not_fetch,
                        data: [],
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: locale.service_fetch,
                    data: data
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

exports.listUser = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        let query = { "deleted": false };
        await ServiceProvider
            .find(query).sort({ createdDate: -1 })
            .then(async (data) => {
                let result = []
                for (let i = 0; i < data.length; i++) {
                    let a = data[i].societyId
                    if (a.includes(user.societyId)) {
                        result.push(data[i])
                    }
                }
                if (data.length == 0) {
                    return res.status(200).send({
                        success: true,
                        message: locale.service_not_fetch,
                        data: [],
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: locale.service_fetch,
                    data: result
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
        if (!req.body.password || !req.body.phoneNumber || !req.body.countryCode) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        await ServiceProvider.findOne({ 'phoneNumber': req.body.phoneNumber, 'deleted': false, 'countryCode': req.body.countryCode, }).then(async result => {
            if (result == null) {
                return res.status(200).send({
                    message: locale.user_not_exists,
                    success: false,
                    data: {},
                });
            }
            if (result.isVerify == false) {
                return res.status(200).send({
                    message: locale.service_not_verify,
                    success: false,
                    data: {},
                });
            }
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    const accessToken = generateAccessToken({ user: req.body.phoneNumber });
                    const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
                    // let accessTokenExpireTime = process.env.AUTH_TOKEN_EXPIRE_TIME;
                    // accessTokenExpireTime = accessTokenExpireTime.slice(0, -1);
                    // let token = {
                    //     // 'terminalId': (req.body.terminalId) ? req.body.terminalId : null,
                    //     'deviceToken': (req.body.deviceToken) ? req.body.deviceToken : null,
                    //     'accountId': result._id,
                    //     'accessToken': accessToken,
                    //     'refreshToken': refreshToken,
                    //     'tokenExpireAt': helper.addHours(accessTokenExpireTime / 60),
                    //     'deviceType': (req.body.deviceType) ? req.body.deviceType : null,
                    //     'deviceType': (req.body.deviceType) ? req.body.deviceType : null,
                    // };
                    // let userToken = await UserToken.findOne({
                    //     'accountId': result._id
                    // });
                    // //If token/terminal already exists then update the record
                    // if (userToken) {
                    //     await UserToken.updateOne({
                    //         'accountId': result._id
                    //     }, token).then((data) => {
                    //         result.profileImage = process.env.API_URL + "/" + result.profileImage;
                    if (result.profileImage) {
                        result.profileImage = process.env.API_URL + "/" + result.profileImage;
                    }
                    if (result.idProof) {
                        result.idProof = process.env.API_URL + "/" + result.idProof;
                    }
                    return res.status(200).send({
                        success: true,
                        message: locale.login_success,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        data: result,
                        userType: "SERVICE_PROVIDER"
                        // isVerified: (user.accountVerified) ? user.accountVerified : false
                    });
                    //     });
                    // } else {
                    //    await UserToken.create(token).then((data) => {
                    //         result.profileImage = process.env.API_URL + result.profileImage;
                    //         return res.status(200).send({
                    //             success: true,
                    //             message: locale.login_success,
                    //             accessToken: accessToken,
                    //             refreshToken: refreshToken,
                    //             data: result,
                    //             // isVerified: (user.accountVerified) ? user.accountVerified : false
                    //         });
                    //     });
                    // }
                    // if (result.profileImage) {
                    //     result.profileImage = process.env.API_URL + "/" + result.profileImage;
                    // }
                    // return res.status(200).send({
                    //     message: locale.login_success,
                    //     success: true,
                    //     data: result,
                    //     accessToken: accessToken,
                    //     refreshToken: refreshToken
                    // });
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

exports.sendotp = async (req, res) => {
    try {
        if (!req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_phoneNumber,
                success: false,
                data: {},
            });
        }
        await ServiceProvider.findOne({ "phoneNumber": req.body.phoneNumber, 'countryCode': req.body.countryCode })
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
                    let oldOtpCount = await ServiceProvider.findOne({ "_id": result._id });
                    let count = oldOtpCount.otpCount + 1;
                    await ServiceProvider.updateOne({
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

exports.passwordChange = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        if (!req.body.oldPassword || !req.body.newPassword) {
            return res.status(200).send({
                message: locale.enter_old_new_password,
                success: false,
                data: {},
            })
        };
        await ServiceProvider.findOne({ '_id': user._id }).then(async result => {
            if (await bcrypt.compare(req.body.oldPassword, result.password)) {
                let password = await bcrypt.hash(req.body.newPassword, 10);
                await ServiceProvider.updateOne({
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
        await ServiceProvider.findOne({ 'phoneNumber': req.body.phoneNumber, 'countryCode': req.body.countryCode }).then(async result => {
            if (result) {
                if (result.otp == req.body.otp) {
                    let password = await bcrypt.hash(req.body.newPassword, 10);
                    await ServiceProvider.updateOne({
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
        let user = await helper.validateServiceProvider(req);
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

exports.societyList = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 10;
        let query = { "isDeleted": false, "isVerify": true, }
        if (req.query.city) {
            query = { city: req.query.city, "isDeleted": false, "isVerify": true, }
        }
        if (req.query.key == "selected") {
            query = { '_id': { $in: user.societyId }, "isDeleted": false, "isVerify": true, }
            if (req.query.city) query = { '_id': { $in: user.societyId }, city: req.query.city, "isDeleted": false, "isVerify": true, }
        }
        if (req.query.key == "deselect") {
            query = { '_id': { $nin: user.societyId }, "isDeleted": false, "isVerify": true, }
            if (req.query.city) query = { '_id': { $nin: user.societyId }, city: req.query.city, "isDeleted": false, "isVerify": true, }
        }
        await Society.find(query).sort({ createdDate: -1 })
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let data = [], obj
                let serSociety = user.societyId;
                for (let i = 0; i < doc.length; i++) {
                    if (serSociety.includes(doc[i]._id)) {
                        obj = {
                            "_id": doc[i]._id,
                            "name": doc[i].name,
                            "address": doc[i].address,
                            "city": doc[i].city,
                            "socetyService": true,
                        }
                    } else {
                        obj = {
                            "_id": doc[i]._id,
                            "name": doc[i].name,
                            "address": doc[i].address,
                            "city": doc[i].city,
                            "socetyService": false,
                        }
                    }
                    data.push(obj)
                }
                let count = await Society.find(query);
                let cityName = await Society.find({ "isDeleted": false, "isVerify": true, }).select('city');
                let newCityName = []
                for (let i = 0; i < cityName.length; i++) {
                    if (!newCityName.includes(cityName[i].city))
                        newCityName.push(cityName[i].city)
                }
                let page1 = count.length / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.service_fetch,
                    data: data,
                    totalPages: page3,
                    count: count.length,
                    perPageData: limit,
                    totalData: user.societyId.length,
                    cityName: newCityName
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

exports.viewCount = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.serviceProviderId) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let serviceProvider = await ServiceProvider.findOne({ _id: req.body.serviceProviderId });
        if (!serviceProvider) {
            return res.status(200).send({
                message: locale.service_enter_id,
                success: false,
                data: {}
            })
        }
        let view = await ViewCount.findOne({ serviceProviderId: req.body.serviceProviderId });
        if (view) {
            if (view.userId.includes(user._id)) {
                await ViewCount.updateOne({
                    serviceProviderId: req.body.serviceProviderId
                }, {
                    $set: {
                        totalCount: view.totalCount + 1
                    }
                });

            } else {
                let userId = view.userId;
                userId.push(user._id);
                await ViewCount.updateOne({
                    serviceProviderId: req.body.serviceProviderId
                }, {
                    $set: {
                        totalCount: view.totalCount + 1,
                        singleCount: view.singleCount + 1,
                        userId: userId
                    }
                });
                await ServiceProvider.updateOne({
                    _id: req.body.serviceProviderId
                }, {
                    $set: {
                        viewCount: serviceProvider.viewCount + 1
                    }
                });
            }
        } else {
            await ViewCount.create({
                serviceProviderId: req.body.serviceProviderId,
                userId: [user._id],
                singleCount: 1,
                totalCount: 1,
            });
            await ServiceProvider.updateOne({
                _id: req.body.serviceProviderId
            }, {
                $set: {
                    viewCount: 1
                }
            });
        }
        return res.status(200).send({
            message: locale.service_count_added,
            success: true,
            data: {}
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

exports.verify = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        let user = await ServiceProvider.findOne({ "_id": req.body.id });
        let num = Math.floor(1000 + Math.random() * 9000);
        var pass = "1234"//num.toString();
        let password = await bcrypt.hash(pass, 10);


        await ServiceProvider.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isVerify: req.body.isVerify,
                status: req.body.status,
                verifyDate: new Date(),
                password: password
            }
        }).then(async result => {
            let data = await ServiceProvider.findOne({ "_id": req.body.id });
            if (result) {
                let sub = await Subscription.findOne({ "deleted": false, type: 'free' });
                let startDate = new Date();
                let end = new Date();
                end.setDate(startDate.getDate() + sub.duration);
               await ServiceProviderSub.create({
                    subscriptionId: sub._id,
                    endDateOfSub: end,
                    startDateOfSub: startDate,
                  serviceProviderId: user._id
                });
                await ServiceProvider.updateOne({
                    "_id": req.body.id,
                }, {
                    $set: {
                        subscriptionId: sub._id,
                        subscriptionType: sub.type,                       
                    }
                });
            }
            // send msg for registration 
            // let message = locale.service_registration_verify;
            // req.body.subject = "M.SOCIETY: Register Your Service Registration Request Verified";
            // req.body.phone = req.body.phoneNumber;
            // message = message.replace('%PASSWORD%', num);
            // message = message.replace('%SERVICENAME%', data.serviceName);
            // await sendSMS.sendSsm(req,res, message)

            //send email for registration
            //let message = locale.service_registration;
            // message = message.replace('%PASSWORD%', num);
            // message = message.replace('%SERVICENAME%', data.serviceName);
            //req.body.subject = "M.SOCIETY: Register Your Service Registration Request Verified";
            // await sendSMS.sendEmail(req, res, message);
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.valide_id_not,
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


// exports.updateprofile = async (req, res) => {
//     try {
//         let user = await helper.validateServiceProvider(req);
//         // if (!req.body.id) {
//         //     return res.status(200).send({
//         //         message: locale.enter_id,
//         //         success: false,
//         //         data: {},
//         //     });
//         // };
//         let image, idProof;
//         if (req.files.length == 0) {
//             image = user.image;
//             // idProof = user.idProof
//         } else {
//             for (let i = 0; i < req.files.length; i++) {
//                 if (req.files[i].fieldname == 'profileImage')
//                     image = req.files[i].filename;
//                 // if (req.files[i].fieldname == 'idProof')
//                 //     idProof = req.files[i].filename;
//             }
//         }
//         await ServiceProvider.updateOne({
//             "_id": user._id,
//         }, {
//             $set: {
//                 name: req.body.name,
//                 address: req.body.address,
//                 profileImage: image
//             }
//         }).then(async result => {
//             let data = await ServiceProvider.findOne({ "_id": user._id });
//             // send msg for registration 
//             // let message = locale.service_registration_verify;
//             // req.body.subject = "M.SOCIETY: Register Your Service Registration Request Verified";
//             // req.body.phone = req.body.phoneNumber;
//             // message = message.replace('%PASSWORD%', num);
//             // message = message.replace('%SERVICENAME%', data.serviceName);
//             // await sendSMS.sendSsm(req,res, message)

//             //send email for registration
//             //let message = locale.service_registration;
//             // message = message.replace('%PASSWORD%', num);
//             // message = message.replace('%SERVICENAME%', data.serviceName);
//             //req.body.subject = "M.SOCIETY: Register Your Service Registration Request Verified";
//             // await sendSMS.sendEmail(req, res, message);

//             return res.status(200).send({
//                 message: locale.id_updated,
//                 success: true,
//                 data: data,
//             })
//         }).catch(err => {
//             return res.status(400).send({
//                 message: err.message + locale.valide_id_not,
//                 success: false,
//                 data: {},
//             })
//         })
//     }
//     catch (err) {
//         return res.status(400).send({
//             message: locale.something_went_wrong,
//             success: false,
//             data: {},
//         });
//     }
// };