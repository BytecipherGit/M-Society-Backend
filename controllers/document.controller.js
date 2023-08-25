const Document = require("../models/document");
const helper = require("../helpers/helper");
const User = require("../models/residentialUser");
const Token = require("../models/residentialUserToken");
const notificationTable = require("../models/notification");
const notification = require("../services/pushNotification");

exports.add = async (req, res) => {
    try {
        if (!req.body.documentName) {
            return res.status(200).send({
                message: locale.enter_documantation_name,
                success: false,
                data: {}
            })
        }
        let admin = await helper.validateSocietyAdmin(req);
        let documentImageFile;
        if (!req.file) {
            documentImageFile = "";
        } else documentImageFile = req.file.filename;
        await Document.create({
            societyAdminId: admin._id,
            societyId: admin.societyId,
            documentName: req.body.documentName,
            documentImageFile: documentImageFile,
            description: req.body.description,
            status: req.body.status,
        }).then(async data => {
            data.documentImageFile = process.env.API_URL + "/" + data.documentImageFile;

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
                        title: req.body.documentName,
                        body: req.body.description,
                        image: process.env.API_URL + "/" + documentImageFile
                    },
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
                    await notificationTable.create({ userId: userId[i]._id, payload: payload, userType: 'residentialUser', topic: 'document' });
                }
            }
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.id_created_not,
                success: false,
                data: { err }
            })
        });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: { err },
        });
    };
};

exports.update = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        let details = await Document.findOne({ "_id": req.body.id });
        let documentImageFile;
        if (!req.file) {
            documentImageFile = details.documentImageFile;
        } else documentImageFile = req.file.filename;
        await Document.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                documentName: req.body.documentName,
                documentImageFile: documentImageFile,
                description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            if (!result) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: true,
                    data: {},
                })
            }
            let data = await Document.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: true,
                    data: {},
                })
            }
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
                        title: data.documentName,
                        body: data.description,
                        image: process.env.API_URL + "/" + data.documentImageFile
                    },
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
                    await notificationTable.create({ userId: userId[i]._id, payload: payload, userType: 'residentialUser', topic: 'document' });
                }
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
        await Document.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isDeleted: true,
            }
        }
        ).then(async data => {
            if (data.modifiedCount == 0) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
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
        let admin = helper.validateSocietyAdmin(req);
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Document.findOne({ "_id": req.params.id }, { "isDeleted": false }).then(async data => {
            data.documentImageFile = process.env.API_URL + "/" + data.documentImageFile;
            return res.status(200).send({
                message: locale.id_fetched,
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

exports.all = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "societyAdminId": admin._id, "isDeleted": false, }
        await Document.find(query).sort({ createdDate: -1 }).limit(limit)
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
                    for (let step = 0; step < doc.length; step++) {
                        if (doc[step].documentImageFile) {
                            doc[step].documentImageFile = process.env.API_URL + "/" + doc[step].documentImageFile
                        }
                        if (step[i].documentName) {
                            let name = step[i].documentName;
                            step[i].documentName = await name.charAt(0).toUpperCase() + name.slice(1);
                        }
                    }
                }
                await Document.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.document_fetched,
                        data: doc,
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
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

exports.search = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { documentName: { $regex: req.query.documentName, $options: "i" }, "societyId": admin.societyId, "isDeleted": false };
        await Document.find(query).sort({ createdDate: -1 })
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.not_found,
                        data: {},
                    });
                }
                let totalData = await Document.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.document_fetched,
                    data: doc,
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

exports.allDocument = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        await Document.find({ "societyId": user.societyId, "isDeleted": false, "status": "published" }).populate("societyAdminId").sort({ createdDate: -1 }).then(async data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].documentImageFile) {
                    data[i].documentImageFile = process.env.API_URL + "/" + data[i].documentImageFile;
                }
                if (data[i].documentName) {
                    let name = data[i].documentName;
                    data[i].documentName = await name.charAt(0).toUpperCase() + name.slice(1);
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