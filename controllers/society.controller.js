const Society = require("../models/society");
const societyAdmin = require("../models/residentialUser");
const Subscription = require("../models/subscription");
const societySubscription = require("../models/societySubscription");
const UserSociety = require("../models/userSociety");
const helper = require("../helpers/helper");
const bcrypt = require("bcrypt");
const sendSMS = require("../services/mail");


exports.add = async (req, res) => {
    try {
        if (!req.body.societyName || !req.body.societyAddress || !req.body.registrationNumber || !req.body.subscriptionId) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        // let image=[];
        // if (req.files==0) {
        //     image = "";
        // } else {
        //     for (let i = 0; i < req.files.length;i++){
        //         image.push(req.files[i].filename)
        //     }
        // }
        // let adminExist = await societyAdmin.findOne({ $and: [{ "phoneNumber": req.body.phoneNumber, "email": req.body.email }] });
        let adminExist = await societyAdmin.findOne({ "phoneNumber": req.body.phoneNumber, "isDeleted": false });
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
            // status: req.body.status,
            description: req.body.description
        }).then(async data => {
            let randomPassword = helper.makeUniqueAlphaNumeric(6);
            let password = await bcrypt.hash('1234', 10);//for testing
            // let password = await bcrypt.hash(randomPassword, 10);
            // let message = locale.password_text;
            let subType = await Subscription.findOne({ '_id': req.body.subscriptionId, 'status': 'active' });
            let sub = {
                societyId: data.id,
                subscriptionId: req.body.subscriptionId,
                subscriptionType: subType.name
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
                userType:"admin"
            });
            await UserSociety.create({ "societyId": data._id, "userId": admin._id, "isDefault": true });
            await Society.updateOne({ "_id": data._id },
                {
                    $set: {
                        "societyAdimId": admin._id,
                        "subscriptionId": subscription._id,
                        "subscriptionType": subType.name
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
            // message = message.replace('%PASSWORD%', randomPassword);
            // await sendSMS.sendEmail(req, res, message);
            
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
        let society = await Society.findOne({ "_id": req.body.id, "isDeleted": false });
        let image = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                image.push(req.files[i].filename)
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
                images: image
            }
        }
        ).then(async result => {
            let data = await Society.findOne({ "_id": req.body.id });
            if (data) {
                for (let i = 0; i < data.images.length; i++) {
                    data.images[i] = process.env.API_URL + "/" + data.images[i]
                }
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
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.all = async (req, res) => {
    var page = parseInt(req.query.page) || 0;
    var limit = parseInt(req.query.limit) || 5;
    let query;
    query = { "isDeleted": false };
    if (req.query.type == "Active") {
        query = { "isDeleted": false, "status": "active" };
    }
    if (req.query.type == "Inactive") {
        query = { "isDeleted": false, "status": "inactive" };
    }
    if (req.query.type == "Paid") {
        query = { "isDeleted": false, "subscriptionType": "Paid" };
    }
    if (req.query.type == "Free") {
        query = { "isDeleted": false, "subscriptionType": "Free" };
    }
    await Society
        .find(query).populate("societyAdimId").sort({ createdDate: -1 })//.populate("subscriptionId")
        .limit(limit)
        .skip(page * limit)
        .exec((err, doc) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: err.message + locale.something_went_wrong,
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
        await Society.findOne({ "_id": req.params.id, "isDeleted": false }).populate("subscriptionId").then(async data => {
            if (data) {
                let admin = await societyAdmin.find({ "societyId": data._id });
                for (let i = 0; i < data.images.length; i++) {
                    data.images[i] = process.env.API_URL + "/" + data.images[i]
                }
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

exports.search = async (req, res) => {
    try {
        let condition;
        var page = parseInt(req.body.page) || 0;
        var limit = parseInt(req.body.limit) || 5;
        let query;
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
                        message: err.message + locale.something_went_wrong,
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
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
}

exports.allFetch = async (req, res) => {
    try {
        await Society.find().populate("societyAdimId")
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
