const Complaint = require("../models/complaint");
const helper = require("../helpers/helper");
const ComplaintTracks = require("../models/complaintTrack");
exports.add = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        if (!req.body.applicantName || !req.body.complainTitle) {
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
        await Complaint.create({
            societyId: user.societyId,
            residentUserId: user._id,
            complainTitle: req.body.complainTitle,
            applicantName: req.body.applicantName,
            phoneNumber: req.body.phoneNumber,
            description: req.body.description,
            attachedImage: image,
        }).then(async data => {
            let chat = [];
            let msg = {
                "description": req.body.description,
                "name": req.body.applicantName,
                "status": "new",
                "date": new Date(),
                "isAdmin": false,
                "userId": user._id,
                "attachedImage": image
            }
            chat.push(msg);
            await ComplaintTracks.create({ "complaintId": data._id, "societyId": user.societyId, "complainChat": chat });
            if (data.attachedImage)
                data.attachedImage = process.env.API_URL + "/" + data.attachedImage;
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
        let user = await helper.validateResidentialUser(req);
        if (!req.body.id) {
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
        await Complaint.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                // complainTitle: req.body.complainTitle,
                // applicantName: req.body.applicantName,
                // phoneNumber: req.body.phoneNumber,
                // description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let chat = [];
            let name;
            let oldtracke = await ComplaintTracks.findOne({ "complaintId": req.body.id });
            for (let i = 0; i < oldtracke.complainChat.length + 1; i++) {
                name = oldtracke.complainChat[0].name;
                if (i < oldtracke.complainChat.length) {
                    let msg = {
                        "description": oldtracke.complainChat[i].description,
                        "name": oldtracke.complainChat[i].name,
                        "status": oldtracke.complainChat[i].status,
                        "date": oldtracke.complainChat[i].date,
                        "isAdmin": oldtracke.complainChat[i].isAdmin,
                        "userId": oldtracke.complainChat[i].userId,
                        "attachedImage": oldtracke.complainChat[i].attachedImage
                    }
                    chat.push(msg);
                } else {
                    let msg = {
                        "description": req.body.description,
                        "name": name,
                        "status": req.body.status,
                        "date": new Date(),
                        "isAdmin": false,
                        "userId": user._id,
                        "attachedImage": image
                    }
                    chat.push(msg);
                }
            }
            await ComplaintTracks.updateOne({ "complaintId": req.body.id, }, {
                $set: {
                    "complainChat": chat
                }
            });
            let data = await Complaint.findOne({ "_id": req.body.id });
            let track = await ComplaintTracks.findOne({ "complaintId": req.body.id, });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
            if (data.attachedImage) {
                data.attachedImage = process.env.API_URL + "/" + data.attachedImage;
            }
            for (let i = 0; i < track.complainChat.length + 1; i++) {
                if (i < track.complainChat.length) {
                    if (track.complainChat[i].attachedImage)
                        track.complainChat[i].attachedImage = process.env.API_URL + "/" + track.complainChat[i].attachedImage;
                }
            }
            return res.status(200).send({
                message: locale.id_updated,
                success: true,
                data: data,
                chat: track
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
        await Complaint.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isDeleted: true
            }
        }).then(async data => {
            if (data.deletedCount == 0) {
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
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Complaint.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {
            let chate = await ComplaintTracks.findOne({ "complaintId": req.params.id });
            if (data) {
                if (data.attachedImage)
                    data.attachedImage = process.env.API_URL + "/" + data.attachedImage;
                for (let i = 0; i < chate.complainChat.length + 1; i++) {
                    if (i < chate.complainChat.length) {
                        if (chate.complainChat[i].attachedImage)
                            chate.complainChat[i].attachedImage = process.env.API_URL + "/" + chate.complainChat[i].attachedImage;
                    }
                }
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                    chat: chate
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
        var query = { "societyId": admin.societyId, "isDeleted": false };// admin.societyId
        await Complaint.find(query).limit(limit)
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
                        if (doc[step].attachedImage) {
                            doc[step].attachedImage = process.env.API_URL + "/" + doc[step].attachedImage
                        }
                    }
                }
                await Complaint.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.complain_fetched,
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

//get all complaint for residential user
exports.allcomplain = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        // if (!req.body.societyId) {
        //     return res.status(200).send({
        //         message: locale.enter_societyId,
        //         success: false,
        //         data: {},
        //     })
        // }
        await Complaint.find({ "societyId": user.societyId, "isDeleted": false }).then(async data => {
            if (!data) {
                return res.status(200).send({
                    message: locale.is_empty,
                    success: true,
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
        let page = req.query.page || 0;
        let limit = req.query.limit || 5;
        let query = { complainTitle: { $regex: req.params.complainTitle, $options: "i" }, "societyId": admin.societyId, "isDeleted": false };
        await Complaint.find(query)
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, data) => {
                if (err) {
                    return res.status(400).send({
                        message: locale.not_found,
                        success: false,
                        data: {},
                    })
                }
                let totalData = await Complaint.find(query);
                let count = totalData.length
                let page = count / limit;
                let page3 = Math.ceil(page);
                return res.status(200).send({
                    message: locale.complain_fetched,
                    success: true,
                    data: data,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
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

exports.byadmin = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let image;
        if (!req.file) {
            image = "";
        } else image = req.file.filename;
        await Complaint.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                status: req.body.status
            }
        }
        ).then(async result => {
            let chat = [];
            let oldtracke = await ComplaintTracks.findOne({ "complaintId": req.body.id });
            for (let i = 0; i < oldtracke.complainChat.length + 1; i++) {
                if (i < oldtracke.complainChat.length) {
                    let msg = {
                        "description": oldtracke.complainChat[i].description,
                        "name": oldtracke.complainChat[i].name,
                        "status": oldtracke.complainChat[i].status,
                        "date": oldtracke.complainChat[i].date,
                        "isAdmin": oldtracke.complainChat[i].isAdmin,
                        "userId": oldtracke.complainChat[i].userId,
                        "attachedImage": oldtracke.complainChat[i].attachedImage
                    }
                    chat.push(msg);
                } else {
                    let msg = {
                        "description": req.body.description,
                        "name": user.name,
                        "status": req.body.status,
                        "date": new Date(),
                        "isAdmin": true,
                        "userId": user._id,
                        "attachedImage": image
                    }
                    chat.push(msg);
                }
            }
            await ComplaintTracks.updateOne({ "complaintId": req.body.id, }, {
                $set: {
                    "complainChat": chat
                }
            });
            let data = await Complaint.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
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
}