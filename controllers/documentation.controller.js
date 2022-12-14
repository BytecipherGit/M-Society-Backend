const Documentation = require("../models/documentation");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        if (!req.body.documentName) {
            return res.status(400).send({
                message: locale.enter_documantation_name,
                success: false,
                data: {}
            })
        }
        let admin = await helper.validateSocietyAdmin(req);
        let documentfile;
        if (!req.file) {
            documentfile = "";
        } else documentfile = req.file.filename;
        await Documentation.create({
            societyAdminId: admin._id,
            societyId: admin.societyId,
            documentName: req.body.documentName,
            documentImageFile: documentfile,
            description: req.body.description,
            status: req.body.status,
        }).then(data => {
            return res.status(200).send({
                message: locale.id_created,
                success: "",
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
            return res.status(400).send({
                message: locale.valide_id,
                success: false,
                data: {},
            });
        };
        if (!req.file) {
            documentfile = "";
        } else documentfile = req.file.filename;
        await Documentation.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                societyAdminId: admin._id,
                societyId: admin.societyId,
                documentName: req.body.documentName,
                documentImageFile: documentfile,
                description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let data = await Documentation.findOne({ "_id": req.body.id });
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
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await Documentation.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isDeleted: true,
            }
        }
        ).then(async data => {
            console.log(data);
            if (data.modifiedCount == 0) {
                return res.status(200).send({
                    message: locale.valide_id_not,
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

exports.get = async (req, res) => {
    try {
        let admin = helper.validateSocietyAdmin(req);
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await Documentation.findOne({ "_id": req.params.id }, { "isDeleted": false }).then(async data => {
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data,
            })
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
        let admin = helper.validateSocietyAdmin(req);
        await Documentation.find({ "societyAdminId": admin._id }, { "isDeleted": false }).then(async data => {
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