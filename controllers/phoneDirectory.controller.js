const PhoneBook = require("../models/phoneDirectory");
const Profession = require("../models/profession");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.name || !req.body.phoneNumber || !req.body.profession) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {}
            })
        }
        await PhoneBook.create({
            societyAdminId: admin._id,
            societyId: admin.societyId,
            name: req.body.name,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            profession: req.body.profession,
            status: req.body.status,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            countryCode: req.body.countryCode,
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

exports.update = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {}
            })
        };
        await PhoneBook.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                societyAdminId: admin._id,
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                profession: req.body.profession,
                status: req.body.status,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                countryCode: req.body.countryCode,
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
            return res.status(400).send({
                message: err.message + locale.id_not_updated,
                success: false,
                data: {}
            })
        })
    }
    catch (err) {
        return res.status(400).send({
            message:  locale.something_went_wrong,
            success: false,
            data: {}
        })
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
        await PhoneBook.updateOne({
            '_id': req.body.id,
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
            message:  locale.something_went_wrong,
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
        var query = { "societyId": admin.societyId, "isDeleted": false };
        if (admin.isAdmin == "0") {
            query = { "societyId": admin.societyId, "isDeleted": false, "status": "active" };
        }
        PhoneBook
            .find(query).sort({ createdDate: -1 })
            .skip(page * limit)
            .limit(limit)
            .exec(async (err, doc) => {
                if (err) {
                    res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                await PhoneBook.countDocuments(query).exec((count_error, count) => {
                    if (err) {
                        return res.json(count_error);
                    }
                    let page1 = count / limit;
                    let page3 = Math.ceil(page1);
                    return res.status(200).send({
                        success: true,
                        message: locale.id_fetched,
                        data: doc,
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                });
            });
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
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let data;
        data = await PhoneBook.findOne({ "_id": req.params.id, "societyId": admin.societyId, "isDeleted": false });
        if (admin.isAdmin == "0") {
            data = await PhoneBook.findOne({ "_id": req.params.id, "societyId": admin.societyId, "isDeleted": false, "status": "active" });
        }
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
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

exports.allphone = async (req, res) => {
    try {
        let admin = await helper.validateResidentialUser(req);
        var page = parseInt(req.params.page) || 0;
        var limit = parseInt(req.query.limit) || 10;
        var query = {};
        await PhoneBook.find({ "societyId": admin.societyId, "isDeleted": false,status:'active' }).then(async data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name) {
                    let name = data[i].name;
                    data[i].name = await name.charAt(0).toUpperCase() + name.slice(1);
                }
            }
            if (data) {
                return res.status(200).send({
                    message: locale.id_fetched,
                    success: true,
                    data: data,
                })
            } else {
                return res.status(200).send({
                    message: locale.is_empty,
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
        let limit = req.query.limit || 5
        let query = { profession: { $regex: req.query.profession, $options: "i" }, "societyId": admin.societyId, "isDeleted": false };
        await PhoneBook.find(query)
            .limit(limit)
            .skip(page * limit)
            .exec(async (err, data) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.not_found,
                        data: {},
                    });
                }
                let totalData = await PhoneBook.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                return res.status(200).send({
                    success: true,
                    message: locale.designation_fetched,
                    data: data,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
                });
            })
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
}

//get profession list
exports.profession = async (req, res) => {
    try {
        await Profession.find({ "status": "active", "deleted": false }).then(data => {//"userProfession": false
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