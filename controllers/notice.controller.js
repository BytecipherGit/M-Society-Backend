const Notice = require("../models/notice");
const helper = require("../helpers/helper");

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
        await Notice.create({
            societyId: admin.societyId,
            societyAdminId: admin._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        }).then(async data => {
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

exports.update = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.id ) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        await Notice.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                societyId: admin.societyId,
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let data = await Notice.findOne({ "_id": req.body.id });
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
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "societyAdminId": admin._id, "isDeleted": false };
        await Notice.find(query).limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: err.message + locale.something_went_wrong,
                        data: {},
                    });
                }
                await Notice.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.notice_fetched,
                        data: doc,
                        totalPages: page3,
                        count: count,
                    });
                });
            });
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//get notice for residential User
exports.allnotice = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        await Notice.find({ "societyId": user.societyId, "isDeleted": false }).then(async data => {
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

exports.search = async (req, res) => {
    try {
        await Notice.find({ title: { $regex: req.params.title, $options: "i" }, "isDeleted": false }).then(data => {
            return res.status(200).send({
                message: locale.notice_fetched,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.not_found,
                success: false,
                data: {},
            })
        })
    } catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};