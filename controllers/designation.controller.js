const Designation = require("../models/designation");

exports.add = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(200).send({
                message: locale.designation_name_not,
                success: false,
                data: {},
            });
        }
        let name = req.body.name;
        const firstLetterCap = await name.charAt(0).toUpperCase() + name.slice(1);
        let designationName = await Designation.findOne({ "name": firstLetterCap, "isDeleted": false });
        if (designationName) {
            if (designationName.name == firstLetterCap) {
                return res.status(400).send({
                    message: locale.designation_name,
                    success: false,
                    data: {},
                })
            }
        }
        await Designation.create({
            name: firstLetterCap,
            status: req.body.status
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

exports.updateDesignation = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await Designation.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                status: req.body.status
            }
        }
        ).then(async result => {
            let data = await Designation.findOne({ "_id": req.body.id });
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
        await Designation.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isDeleted: true
            }
        }).then(async data => {
            if (data.deletedCount == 0) {
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
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Designation.findOne({ "_id": req.params.id, "isDeleted": false }).then(async data => {
            if (data) {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
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
        await Designation.find({ "isDeleted": false }).then(async data => {
            if (!data) {
                return res.status(200).send({
                    message: locale.is_empty,
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

exports.getpagination = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "isDeleted": false };
        Designation.find(query)
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
                Designation.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.designation_fetched,
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

exports.search = async (req, res) => {
    try {
        await Designation.find({ name: { $regex: req.params.name, $options: "i" }, "isDeleted": false }).then(data => {
            return res.status(200).send({
                message: locale.designation_fetched,
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