const PhoneBook = require("../models/phoneBook");

exports.add = async (req, res) => {
    try {
        if (!req.body.name || !req.body.phoneNumber || !req.body.profession) {
            return res.status(400).send({
                message: locale.enter_all_filed,
                success: false,
                data: {}
            })
        }
        await PhoneBook.create({
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            profession: req.body.profession,
            status: req.body.status
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
        })
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {}
        })
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).send({
                message: locale.valide_id,
                success: false,
                data: {}
            })
        }
        // console.log(req.body.id);
        await PhoneBook.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                profession: req.body.profession,
                status: req.body.status
            }
        }).then(async data => {
            if (data) {
                let result = await PhoneBook.findOne({ "_id": req.body.id });
                return res.status(200).send({
                    message: locale.id_updated,
                    success: true,
                    data: result
                })
            } else {
                return res.status(400).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {}
                })
            }
        }).catch(err => {
            console.log(err);
            return res.status(400).send({
                message: err.message + locale.id_not_updated,
                success: false,
                data: {}
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message: err.message + locale.something_went_wrong,
            success: false,
            data: {}
        })
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
        await PhoneBook.deleteOne({
            '_id': req.body.id,
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.valide_id,
                success: true,
                data: {},
            });
        }
        await PhoneBook.findOne({ "_id": req.params.id }).then(async data => {
            if (data) {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else {
                return res.status(400).send({
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