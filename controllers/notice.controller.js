const Notice = require("../models/notice");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        let admin = await helper.validateResidentialUser(req);
        console.log(admin);
        if (!req.body.title || !req.body.description) {
            return res.status(400).send({
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
        if (!req.body.title || !req.body.description) {
            return res.status(400).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        await Notice.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
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
                success: true,
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
            return res.status(400).send({
                message: locale.valide_id,
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
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await Notice.findOne({ "_id": req.params.id,"isDeleted":false }).then(async data => {
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
        await Notice.find({ "isDeleted": false }).then(async data => {
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