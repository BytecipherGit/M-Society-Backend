const ServiceProvider = require("../models/serviceProvider");
const Society = require("../models/society");
const Profession = require("../models/profession");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        if (!req.body.name || !req.body.phoneNumber || !req.body.serviceName || !req.body.state || !req.body.countryCode || !req.body.country) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {}
            })
        }
        let ser = await ServiceProvider.findOne({ phoneNumber: req.body.phoneNumber });
        if (ser) {
            return res.status(200).send({
                message: locale.valide_phone,
                success: false,
                data: {}
            })
        }
        await ServiceProvider.create({
            societyId: req.body.societyId,
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            serviceName: req.body.serviceName,
            status: 'inactive',
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            countryCode: req.body.countryCode,
            state: req.body.state,
            country: req.body.country,
            city: req.body.city,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            isVerify: false
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
            message: locale.something_went_wrong,
            success: false,
            data: {}
        })
    }
};

exports.findAll = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let query = { "deleted": false };
        await ServiceProvider
            .find(query).sort({ createdDate: -1 })//.populate("subscriptionId")
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let count = await ServiceProvider.find(query);
                let page1 = count.length / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.society_fetched,
                    data: doc,
                    totalPages: page3,
                    count: count.length,
                    perPageData: limit
                });
            });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await ServiceProvider.findOne({ _id: req.params.id }).then(data => {
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {}
                })
            }
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
            message: locale.something_went_wrong,
            success: false,
            data: {}
        })
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await ServiceProvider.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                isVerify: req.body.isVerify,
                status: req.body.status
            }
        }).then(async result => {
            let data = await ServiceProvider.findOne({ "_id": req.body.id });
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
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await ServiceProvider.destroy({ "_id": req.params.id }).then(async data => {
            // if (data.modifiedCount == 0) {
            //     return res.status(200).send({
            //         message: locale.valide_id_not,
            //         success: true,
            //         data: {},
            //     })
            // } else {
            return res.status(200).send({
                message: locale.id_deleted,
                success: true,
                data: {},
            })
            // }
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

exports.allSociety = async (req, res) => {
    try {
        let query = { "isDeleted": false, "isVerify": true, city: req.params.city };
        await Society.find(query).sort({ createdDate: -1 }).then(async (data) => {
            if (data.length == 0) {
                return res.status(200).send({
                    success: true,
                    message: locale.id_fetched,
                    data: [],
                })
            }
            return res.status(200).send({
                success: true,
                message: locale.id_fetched,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.something_went_wrong,
                success: false,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//get service list
exports.serviceList = async (req, res) => {
    try {
        await Profession.find({ "status": "active", "service": true, "deleted": false }).then(data => {
            return res.status(200).send({
                message: locale.id_fetched,
                success: true,
                data: data
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.not_found,
                success: false,
                data: {},
            })
        })
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
}