const Document = require("../models/document");
const helper = require("../helpers/helper");

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
        }).then(data => {
            return res.status(200).send({
                message: locale.id_created,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: err.message + locale.id_created_not,
                success: false,
                data: {}
            })
        });
    } catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {},
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
                // societyAdminId: admin._id,
                // societyId: admin.societyId,
                documentName: req.body.documentName,
                documentImageFile: documentImageFile,
                description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let data = await Document.findOne({ "_id": req.body.id });
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
        let admin = helper.validateSocietyAdmin(req);
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Document.findOne({ "_id": req.params.id }, { "isDeleted": false }).then(async data => {
            return res.status(200).send({
                message: locale.id_fetched,
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
        await Document.find(query).limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: err.message + locale.something_went_wrong,
                        data: {},
                    });
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
                    });
                });
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