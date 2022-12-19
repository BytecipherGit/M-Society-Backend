const Society = require("../models/society");
const societyAdmin = require("../models/residentialUser");
const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const sendSMS = require("../services/mail");

exports.sendInvitetion = async (req, res) => {
    //     let admin = await helper.validateSocietyAdmin(req);
    //     let uniqueId = admin.societyUniqueId;
    //     let message = locale.invitationcode_text;
    //     message = message.replace('%InvitationCode%', uniqueId);
    //     req.body.subject = "M.SOCIETY: Your Invitation Code";
    //   await sendSMS.sendEmail(req, res, message);
    //     return res.status(200).send({
    //         message: locale.Invitation_send,
    //         success: true,
    //         data: {},
    //     })
};


exports.add = async (req, res) => {
    try {
        if (!req.body.societyName || !req.body.societyAddress || !req.body.registrationNumber) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let randomCode = helper.makeUniqueAlphaNumeric(4);
        await Society.create({
            name: req.body.societyName,
            address: req.body.societyAddress,
            registrationNumber: req.body.registrationNumber,
            uniqueId: randomCode,
            pin: req.body.pin,
            status: req.body.status,
        }).then(async data => {
            let randomPassword = helper.makeUniqueAlphaNumeric(6);
            let password = await bcrypt.hash('1234', 10);
            // let password = await bcrypt.hash(randomPassword, 10);
            let message = locale.password_text;
            let admin = await societyAdmin.create({
                name: req.body.adminName,
                address: req.body.adminAddress,
                phoneNumber: req.body.phoneNumber,
                password: password,
                designationId: req.body.designationId,
                houseNumber: req.body.houseNumber,
                societyUniqueId: data.uniqueId,
                societyId: data._id,
                isAdmin: '1',
                status: req.body.status,
                // profileImage: image,
                occupation: req.body.occupation,
            });
            await Society.updateOne({ "_id": data._id },
                {
                    $set: {
                        "societyAdimId": admin._id
                    }
                });
            // req.body.subject = "M.SOCIETY: Your Account Password";
            // message = message.replace('%PASSWORD%', randomPassword);
            // await sendSMS.sendEmail(req, res, message);
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.id_created_not,
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

exports.updateSociety = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await Society.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                pin: req.body.pin,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let data = await Society.findOne({ "_id": req.body.id });
            if (data) {
                return res.status(200).send({
                    message: locale.id_updated,
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
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: true,
                data: {},
            });
        }
        await Society.updateOne({
            '_id': req.body.id,
        }, {
            $set: {
                isDeleted: true
            }
        }).then(async data => {
            if (data.deletedCount == 0) {
                return res.status(200).send({
                    message: locale.id_not_deleted,
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
        await Society.find({ "isDeleted": false }).populate("societyAdimId").then(async data => {
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
            return res.status(400).send({
                message: err.message + locale.something_went_wrong,
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Society.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {
            if (data) {
                let admin = await societyAdmin.find({ "societyId": data._id });
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: {
                        'society': data,
                        'admin': admin
                    },
                })
            } else {
                return res.status(200).send({
                    message: locale.valide_id_not,
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