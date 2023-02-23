const Guard = require("../models/guard");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.name || !req.body.address || !req.body.phoneNumber || !req.body.shift || !req.body.age) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        let existGuard = await Guard.findOne({ "phoneNumber": req.body.phoneNumber, "societyId": admin.societyId, "deleted": false });
        if (existGuard) {
            return res.status(400).send({
                message: locale.guard_exist,
                success: false,
                data: {},
            })
        }
        let image, idProof;
        if (req.files.length == 0) {
            image = "";
            idProof = ""
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == 'profileImage')
                    image = req.files[i].filename;
                if (req.files[i].fieldname == 'idProof')
                    idProof = req.files[i].filename;
            }
        }
        await Guard.create({
            name: req.body.name,
            address: req.body.address,
            shift: req.body.shift,
            phoneNumber: req.body.phoneNumber,
            societyId: admin.societyId,
            societyAdminId: admin._id,
            profileImage: image,
            age: req.body.age,
            idProof: idProof,
            countryCode: req.body.countryCode,
        }).then(async data => {
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;
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
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let guard = await Guard.findOne({ "_id": req.body.id, "deleted": false });
        let image, idProof;
        if (req.files.length == 0) {
            if (guard.profileImage)
                image = guard.profileImage;
            if (guard.idProof)
                idProof = guard.idProof
        } else {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == 'profileImage')
                    image = req.files[i].filename;
                if (req.files[i].fieldname == 'idProof')
                    idProof = req.files[i].filename;
            }
        }
        await Guard.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                shift: req.body.shift,
                phoneNumber: req.body.phoneNumber,
                societyId: req.body.societyId,
                societyAdminId: req.body.societyAdminId,
                status: req.body.status,
                profileImage: image,
                age: req.body.age,
                idProof: idProof,
                countryCode: req.body.countryCode,
            }
        }
        ).then(async result => {
            let data = await Guard.findOne({ "_id": req.body.id });
            if (!data) {
                return res.status(200).send({
                    message: locale.valide_id_not,
                    success: false,
                    data: {},
                })
            }
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;

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
        await Guard.destroy({ "_id": req.body.id }).then(async data => {
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
        await Guard.findOne({ "_id": req.params.id, "deleted": false }).then(async data => {
            if (data.profileImage)
                data.profileImage = process.env.API_URL + "/" + data.profileImage;
            if (data.idProof)
                data.idProof = process.env.API_URL + "/" + data.idProof;
            return res.status(200).send({
                message: locale.id_fetched,
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
};

exports.all = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "societyId": admin.societyId, "deleted": false };
        await Guard.find(query).limit(limit)
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
                        if (doc[step].profileImage) {
                            doc[step].profileImage = process.env.API_URL + "/" + doc[step].profileImage
                        }
                        if (doc[step].idProof) {
                            doc[step].idProof = process.env.API_URL + "/" + doc[step].idProof
                        }
                    }
                }
                let totalData = await Guard.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                if (!doc) {
                    return res.status(200).send({
                        success: true,
                        message: locale.is_empty,
                        data: {},
                        totalPages: page3,
                        count: count,
                        perPageData: limit
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: locale.id_fetched,
                    data: doc,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
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
