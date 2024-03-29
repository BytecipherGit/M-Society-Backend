const Society = require("../models/society");
const societyAdmin = require("../models/residentialUser");
const Subscription = require("../models/subscription");
const societySubscription = require("../models/societySubscription");
const UserSociety = require("../models/userSociety");
const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const sendEmail = require("../services/mail");
const sendSMS = require("../services/msg");
const Setting = require("../models/setting");
const HouseOwner = require("../models/houseOwner");
const ReportOption = require("../models/reportOption");
const QrCode = require("../models/qrCode");
const GuardAttendance = require("../models/guardAttendance");

// const qr = require("qrcode");

exports.add = async (req, res) => {
    try {
        if (!req.body.societyName || !req.body.societyAddress || !req.body.subscriptionId) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let adminExist = await societyAdmin.findOne({ $or: [{ "phoneNumber": req.body.phoneNumber }, { "email": req.body.email }] });
        if (adminExist) {
            if (adminExist.email == req.body.email) {
                return res.status(200).send({
                    message: locale.use_email,
                    success: false,
                    data: {},
                });
            }
            if (adminExist.phoneNumber == req.body.phoneNumber) {
                return res.status(200).send({
                    message: locale.valide_phone,
                    success: false,
                    data: {},
                });
            }
        }
        let name = req.body.societyName;
        const firstLetterCap = name.charAt(0).toUpperCase() + name.slice(1);
        let randomCode = helper.makeUniqueAlphaNumeric(4);
        await Society.create({
            name: firstLetterCap,
            address: req.body.societyAddress,
            registrationNumber: req.body.registrationNumber,
            uniqueId: randomCode,
            pin: req.body.pin,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            // images: image,
            // status: req.body.status,
            description: req.body.description,
            primaryColour: req.body.primaryColour,
            shadowColour: req.body.shadowColour,
        }).then(async data => {
            let randomPassword = helper.makeUniqueAlphaNumeric(6);
            let password = await bcrypt.hash('1234', 10);//for testing
            // let password = await bcrypt.hash(randomPassword, 10);
            // let message = locale.password_text;
            let subType = await Subscription.findOne({ '_id': req.body.subscriptionId, 'status': 'active' });
            var d = new Date();
            d.toLocaleString()
            d.setDate(d.getDate() + subType.duration);
            var utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);//UTC format date
            let sub = {
                societyId: data.id,
                subscriptionId: req.body.subscriptionId,
                subscriptionType: subType.type,
                startDateOfSub: new Date(),
                endDateOfSub: utc
            }
            let subscription = await societySubscription.create(sub);
            // if (!adminExist) {
            let admin = await societyAdmin.create({
                name: req.body.adminName,
                email: req.body.email,
                address: req.body.societyAddress,
                phoneNumber: req.body.phoneNumber,
                password: password,
                // designationId: req.body.designationId,
                houseNumber: req.body.houseNumber,
                societyUniqueId: data.uniqueId,
                societyId: data._id,
                isAdmin: '1',
                // status: req.body.status,
                // profileImage: image,
                occupation: req.body.occupation,
                countryCode: req.body.countryCode,
                userType: "owner"
            });
            await UserSociety.create({ "societyId": data._id, "userId": admin._id, "isDefault": true });
            await Setting.create({ "societyId": data._id });
            await HouseOwner.create({
                name: req.body.adminName,
                email: req.body.email,
                address: req.body.societyAddress,
                phoneNumber: req.body.phoneNumber,
                societyId: data._id,
                residentialUserId: admin._id,
                // status: req.body.status,
                countryCode: req.body.countryCode,
            })
            await Society.updateOne({ "_id": data._id },
                {
                    $set: {
                        "societyAdimId": admin._id,
                        "subscriptionId": subType._id,
                        "subscriptionType": subType.type
                    }
                });
            // }
            // if (adminExist) {
            //     await UserSociety.create({ "societyId": data._id, "userId": adminExist._id, "isDefault": false });
            //     await Society.updateOne({ "_id": data._id },
            //         {
            //             $set: {
            //                 "societyAdimId": adminExist._id,
            //                 "subscriptionId": subscription._id,
            //                 "subscriptionType": subType.name
            //             }
            //         });
            // }

            // Send Email to society admin
            // let message = locale.password_text;
            // req.body.subject = "M.SOCIETY: Your Account Password";
            // req.body.password = randomPassword;
            // req.body.phone = req.body.phoneNumber;
            // if (req.body.email)
            //req.body.email=req.body.email;
            // message = message.replace('%PASSWORD%', randomPassword);
            // await sendSMS.sendSsm(req, res, message);

            //for Image
            // for (let i = 0; i < data.images.length;i++){
            //     data.images[i] = process.env.API_URL + "/" + data.images[i]
            // }
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
            message: locale.something_went_wrong,
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
        let society = await Society.findOne({ "_id": req.body.id, "isDeleted": false });
        let image = [];
        let logo
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == "images")
                    image.push(req.files[i].filename)

                if (req.files[i].fieldname == "logo")
                    logo = req.files[i].filename
            }
            if (society.images.length > 0) {
                for (let i = 0; i < society.images.length; i++) {
                    image.push(society.images[i])
                }
            }
        }
        if (req.body.images) {
            image = req.body.images
        }
        if (!req.body.images && !req.files) {
            image = society.images;
        }
        await Society.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                pin: req.body.pin,
                status: req.body.status,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                description: req.body.description,
                images: image,
                primaryColour: req.body.primaryColour,
                shadowColour: req.body.shadowColour,
                logo: logo,
                buttonHoverBgColour: req.body.buttonHoverBgColour,
                fontColour: req.body.fontColour,
                buttonHoverfontColour: req.body.buttonHoverfontColour
            }
        }
        ).then(async result => {
            let data = await Society.findOne({ "_id": req.body.id });
            if (data) {
                for (let i = 0; i < data.images.length; i++) {
                    data.images[i] = process.env.API_URL + "/" + data.images[i]
                }
                if (data.logo) data.logo = process.env.API_URL + "/" + data.logo
                return res.status(200).send({
                    message: locale.id_updated,
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
                isDeleted: true,
                'status': 'inactive'
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
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.all = async (req, res) => {
    var page = parseInt(req.query.page) || 0;
    var limit = parseInt(req.query.limit) || 5;
    let query;
    query = { "isDeleted": false, "isVerify": true, };
    if (req.query.type == "Active") {
        query = { "isDeleted": false, "isVerify": true, "status": "active" };
    }
    if (req.query.type == "Inactive") {
        query = { "isDeleted": false, "isVerify": true, "status": "inactive" };
    }
    if (req.query.type == "Paid") {
        query = { "isDeleted": false, "isVerify": true, "subscriptionType": "paid" };
    }
    if (req.query.type == "Free") {
        query = { "isDeleted": false, "isVerify": true, "subscriptionType": "free" };
    }
    if (req.query.subscriptionId) {
        query = { "isDeleted": false, "isVerify": true, "subscriptionId": req.query.subscriptionId };
    }
    await Society
        .find(query).populate("societyAdimId").sort({ createdDate: -1 })//.populate("subscriptionId")
        .limit(limit)
        .skip(page * limit)
        .exec((err, doc) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: locale.something_went_wrong,
                    data: {},
                });
            }
            Society.countDocuments(query).exec((count_error, count) => {
                if (err) {
                    return res.json(count_error);
                }
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.society_fetched,
                    data: doc,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
                });
            });
        });
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
        await Society.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {//.populate("subscriptionId")
            if (data) {
                let admin = await societyAdmin.find({ "societyId": data._id, "isAdmin": '1' });
                for (let i = 0; i < data.images.length; i++) {
                    data.images[i] = process.env.API_URL + "/" + data.images[i]
                }
                if (data.logo) data.logo = process.env.API_URL + "/" + data.logo
                let sub = await societySubscription.findOne({ "societyId": req.params.id });
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: {
                        'society': data,
                        'admin': admin,
                        'societySubscription': sub
                    }
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

exports.search = async (req, res) => {
    try {
        let condition;
        var page = parseInt(req.body.page) || 0;
        var limit = parseInt(req.body.limit) || 5;
        // let query;
        condition = { $or: [{ name: { $regex: req.body.name, $options: "i" } }, { city: { $regex: req.body.name, $options: "i" } }], "isDeleted": false }
        if (req.body.type == "Active") {
            condition = { $or: [{ name: { $regex: req.body.name, $options: "i" } }, { city: { $regex: req.body.name, $options: "i" } }], "isDeleted": false, status: "active" }
        }
        if (req.body.type == "Inactive") {
            condition = { $or: [{ name: { $regex: req.body.name, $options: "i" } }, { city: { $regex: req.body.name, $options: "i" } }], "isDeleted": false, status: "inactive" }
        }
        if (req.body.type == "Free") {
            condition = { $or: [{ name: { $regex: req.body.name, $options: "i" } }, { city: { $regex: req.body.name, $options: "i" } }], "isDeleted": false, subscriptionType: "Free" }
        }
        if (req.body.type == "Paid") {
            condition = { $or: [{ name: { $regex: req.body.name, $options: "i" } }, { city: { $regex: req.body.name, $options: "i" } }], "isDeleted": false, subscriptionType: "Paid" }
        }
        // await Society.find(condition).then(async data => {
        //     let result = [];
        //     for (let i = 0; i < data.length; i++) {
        //         let admin = await societyAdmin.findOne({ "societyId": data[i]._id, "isDeleted": false, "isAdmin": "1" });
        //         let detail = {
        //             "society": data[i],
        //             "AdminName": admin.name
        //         }
        //         result.push(detail)
        //     }
        //     return res.status(200).send({
        //         message: locale.id_fetched,
        //         success: true,
        //         data: result
        //     })
        // }).catch(err => {
        //     return res.status(400).send({
        //         message: err.message + locale.not_found,
        //         success: false,
        //         data: {},
        //     })
        // })
        await Society
            .find(condition).sort({ createdDate: -1 })//.populate("societyAdimId").populate("subscriptionId")
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, data) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                await Society.countDocuments(condition).exec(async (count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    let result = [];
                    for (let i = 0; i < data.length; i++) {
                        let admin = await societyAdmin.findOne({ "societyId": data[i]._id, "isDeleted": false, "isAdmin": "1" });
                        if (admin) {
                            if (admin.name) {
                                let detail = {
                                    "society": data[i],
                                    "AdminName": admin.name
                                }
                                result.push(detail)
                            }
                        } else {
                            let detail = {
                                "society": data[i],
                                // "AdminName": admin.name
                            }
                            result.push(detail)
                        }

                    }
                    return res.status(200).send({
                        success: true,
                        message: locale.society_fetched,
                        data: result,
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                });
            });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
}

exports.allFetch = async (req, res) => {
    try {
        await Society.find({ "isDeleted": false }).populate("societyAdimId")
            .then(data => {
                // for (let i = 0; i < data.length; i++){
                //     for (let j = 0; j < data[i].images.length; j++) {
                //         data[i].images[j] = process.env.API_URL + "/" + data[i].images[j]
                //     }
                // }
                return res.status(200).send({
                    success: true,
                    message: locale.society_fetched,
                    data: data,
                });
            }).catch(err => {
                return res.status(400).send({
                    success: false,
                    message: locale.something_went_wrong,
                    data: doc,
                });
            })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: doc,
        });
    }
};

//request add
exports.addRequist = async (req, res) => {
    try {
        // if (!req.body.societyName || !req.body.societyAddress || !req.body.registrationNumber || !req.body.subscriptionId) {
        //     return res.status(200).send({
        //         message: locale.enter_all_filed,
        //         success: false,
        //         data: {},
        //     });
        // }

        // let adminExist = await societyAdmin.findOne({ $and: [{ "phoneNumber": req.body.phoneNumber, "email": req.body.email }] });
        // let adminExist = await societyAdmin.findOne({ "phoneNumber": req.body.phoneNumber, "isDeleted": false });
        // if (adminExist) {
        //     return res.status(200).send({
        //         message: locale.use_email,
        //         success: false,
        //         data: {},
        //     });
        // }
        let name = req.body.societyName;
        const firstLetterCap = name.charAt(0).toUpperCase() + name.slice(1);
        let randomCode = helper.makeUniqueAlphaNumeric(4);
        await Society.create({
            name: firstLetterCap,
            address: req.body.societyAddress,
            registrationNumber: req.body.registrationNumber,
            uniqueId: randomCode,
            pin: req.body.pin,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            // images: image,
            status: "inactive",
            isVerify: false,
            verifyDate: null,
            // description: req.body.description
        }).then(async data => {
            // let randomPassword = helper.makeUniqueAlphaNumeric(6);
            let password = await bcrypt.hash(req.body.password, 10);//for testing

            // send msg for registration
            // let message = locale.society_registration;
            // req.bsody.subject = "M.SOCIETY: Register your Society Registration Request";
            // req.body.phone = req.body.phoneNumber;
            // message = message.replace('%SOCIETYNAME%', firstLetterCap);
            // await sendSMS.sendSsm(req, res, message);

            //send email for registration

            // let subType = await Subscription.findOne({ 'name': "Free", 'status': 'active' });
            // let sub = {
            //     societyId: data.id,
            //     subscriptionId: subType._id,
            //     subscriptionType: subType.name
            // }
            // let subscription = await societySubscription.create(sub);
            // if (!adminExist) {
            let admin = await societyAdmin.create({
                name: req.body.adminName,
                email: req.body.email,
                address: req.body.societyAddress,
                phoneNumber: req.body.phoneNumber,
                password: password,
                // designationId: req.body.designationId,
                houseNumber: req.body.houseNumber,
                societyUniqueId: data.uniqueId,
                societyId: data._id,
                isAdmin: '1',
                status: "inactive",
                // profileImage: image,
                occupation: req.body.occupation,
                countryCode: req.body.countryCode,
                userType: "owner"
            });
            await UserSociety.create({ "societyId": data._id, "userId": admin._id, "isDefault": true });
            await Setting.create({ "societyId": data._id });
            await Society.updateOne({ "_id": data._id },
                {
                    $set: {
                        "societyAdimId": admin._id,
                        // "subscriptionId": subscription._id,
                        // "subscriptionType": subType.name
                    }
                });
            // }
            // if (adminExist) {
            //     await UserSociety.create({ "societyId": data._id, "userId": adminExist._id, "isDefault": false });
            //     await Society.updateOne({ "_id": data._id },
            //         {
            //             $set: {
            //                 "societyAdimId": adminExist._id,
            //                 "subscriptionId": subscription._id,
            //                 "subscriptionType": subType.name
            //             }
            //         });
            // }
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
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//fetch all request
exports.allrequest = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let query = { "isDeleted": false, "isVerify": false };
        await Society
            .find(query).populate("societyAdimId").sort({ createdDate: -1 })//.populate("subscriptionId")
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
                let count = await Society.find(query);
                let page1 = count.length / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.society_fetched,
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

//request verify
exports.updateSocietyRequest = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        let data = await Society.findOne({ "_id": req.body.id });
        let subId = await Subscription.findOne({ 'type': "free", 'status': 'active' });
        // let subType = await Subscription.findOne({ 'name': req.body.subscriptionId, 'status': 'active' });
        var d = new Date();
        d.toLocaleString()
        d.setDate(d.getDate() + subId.duration);
        var utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);//UTC format date
        let sub = {
            societyId: data.id,
            subscriptionId: subId._id,
            subscriptionType: subId.type,
            startDateOfSub: new Date(),
            endDateOfSub: utc
        }
        let subscription = await societySubscription.create(sub);
        await Society.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isVerify: req.body.isVerify,
                status: 'active',
                verifyDate: new Date(),
                subscriptionId: subId._id,
                subscriptionType: 'free'
            }
        }).then(async result => {
            await societyAdmin.updateOne({
                "_id": data.societyAdimId,
            }, {
                $set: {
                    status: 'active'
                }
            });

            // let data = await Society.findOne({ "_id": req.body.id });
            // send msg for registration
            // let message = locale.society_registration_verify;
            // req.bsody.subject = "M.SOCIETY: Register your Society Registration Request Verified";
            // req.body.phone = req.body.phoneNumber;
            // message = message.replace('%SOCIETYNAME%', data.name);
            // await sendSMS.sendSsm(req, res, message);

            // send email for registration

            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: {},
            })
        }).catch(err => {
            console.log(err);

            return res.status(400).send({
                message: err.message + locale.valide_id_not,
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

//master data (reportOption)
exports.allreportOption = async (req, res) => {
    try {
        let query = { "isDeleted": false, "status": 'active' };
        let data = await ReportOption.find(query).sort({ createdDate: -1 });
        return res.status(200).send({
            success: true,
            message: locale.report_option,
            data: {
                'reportTitles': data
            }
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//generate new qrcode
exports.addQR = async (req, res) => {
    try {
        let society_admin = await helper.validateSocietyAdmin(req);
        let randomCode = helper.makeUniqueAlphaNumeric(6);
        let password = await bcrypt.hash(randomCode, 10);
        /*Create QR code and return the result*/
        // let qrCode = {
        //     societyId: society_admin.societyId,
        //     randomCode: randomCode
        // };
        // let strData = JSON.stringify(qrCode);
        // Print the QR code to terminal
        // qr.toString(strData, { type: 'terminal' },
        //   function (err, qrCode) {
        //     if (err) return console.log("error occurred" ,err)
        //     // Printing the generated code
        //     console.log(qrCode)
        //   })
        // qr.toDataURL(strData, async function (err, code) {
        //     if (err) {
        //         console.log(err);

        //     } else {
        // console.log(randomCode);
        // console.log(password);
        //     }
        // });
        let data = await QrCode.create({ "societyId": society_admin.societyId, "qrCode": password, "status": 'inactive' });
        // await QrCode.updateOne({ "societyId": society_admin.societyId, "status": 'active' },
        //     {
        //         $set: {
        //             "status": 'expired',
        //             "updatedDate": new Date()
        //         }
        //     });
        return res.status(200).send({
            message: locale.id_created,
            success: true,
            data: data,
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

//get qrcode
exports.getQR = async (req, res) => {
    try {
        let society_admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let data = await QrCode.find({ "societyId": society_admin.societyId, }).sort({ createdDate: -1 })//.populate("subscriptionId")
            .limit(limit)
            .skip(page * limit)
            .exec((err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                QrCode.countDocuments({ "societyId": society_admin.societyId }).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.society_fetched,
                        data: doc,
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                });
            });

        // return res.status(200).send({
        //     message: locale.id_fetched,
        //     success: true,
        //     data: data,
        // })
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//generate new qrcode
exports.updateQR = async (req, res) => {
    try {
        let society_admin = await helper.validateSocietyAdmin(req);
        // let data = await QrCode.create({ "societyId": society_admin.societyId, "qrCode": password, "status": 'inactive' });
        await QrCode.updateOne({ "societyId": society_admin.societyId, _id:req.body.id },
            {
                $set: {
                    "status": req.body.status,
                    "updatedDate": new Date()
                }
            });
        return res.status(200).send({
            message: locale.id_updated,
            success: true,
            data: {},
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

//scan qrCode
exports.ScanQR = async (req, res) => {
    try {
        let guard = await helper.validateGuard(req);
        let data1 = await QrCode.findOne({ "societyId": guard.societyId, "status": 'active' });
        if (data1.qrCode == req.body.qr) {
            let date = new Date().toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                // weekday: "long",
                // hour: "2-digit",
                // hour12: true,
                // minute: "2-digit",
                // second: "2-digit",
            });
            let time = new Date().toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                // weekday: "long",
                hour: "2-digit",
                hour12: true,
                minute: "2-digit",
                // second: "2-digit",
            });
            if (req.body.status == 'in') {
                await GuardAttendance.create({ "societyId": guard.societyId, "guardId": guard._id, "qrCode": req.body.qr, "date": date, inTime: time, });

            } else {
                await GuardAttendance.updateOne({ "_id": req.body.id, },
                    {
                        $set: {
                            "outTime": time
                        }
                    });
            }
            // await GuardAttendance.create({ "societyId": guard.societyId, "guardId": guard._id, "qrCode": req.body.qr, "date": date, inTime: time, });

            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: {},
            })
        } else {
            return res.status(204).send({
                message: locale.id_fetched,
                success: true,
                data: {},
            })
        }
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

//guard attendence fetch
exports.getAttence = async (req, res) => {
    try {
        let guard = await helper.validateGuard(req);
        // let data1 = await QrCode.findOne({ "societyId": guard.societyId, "status": 'active' });
        // console.log(data.qrCode == req.body.qr);
        // if (data1.qrCode == req.body.qr) {
        //     let date = new Date().toLocaleString(undefined, {
        //         year: "numeric",
        //         month: "2-digit",
        //         day: "2-digit",
        //         // weekday: "long",
        //         // hour: "2-digit",
        //         // hour12: true,
        //         // minute: "2-digit",
        //         // second: "2-digit",
        //     });
        let data = await GuardAttendance.find({ "societyId": guard.societyId, "guardId": guard._id, });
        return res.status(200).send({
            message: locale.id_fetched,
            success: true,
            data: data,
        })
        // } else {
        //     return res.status(204).send({
        //         message: locale.id_fetched,
        //         success: true,
        //         data: {},
        //     })
        // }
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