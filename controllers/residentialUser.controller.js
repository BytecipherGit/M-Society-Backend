const ResidentialUser = require("../models/residentialUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const HouseOwner = require("../models/houseOwner");
const UserToken = require("../models/residentialUserToken");
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
        let residentialUser = await ResidentialUser.findOne({ "phoneNumber": req.body.phoneNumber });
        if (residentialUser){
            if (residentialUser.phoneNumber == req.body.phoneNumber) {
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
        await ResidentialUser.create({
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            password: password,
            designationId: req.body.designationId,
            houseNumber: req.body.houseNumber,
            societyUniqueId: req.body.societyUniqueId,
            societyId: req.body.societyId,
            isAdmin: '1',
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
        }).then(async data => {
            data.profileImage = process.env.SERVER_URL + data.profileImage;
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

//residentialUser singup
exports.singUp = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.password) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        };
        let residentialUser = await ResidentialUser.findOne({ "phoneNumber": req.body.phoneNumber });
        if (residentialUser){
            if (residentialUser.phoneNumber == req.body.phoneNumber) {
                return res.status(200).send({
                    message: locale.valide_phone,
                    success: false,
                    data: {},
                });
            }
        }
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
            designationId: req.body.designationId,
            houseNumber: req.body.houseNumber,
            societyUniqueId: req.body.societyUniqueId,
            societyId: req.body.societyId,
            // isAdmin: req.body.isAdmin,
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
            userType: req.body.userType
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
                })
            }
            data.profileImage = process.env.SERVER_URL + data.profileImage;
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
        if (!req.body.password || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_email_phone,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber, "isAdmin": "1" }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.phoneNumber });
            const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
            if (result.isAdmin != "1") {
                return res.status(200).send({
                    message: locale.admin_not_valide,
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
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    result.profileImage = process.env.SERVER_URL + result.profileImage;
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

exports.login = async (req, res) => {
    try {
        if (!req.body.password || !req.body.phoneNumber) {
            return res.status(200).send({
                message: locale.enter_email_phone,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.phoneNumber });
            const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
            if (result.status == "inactive") {
                return res.status(200).send({
                    message: locale.admin_status,
                    success: false,
                    data: {},
                });
            }
            if (result.verifyOtp == "1") {
                if (await bcrypt.compare(req.body.password, result.password)) {
                    let accessTokenExpireTime = process.env.AUTH_TOKEN_EXPIRE_TIME;
                    accessTokenExpireTime = accessTokenExpireTime.slice(0, -1);
                    let token = {
                        // 'terminalId': (req.body.terminalId) ? req.body.terminalId : null,
                        'deviceToken': (req.body.deviceToken) ? req.body.deviceToken : null,
                        'accountId': result._id,
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
                        UserToken.updateOne({
                            'accountId': result._id
                        }, token).then((data) => {
                            result.profileImage = process.env.SERVER_URL + result.profileImage;
                            return res.status(200).send({
                                success: true,
                                message: locale.login_success,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                data: result,
                                // isVerified: (user.accountVerified) ? user.accountVerified : false
                            });
                        });
                    } else {
                        UserToken.create(token).then((data) => {
                            result.profileImage = process.env.SERVER_URL + result.profileImage;
                            return res.status(200).send({
                                success: true,
                                message: locale.login_success,
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                                data: result,
                                // isVerified: (user.accountVerified) ? user.accountVerified : false
                            });
                        });
                    }
                } else {
                    return res.status(400).send({
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
            message: err.message + locale.something_went_wrong,
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
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        await ResidentialUser.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                status: req.body.status,
                designationId: req.body.designationId,
                houseNumber: req.body.houseNumber,
                societyUniqueId: req.body.societyUniqueId,
                societyId: req.body.societyId,
                // isAdmin: req.body.isAdmin,
                profileImage: image,
                status: req.body.status,
                occupation: req.body.occupation,
            }
        }
        ).then(async result => {
            let data = await ResidentialUser.findOne({ "_id": req.body.id });
            if (result.modifiedCount == 0) {
                return res.status(200).send({
                    message: locale.id_not_update,
                    success: false,
                    data: {},
                })
            } else {
                data.profileImage = process.env.SERVER_URL +data.profileImage;
                return res.status(200).send({
                    message: locale.id_updated,
                    success: true,
                    data: data,
                })
            }
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
            message: err.message + locale.something_went_wrong,
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
                'isDeleted': true
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
                message: err.message + locale.valide_id_not,
                success: false,
                data: {},
            })
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

exports.all = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "isDeleted": false,"isAdmin":0 };
        await ResidentialUser.find(query).limit(limit)
            .skip(page * limit)
            .exec((err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: err.message + locale.something_went_wrong,
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
                        // pageSize: doc.length,
                        count: count,
                    });
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
                data.profileImage = process.env.SERVER_URL + data.profileImage;
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
                message: err.message + locale.valide_id_not,
                success: false,
                data: {},
            })
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

exports.passwordChange = async (req, res) => {
    try {
        if (!req.body.password || !req.body.phoneNumber || !req.body.changePassword) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: false,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber }).then(async result => {
            if (await bcrypt.compare(req.body.password, result.password)) {
                let password = await bcrypt.hash(req.body.changePassword, 10);
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
            message: err.message + locale.something_went_wrong,
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
        await ResidentialUser.findOne({ "phoneNumber": req.body.phoneNumber })
            .then(async result => {
                let otp = Math.floor(1000 + Math.random() * 9000);
                if (result) {
                    await ResidentialUser.updateOne({
                        "_id": result._id,
                    }, {
                        $set: {
                            "otp": otp,
                            "verifyOtp": "0"
                        }
                    }
                    );
                    return res.status(200).send({
                        message: locale.otp_send,
                        success: true,
                        data: { "otp": otp },
                    });
                } else {
                    return res.status(400).send({
                        message: locale.enter_phoneNumber,
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

exports.search = async (req, res) => {
    try {
        await ResidentialUser.find({ name: { $regex: req.params.name, $options: "i" }, "isDeleted": false, "isAdmin": 0 }).then(data => {
            return res.status(200).send({
                message: locale.residentilaUser_fetched,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.not_found,
                success: false,
                data: {},
            })
        })
    } catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};