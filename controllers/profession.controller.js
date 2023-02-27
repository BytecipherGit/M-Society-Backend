const Profession = require("../models/profession");
const helper = require("../helpers/helper");

exports.add = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(200).send({
                message: locale.profession_name_not,
                success: false,
                data: {},
            });
        }
        let name = req.body.name;
        const firstLetterCap = await name.charAt(0).toUpperCase() + name.slice(1);
        console.log(firstLetterCap);
        let professionName = await Profession.findOne({ "name": firstLetterCap, "deleted": false });
        if (professionName) {
            if (professionName.name == firstLetterCap) {
                return res.status(200).send({
                    message: locale.profession_name,
                    success: false,
                    data: {},
                })
            }
        }
        await Profession.create({
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

exports.updateProfession = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        };
        await Profession.updateOne({
            "_id": req.body.id,
        }, {
            $set: {
                name: req.body.name,
                status: req.body.status
            }
        }
        ).then(async result => {
            let data = await Profession.findOne({ "_id": req.body.id });
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
        await Profession.destroy({
            "_id": req.body.id,
        }).then(async data => {
            return res.status(200).send({
                message: locale.id_deleted,
                success: true,
                data: {},
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

exports.get = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        await Profession.findOne({ "_id": req.params.id, "deleted": false }).then(async data => {
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

// exports.all = async (req, res) => {
//     try {
//         await Profession.find({ "deleted": false }).then(async data => {
//             if (data.length==0) {
//                 return res.status(200).send({
//                     message: locale.is_empty,
//                     success: false,
//                     data: {},
//                 })
//             } else {
//                 return res.status(200).send({
//                     message: locale.id_fetched,
//                     success: true,
//                     data: data,
//                 })
//             }
//         }).catch(err => {
//             return res.status(400).send({
//                 message: locale.something_went_wrong,
//                 success: false,
//                 data: {},
//             })
//         })
//     }
//     catch (err) {
//         return res.status(400).send({
//             message: locale.something_went_wrong,
//             success: false,
//             data: {},
//         });
//     }
// };

exports.getpagination = async (req, res) => {
    try {
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { "deleted": false };
        await Profession.find(query)
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
                let data = await Profession.find(query);
                let count = data.length
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
    }
    catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

// exports.search = async (req, res) => {
//     try {
//         var page = parseInt(req.query.page) || 0;
//         var limit = parseInt(req.query.limit) || 5;
//         var query = { name: { $regex: req.params.name, $options: "i" }, "isDeleted": false };
//         await Profession.find(query)
//             .limit(limit)
//             .skip(page * limit)
//             .exec(async (err, doc) => {
//                 if (err) {
//                     return res.status(400).send({
//                         success: false,
//                         message: locale.not_found,
//                         data: {},
//                     });
//                 }
//                 let totalData = await Profession.find(query);
//                 let count = totalData.length
//                 let page1 = count / limit;
//                 let page3 = Math.ceil(page1);
//                 return res.status(200).send({
//                     success: true,
//                     message: locale.designation_fetched,
//                     data: doc,
//                     totalPages: page3,
//                     count: count,
//                     perPageData: limit
//                 });
//             });
//     } catch (err) {
//         return res.status(400).send({
//             message: locale.something_went_wrong,
//             success: false,
//             data: {},
//         });
//     }
// };