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
            if (req.body.status == 'published') {
                let userId = await User.find({ 'societyId': admin.societyId }).select('_id');
                let user = []
                userId.forEach(element => {
                    user.push(element._id)
                });
                let token = await Token.find({ 'accountId': user, deviceToken: { $ne: null } });
                let userToken = []
                token.forEach(element => {
                    userToken.push(element.deviceToken)
                });
                let payload = {
                    notification: {
                        title: req.body.title,
                        body: req.body.description,
                        image: process.env.API_URL + "/" + image
                    },
                    // topic: "NOTICE "
                }
                if (token.length > 0) {
                    req.body = {
                        // token: 'dgqwNHRJRmaulT-upub2Sb:APA91bGvDQJLKL0qG7IbwccDRWvrH0J_g2n56_Cd1FMmnGWW1qjNM2zARbXvwLhmxvy8y3tnqbUtLuGZkslkjTnfp4AJcpdRcvXAaPTN77T2gCYJX4yHiclGQD8-g5A-i63RtkbTCLFL',
                        token: userToken,
                        payload
                        // payload: {
                        //     notification: {
                        //         title: req.body.title,
                        //         body: req.body.description,
                        //         image: process.env.API_URL + "/" + image
                        //     },
                        //     // topic: "NOTICE "
                        // }
                    }
                    await notification.sendWebNotification(req);
                    // for (let i = 0; i < token.length; i++) {
                    //     await notificationTable.create({ userId: token[i].accountId, payload: req.body.payload, userType: 'residentialUser', topic: 'notice' });
                    // }
                }
                for (let i = 0; i < userId.length; i++) {
                    await notificationTable.create({ userId: userId[i]._id, payload: payload, userType: 'residentialUser', topic: 'notice' });
                }
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
            if (req.body.status == "published") {
                let userId = await User.find({ 'societyId': admin.societyId }).select('_id');
                let user = []
                userId.forEach(element => {
                    user.push(element._id)
                });
                let token = await Token.find({ 'accountId': user, deviceToken: { $ne: null } });
                let userToken = []
                token.forEach(element => {
                    userToken.push(element.deviceToken)
                });
                let payload = {
                    notification: {
                        title: data.title,
                        body: data.description,
                        image: process.env.API_URL + "/" + data.attachedFile
                    },
                    // topic: "NOTICE "
                }
                if (token.length > 0) {
                    req.body = {
                        // token: 'dgqwNHRJRmaulT-upub2Sb:APA91bGvDQJLKL0qG7IbwccDRWvrH0J_g2n56_Cd1FMmnGWW1qjNM2zARbXvwLhmxvy8y3tnqbUtLuGZkslkjTnfp4AJcpdRcvXAaPTN77T2gCYJX4yHiclGQD8-g5A-i63RtkbTCLFL',
                        token: userToken,
                        payload
                    }
                    await notification.sendWebNotification(req);
                }
                for (let i = 0; i < userId.length; i++) {
                    await notificationTable.create({ userId: userId[i]._id, payload: payload, userType: 'residentialUser', topic: 'notice' });
                }
            }
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
                await Notice.countDocuments(query).exec(async (count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    for (let i = 0; i < doc.length; i++) {
                        if (doc[i].attachedFile) {
                            doc[i].attachedFile = process.env.API_URL + "/" + doc[i].attachedFile;
                        }
                        if (doc[i].title) {
                            let name = doc[i].title;
                            doc[i].title = await name.charAt(0).toUpperCase() + name.slice(1);
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
                if (data[i].title) {
                    let name = data[i].title;
                    data[i].title = await name.charAt(0).toUpperCase() + name.slice(1);
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