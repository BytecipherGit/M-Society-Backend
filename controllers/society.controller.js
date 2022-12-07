const Society = require("../models/society");
const societyAdmin = require("../models/residentialUser");
const helper = require("../helpers/helper");
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

exports.sendInvitetion = async (req, res) => {
    let userEmail = req.body.email;
    let admin = await helper.validateResidentialUser(req);
    console.log(admin.societyUniqueId);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'darwadedaya882@gmail.com',
            pass: 'kezrnelepasxzwzk'

        }
    });
    let uniqueId = admin.societyUniqueId;
    var mailOptions = {
        from: 'darwadedaya882@gmail.com',
        to: 'darwadedaya882@gmail.com',//userEmail
        subject: 'My Society Invitation',
        // text: `'link':https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8
        //        `,  
        html: `<p>Otp: <b>${uniqueId}</b>
            <p>Link: <b>https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: locale.Invitation_not_send,
                success: false,
                data: {},
            });

        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send({
                message: locale.Invitation_send,
                success: true,
                data: {},
            });
        }
    });
};

function sendEmail(password) {
    // let data = user;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'darwadedaya882@gmail.com',
            pass: 'kezrnelepasxzwzk'

        }
    });
    var mailOptions = {
        from: 'darwadedaya882@gmail.com',
        to: 'darwadedaya882@gmail.com',//userEmail
        subject: 'My Society Invitation',
        // text: `'link':https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8
        //        `,  
        html: `<p>Otp: <b>${password}</b>
            <p>Link: <b>https://www.google.com/search?q=googlelink&oq=googlelink&aqs=chrome..69i57j0i10i512l5j0i10i30j0i10i15i30.5600j0j15&sourceid=chrome&ie=UTF-8</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.add = async (req, res) => {
    try {
        // if (!req.body.name || !req.body.address || !req.body.registrationNumber) {
        //     return res.status(200).send({
        //         message: locale.enter_all_filed,
        //         success: true,
        //         data: {},
        //     });
        // }
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
            let password = await bcrypt.hash(randomPassword, 10);
            await societyAdmin.create({
                name: req.body.adminName,
                address: req.body.adminAddress,
                phoneNumber: req.body.phoneNumber,
                password: password,
                designationId: req.body.designationId,
                houseNumber: req.body.houseNumber,
                societyUniqueId: data.uniqueId,
                societyId: data.societyId,
                is_admin: '1',
                status: req.body.status,
                // profileImage: image,
                occupation: req.body.occupation,
            });
                 sendEmail(randomPassword);
                return res.status(200).send({
                    message: locale.id_created,
                    success: true,
                    data: data,
                })
        }).catch(err => {
            return res.status(200).send({
                message: err.message + locale.id_created_not,
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

exports.updateSociety = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.valide_id,
                success: true,
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
            return res.status(200).send({
                message: err.message + locale.valide_id_not,
                success: true,
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
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await Society.deleteOne({
            '_id': req.body.id,
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
        await Society.findOne({ "_id": req.params.id }).then(async data => {
            if(data){
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else{
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

exports.all = async (req, res) => {
    try {
        await Society.find().then(async data => {
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