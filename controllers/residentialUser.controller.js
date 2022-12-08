const ResidentialUser = require("../models/residentialUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");
const Owner = require("../models/owner");
// socity admin singup
exports.adminsingUp = async (req, res) => {
    try {
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.password) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: true,
                data: {},
            });
        };
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
            is_admin: '1',
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
        }).then(async data => {
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.user_not_added,
                success: true,
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
                success: true,
                data: {},
            });
        };
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
            // is_admin: req.body.is_admin,
            status: req.body.status,
            profileImage: image,
            occupation: req.body.occupation,
            userType: req.body.userType
        }).then(async data => {
            if (req.body.userType == "rental") {
                await Owner.create({
                    name: req.body.ownerName,
                    email: req.body.ownerEmail,
                    address: req.body.ownerAddress,
                    phoneNumber: req.body.ownerPhoneNumber,
                    societyId: req.body.societyId,
                    residentialUserId: data._id,
                    status: req.body.status,
                })
            }
            return res.status(200).send({
                message: locale.user_added,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.user_not_added,
                success: true,
                data: {},
            })
        })
    }
    catch (err) {
        console.log(err);
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
                success: true,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber, "is_admin": "1" }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.phoneNumber });
            const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
            if (result.is_admin != "1") {
                return res.status(200).send({
                    message: locale.admin_not_valide,
                    success: true,
                    data: {},
                });
            }
            // else {
            //     return res.status(200).send({
            //         message: "your not valide society admin!",
            //         success: true,
            //         data: {},
            //     });
            // }
            if (await bcrypt.compare(req.body.password, result.password)) {
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
            console.log(err);
            return res.status(200).send({
                message: locale.user_not_exists,
                success: true,
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
                success: true,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber }).then(async result => {
            const accessToken = generateAccessToken({ user: req.body.phoneNumber });
            const refreshToken = generateRefreshToken({ user: req.body.phoneNumber });
            if (await bcrypt.compare(req.body.password, result.password)) {
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
                message: locale.user_not_exists,
                success: true,
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
                message: locale.valide_id,
                success: true,
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
                // is_admin: req.body.is_admin,
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
                    success: true,
                    data: {},
                })
            } else {
                return res.status(200).send({
                    message: locale.id_updated,
                    success: true,
                    data: data,
                })
            }
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.valide_id_not,
                success: true,
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
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await ResidentialUser.deleteOne({
            '_id': req.body.id,
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
            return res.status(200).send({
                message: err.message + locale.valide_id_not,
                success: true,
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await ResidentialUser.findOne({ "_id": req.params.id }).then(async data => {
            if (data) {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: true,
                    data: {},
                })
            }

        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.valide_id_not,
                success: true,
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
        console.log("421", req.body);
        if (!req.body.password || !req.body.phoneNumber || !req.body.changePassword) {
            return res.status(200).send({
                message: locale.enter_email_password,
                success: true,
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
                    success: true,
                    data: {},
                });
            }
        }).catch(err => {
            console.log(err);
            return res.status(200).send({
                message: err.message + locale.user_not_exists,
                success: true,
                data: {},
            })
        });
    }
    catch (err) {
        console.log(err);
        return res.status(200).send({
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
                success: true,
                data: {},
            })
        };
        await ResidentialUser.findOne({ 'phoneNumber': req.body.phoneNumber }).then(async result => {
            if (result) {
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

exports.all = async (req, res) => {
    try {
        await ResidentialUser.find().then(async data => {
            if (data) {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else {
                return res.status(200).send({
                    message: locale.is_empty,
                    success: true,
                    data: {},
                })
            }

        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.something_went_wrong,
                success: true,
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