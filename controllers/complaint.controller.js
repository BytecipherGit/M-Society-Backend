const Complaint = require("../models/complaint");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        let user = await helper.validateResidentialUser(req);
        console.log(user);
        if (!req.body.applicantName || !req.body.complainTitle) {
            return res.status(400).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        await Complaint.create({
            societyId: user.societyId,
            residentUserId: user._id,
            complainTitle: req.body.complainTitle,
            applicantName: req.body.applicantName,
            phoneNumber: req.body.phoneNumber,
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
        let user = await helper.validateResidentialUser(req);
        console.log(user);
        if (!req.body.id) {
            return res.status(400).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        await Complaint.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                societyId: user.societyId,
                residentUserId: user._id,
                complainTitle: req.body.complainTitle,
                applicantName: req.body.applicantName,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                status: req.body.status,
            }
        }
        ).then(async result => {
            let data = await Complaint.findOne({ "_id": req.body.id });
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
        await Complaint.deleteOne({
            "_id": req.body.id,
        }).then(async data => {
            if (data.deletedCount == 0) {
                return res.status(400).send({
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
        if (!req.params.id) {
            return res.status(400).send({
                message: locale.valide_id,
                success: false,
                data: {},
            });
        }
        await Complaint.findOne({ "_id": req.params.id }).then(async data => {
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
        await Complaint.find().then(async data => {
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