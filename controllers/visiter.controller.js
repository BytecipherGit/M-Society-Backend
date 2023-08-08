const MasterVisitor = require("../models/masterVisiter");
const Visitor = require("../models/visiter");
const helper = require("../helpers/helper");
const ResidentialUser = require("../models/residentialUser");
const notification = require("../services/pushNotification");
const Token = require("../models/residentialUserToken");
const notificationTable = require("../models/notification");

// visitor fetch for admin
exports.get = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "societyId": user.societyId, "deleted": false };//date: new Date().toLocaleDateString('en-CA')
        let startDate = req.query.fromDate
        let endDate = req.query.toDate
        if (req.query.fromDate && req.query.toDate)
            query = {
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString(),
                }, "societyId": user.societyId, "deleted": false
            }
        await Visitor.find(query).sort({ createdDate: -1 })
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
                if (doc.length > 0) {
                    for (let i = 0; i < doc.length; i++) {
                        if (doc[i].image) {
                            doc[i].image = process.env.API_URL + "/" + doc[i].image
                        }
                    }
                }
                let totalData = await Visitor.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                if (doc.length == 0) {
                    return res.status(200).send({
                        success: true,
                        message: locale.is_empty,
                        data: [],
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                }
                for (let i = 0; i < doc.length; i++) {
                    if (doc[i].image)
                        doc[i].image = process.env.API_URL + "/" + doc[i].image;
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

//visitor Add App
exports.add = async (req, res) => {
    try {
        let user = await helper.validateGuard(req);
        if (!req.body.name || !req.body.phoneNumber || !req.body.reasone || !req.body.countryCode || !req.body.houseNumber) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let masterVisitor = await MasterVisitor.findOne({ "phoneNumber": req.body.phoneNumber, "societyId": user.societyId, "deleted": false });
        let houseNumberCheck = await ResidentialUser.findOne({ "houseNumber": req.body.houseNumber });
        if (!houseNumberCheck) {
            return res.status(200).send({
                message: "This House Number Not Exist",
                success: false,
                data: {},
            });
        }
        let image
        if (!req.file) {
            image = "";
        } else {
            image = req.file.filename;
        }
        if (!masterVisitor) {
            masterVisitor = await MasterVisitor.create({
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                societyId: user.societyId,
                guardId: user._id,
                countryCode: req.body.countryCode,//countyCode
                visitorCount: 0,
                image: image,
            });
        }
        let hoursMin = new Date().toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            // weekday: "long",
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
            // second: "2-digit",
        });
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        let filterDate = year + '-' + month + '-' + day
        await Visitor.create({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            societyId: user.societyId,
            guardId: user._id,
            reasone: req.body.reasone,
            countryCode: req.body.countryCode,
            masterVisitorId: masterVisitor._id,
            houseNumber: req.body.houseNumber,
            image: image,
            inTime: hoursMin,
            date: new Date(filterDate).toISOString("en-CA")
        }).then(async data => {
            let visitorId = masterVisitor.visitorId
            visitorId.push(data._id)
            let visitorCount = masterVisitor.visitorCount + 1
            await MasterVisitor.updateOne({ "_id": data.masterVisitorId }, {
                $set: {
                    visitorId: visitorId,
                    visitorCount: visitorCount,
                    image: image,
                }
            });
            if (data.image)
                data.image = process.env.API_URL + "/" + data.image;
            //send push to visit house resident
            let token = await Token.findOne({ 'accountId': houseNumberCheck._id, deviceToken: { $ne: null } });
            if (token) {
                req.body = {
                    // token: 'dgqwNHRJRmaulT-upub2Sb:APA91bGvDQJLKL0qG7IbwccDRWvrH0J_g2n56_Cd1FMmnGWW1qjNM2zARbXvwLhmxvy8y3tnqbUtLuGZkslkjTnfp4AJcpdRcvXAaPTN77T2gCYJX4yHiclGQD8-g5A-i63RtkbTCLFL',
                    token: token.deviceToken,
                    payload: {
                        notification: {
                            title: "Someone has come to visit !!",
                            body: req.body.name + 'has come to meet you, should he be allowed to meet you or not?',
                            // image: process.env.API_URL + "/" + image
                        },
                        // topic: "NOTICE "
                    }
                }
                await notification.sendWebNotification(req);
                await notificationTable.create({ userId: token.accountId, payload: req.body.payload, userType: 'residentialUser', topic: 'visitor' });
            }
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

//visitor fetch for guard App
exports.getAllVisiter = async (req, res) => {
    try {
        let user = await helper.validateGuard(req);
        var query = { "societyId": user.societyId, guardId: user._id, "deleted": false };////date: new Date().toLocaleDateString('en-CA')
        if (req.query.fromDate || req.query.toDate) {
            let startDate = req.query.fromDate
            let endDate = req.query.toDate
            query = {
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString(),
                },
                "societyId": user.societyId, "deleted": false
            }
        }
        await Visitor.find(query).sort({ createdDate: -1 }).then(async data => {
            if (data.length == 0)
                return res.status(200).send({
                    message: locale.data_not_found,
                    success: true,
                    data: {},
                })
            for (let i = 0; i < data.length; i++) {
                if (data[i].image)
                    data[i].image = process.env.API_URL + "/" + data[i].image;
            }
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data,
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

//get by phone number
exports.getbyphone = async (req, res) => {
    try {
        let guard = await helper.validateGuard(req);
        if (!req.params.phone) {
            return res.status(200).send({
                message: locale.visitor_phone,
                success: false,
                data: {},
            });
        }
        let condition = { phoneNumber: req.params.phone, societyId: guard.societyId }
        await Visitor.findOne(condition)
            .then(async data => {
                if (!data) {
                    return res.status(200).send({
                        message: locale.not_found,
                        success: true,
                        data: {},
                    })
                }
                if (data.image)
                    data.image = process.env.API_URL + "/" + data.image;
                return res.status(200).send({
                    success: true,
                    message: locale.user_fetched,
                    data: data,
                });
            }).catch(err => {
                return res.status(400).send({
                    message: locale.not_found,
                    success: false,
                    data: {},
                })
            });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//visitor out time Add App
exports.updateOut = async (req, res) => {
    try {
        let user = await helper.validateGuard(req);
        if (!req.body.visitorId) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let hoursMin = new Date().toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            // weekday: "long",
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
            // second: "2-digit",
        })
        await Visitor.updateOne({ "_id": req.body.visitorId }, {
            $set: {
                outTime: hoursMin
            }
        }).then(async data => {
            // if (data.image) let hoursMin = currDate.getHours() + ':' + currDate.getMinutes();
            //     data.image = process.env.API_URL + "/" + data.image;
            return res.status(200).send({
                message: locale.visitor_outTime,
                success: true,
                data: {},
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.visitor_outTime_not,
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

//visitor fetch for user App
exports.getAllVisiterforuser = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        var query = { "societyId": user.societyId, "deleted": false };//date: new Date().toLocaleDateString('en-CA')
        if (req.query.fromDate || req.query.toDate) {
            let startDate = req.query.fromDate
            let endDate = req.query.toDate
            query = {
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString(),
                },
                "societyId": user.societyId, "deleted": false
            }
        }
        await Visitor.find(query).sort({ createdDate: -1 }).then(async data => {
            if (data.length == 0)
                return res.status(200).send({
                    message: locale.data_not_found,
                    success: true,
                    data: {},
                })
            for (let i = 0; i < data.length; i++) {
                if (data[i].image)
                    data[i].image = process.env.API_URL + "/" + data[i].image;
            }
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data,
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

//approve visitor for visiting
exports.approve = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.visitorId||!req.body.isApprove) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Visitor.updateOne({ "_id": req.body.visitorId }, {
            $set: {
                isApprove: req.body.isApprove
            }
        }).then(async data => {
            // if (data.image) let hoursMin = currDate.getHours() + ':' + currDate.getMinutes();
            //     data.image = process.env.API_URL + "/" + data.image;
            return res.status(200).send({
                message: locale.approved,
                success: true,
                data: {},
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.not_approved,
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
