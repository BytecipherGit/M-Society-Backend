const Notice = require("../models/notice");
const helper = require("../helpers/helper");
const notification = require("../services/pushNotification");
const User = require("../models/residentialUser");
const Token = require("../models/residentialUserToken");
const notificationTable = require("../models/notification");

exports.add = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.title || !req.body.description) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        await Notice.create({
            societyId: admin.societyId,
            societyAdminId: admin._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            attachedFile: image
        }).then(async data => {
            if (data.attachedFile) {
                data.attachedFile = process.env.API_URL + "/" + data.attachedFile;
            }
            //push notification 
            // if (req.body.status == 'published') {
            //     let userId = await User.find({ 'societyId': admin.societyId }).select('_id');
            //     let token = await Token.find({ '_id': userId });//.select('deviceToken','accountId');
            //     let userToken = []
            //     token.forEach(element => {
            //         userToken = element.deviceToken
            //     });
            //     if (token.length > 0) {
            //         req.body = {
            //             token: 'dYX4j6BqTzy4pXjszuGSjL:APA91bHrXmOwIR6fN3Dmq0Rzfw5loGHWzw9UVykMpiSh6qQMlBEPaYkBq-zBCh1YRrh0Jf-sq2h2Lkw8MfNJouLkC2o1-Yu98S5TklWZ70EqnfOSYsIA7fJ-Z3ZGmQB4xfIEP_qNuLIl',
            //             //userToken,
            //             payload: {
            //                 notification: {
            //                     title: req.body.title,
            //                     body: req.body.description,
            //                     image: process.env.image
            //                 },
            //                 topic: "NOTICE "
            //             }
            //         }
            //         await notification.sendWebNotification(req);
            //         for (let i = 0; i < token; i++) {
            //             await notificationTable.create({ userId: token[i].accountId, payload: req.body.payload, userType: 'residentialUser', topik: 'notice' });
            //         }
            //     }
            // }
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
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let notice = await Notice.findOne({ "_id": req.body.id });
        let image;
        if (!req.file) {
            image = notice.profileImage;
        } else image = req.file.filename;
        await Notice.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                societyId: admin.societyId,
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                attachedFile: image
            }
        }
        ).then(async result => {
            let data = await Notice.findOne({ "_id": req.body.id });
            if (data.attachedFile) {
                data.attachedFile = process.env.API_URL + "/" + data.attachedFile;
            }
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: true,
                    data: {},
                })
            }
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

exports.delete = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Notice.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isDeleted: true
            }
        }).then(async data => {
            return res.status(200).send({
                message: locale.id_deleted,
                success: true,
                data: {},
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Notice.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {
            if (data.attachedFile) {
                data.attachedFile = process.env.API_URL + "/" + data.attachedFile;
            }
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
        var query = { "societyAdminId": admin._id, "isDeleted": false };
        await Notice.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                await Notice.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    for (let i = 0; i < doc.length; i++) {
                        if (doc[i].attachedFile) {
                            doc[i].attachedFile = process.env.API_URL + "/" + doc[i].attachedFile;
                        }
                    }
                    return res.status(200).send({
                        success: true,
                        message: locale.notice_fetched,
                        data: doc,
                        totalPages: page3,
                        count: count,
                        perPageData: limit
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

//get notice for residential User
exports.allnotice = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        await Notice.find({ "societyId": user.societyId, "isDeleted": false, "status": "published" }).populate("societyAdminId").sort({ createdDate: -1 }).then(async data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].attachedFile) {
                    data[i].attachedFile = process.env.API_URL + "/" + data[i].attachedFile;
                }
            }
            if (data.length == 0) {
                return res.status(200).send({
                    message: locale.data_not_found,
                    success: false,
                    data: {},
                })
            } else {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            }
        }).catch(err => {
            return res.status(400).send({
                message: locale.something_went_wrong,
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
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { title: { $regex: req.query.title, $options: "i" }, "societyId": admin.societyId, "isDeleted": false };
        await Notice.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit)
            .exec(async (err, data) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let totalData = await Notice.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].attachedFile) {
                        data[i].attachedFile = process.env.API_URL + "/" + data[i].attachedFile;
                    }
                }
                return res.status(200).send({
                    success: true,
                    message: locale.notice_fetched,
                    data: data,
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