const Maintance = require("../models/maintanace");
const MaintancePayment = require("../models/maintanacePayment");
const helper = require("../helpers/helper");
const User = require("../models/residentialUser");
const ResidentialUser = require("../models/residentialUser");
const notification = require(".././services/pushNotification");
const userToken = require("../models/residentialUserToken");
const Society = require("../models/society");
//maintance add 
exports.maintanceAdd = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.startMonth || !req.body.amount || !req.body.year) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        let main = await Maintance.find({ societyId: admin.societyId });
        if (main.length > 0) {
            for (let i = 0; i < main.length; i++) {
                await Maintance.updateOne({
                    _id: main[i]._id
                }, {
                    $set: {
                        isDefault: false,
                        endMonth: req.body.startMonth - 1
                    }
                });
            };
        }
        let main1 = await Maintance.findOne({ societyId: admin.societyId });
        // if (main1) {//
        //     if (main1.startMonth + 1 != req.body.startMonth) {
        //         return res.status(400).send({
        //             message: locale.month_valid,
        //             success: false,
        //             data: {},
        //         })
        //     }
        // }
        // if (!req.body.endMonth)
        req.body.endMonth = 11;
        await Maintance.create({
            startMonth: req.body.startMonth,
            endMonth: req.body.endMonth,
            adminId: admin._id,
            societyId: admin.societyId,
            amount: req.body.amount,
            year: req.body.year,
            isDefault: true
        }).then(async data => {
            //send push notification
            // let user = await ResidentialUser.find({ societyId: admin.societyId, status: "active", "isAdmin": 0 });
            // for (let i = 0; i < user.length; i++) {
            // let token = await userToken.findOne({ accountId: user._id });
            // req.body.message = locale.payment_msg
            // req.body.token = [token.deviceToken ]
            // notification.sendnotification(req)
            // }
            return res.status(200).send({
                message: locale.maintance_add,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.maintance_not_add,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//maintance list 
exports.maintanceList = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        await Maintance.find({ societyId: admin.societyId }).sort({ createdDate: -1 }).then(async data => {
            return res.status(200).send({
                message: locale.maintance_fetch,
                success: true,
                data: data,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.maintance_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//maintance list 
exports.maintanceget = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        let year = new Date().getFullYear();
        let result = [];
        let id;
        await Maintance.find({ societyId: admin.societyId, "year": year }).sort({ createdDate: -1 }).then(async data => {//status:"active",
            for (let i = 0; i < data.length; i++) {
                for (let j = data[i].startMonth; j <= data[i].endMonth; j++) {
                    if (data[i].isDefault == true) {
                        id = data[i]._id
                        let a = {
                            month: j,
                            amount: data[i].amount,
                            year: data[i].year
                        }
                        result.push(a)
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                for (let j = data[i].startMonth; j <= data[i].endMonth; j++) {
                    const arrayOfObject = result;
                    const checkUsername = obj => obj.month === j;
                    if (arrayOfObject.some(checkUsername)) {
                        //    console.log("object ",j);
                    } else {
                        let a = {
                            month: j,
                            amount: data[i].amount,
                            year: data[i].year
                        }
                        result.push(a)
                    }
                }
            }
            return res.status(200).send({
                message: locale.maintance_fetch,
                success: true,
                data: result,
                maintenanceId: id,
            })
        }).catch(err => {
            return res.status(400).send({
                message: locale.maintance_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//Take payment 
exports.takePayment = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.maintanceId || req.body.month.length == 0 || !req.body.userId) {
            return res.status(200).send({
                message: locale.enter_all_filed,
                success: false,
                data: {},
            });
        }
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        let user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(400).send({
                message: locale.user_not_exists,
                success: false,
                data: {},
            });
        }
        if (user.status == "inactive") {
            return res.status(400).send({
                message: locale.user_status,
                success: false,
                data: {},
            });
        }
        let maintance = await Maintance.findOne({ _id: req.body.maintanceId });
        if (!maintance) {
            return res.status(400).send({
                message: locale.maintance_valide_id_not,
                success: false,
                data: {},
            });
        }
        if (maintance.status == "inactive") {
            return res.status(400).send({
                message: locale.maintance_status_not,
                success: false,
                data: {},
            });
        };
        // let givenAmt = req.body.amount * req.body.month.length;
        // let amt = req.body.month.length * maintance.amount;
        // if (givenAmt != amt) {
        //     return res.status(200).send({
        //         message: locale.maintance_charge,
        //         success: false,
        //         data: {},
        //     });
        // };
        // for (let i = 0; i < req.body.month.length; i++) {
        //     if (req.body.month[i] > maintance.endMonth) {
        //         return res.status(200).send({
        //             message: locale.month_valid,
        //             success: false,
        //             data: {},
        //         });
        //     }
        // };
        const taxId = Math.random().toString(36).substring(5, 11).toUpperCase();
        for (let i = 0; i < req.body.month.length; i++) {
            // program to generate transactionId strings           
            await MaintancePayment.create({
                userId: req.body.userId,
                amount: req.body.month[i].amount,
                societyAdmin: admin._id,
                societyId: admin.societyId,
                month: req.body.month[i].month,
                maintanceId: req.body.maintanceId,
                year: req.body.month[i].year,//maintance.year,
                transactionId: taxId,
                adminId: admin
            });
        };
        let data = await MaintancePayment.find({ userId: req.body.userId, });
        // //send push notification
        // req.body.message = locale.payment_msg
        // let token = await userToken.findOne({ accountId: req.body.userId });
        // req.body.token = [token.deviceToken ]
        // notification.sendnotification(req)
        return res.status(200).send({
            message: locale.maintance_payment,
            success: true,
            data: data,
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//user list
exports.user = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        await ResidentialUser.find({ societyId: admin.societyId, status: "active" }).then(async data => {//"isAdmin": { $in: ["0", "2"]
            // let details = [];
            // let jaya = [];
            // for (let i = 0; i < data.length; i++) {
            //     // let payment = await MaintancePayment.find({ userId: data[i]._id }).select('amount month year');
            //     let maintance = await Maintance.findOne({ societyId: admin.societyId, adminId: admin._id, isDefault: true, deleted: false });
            //     let payment = await MaintancePayment.findOne({ userId: data[i]._id }).sort({ 'createdDate': -1 }).select('amount month year createdDate userId');
            //     let paymentMonth, paymentYear;
            //     if (!payment) {
            //         paymentMonth = new Date().getMonth()
            //         paymentYear = new Date().getFullYear()
            //     } else {
            //         paymentMonth = payment.month
            //         paymentYear = payment.year
            //     }
            //     let lastMonth1 = paymentMonth + 1
            //     let user, k, k1;
            //     let maintance1 = await Maintance.find({
            //         societyId: admin.societyId, adminId: admin._id, deleted: false
            //     });
            //     for (let i = 0; i < maintance1.length; i++) {
            //         for (let j = lastMonth1; j <= maintance1[i].endMonth; j++) {
            //             if (maintance1[i].startMonth < lastMonth1 && lastMonth1 < maintance1[i].endMonth || lastMonth1 == maintance1[i].endMonth || lastMonth1 == maintance1[i].startMonth) {
            //                 k = maintance1[i].year
            //                 k1 = maintance1[i].amount
            //                 user = {
            //                     year: maintance1[i].year,
            //                     month: lastMonth1,
            //                     amount: maintance1[i].amount,
            //                 }
            //                 lastMonth1++;
            //                 details.push(user)
            //             }
            //         }
            //     }
            //     let y = paymentMonth
            //     for (let j = 0; j <= (11 - paymentMonth); j++) {
            //         let km = parseInt(k)
            //         if (y >= 0) {
            //             user = {
            //                 year: km + 1,
            //                 month: y,
            //                 amount: k1,
            //             }
            //             y--;
            //             details.push(user);
            //         }
            //     }
            //     // }
            //     let user11 = {
            //         "user": data[i],
            //         "payment": details,
            //     }
            //     jaya.push(user11);
            //     // }
            // }
            return res.status(200).send({
                success: true,
                message: locale.user_fetched,
                data: data,
            });
        }).catch(err => {
            return res.status(400).send({
                message: locale.not_found,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//payment list 
exports.paymentHistory = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        await MaintancePayment.find({ societyId: admin.societyId }).populate("userId").sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit)
            .exec(async (err, data) => {
                if (err) {
                    return res.status(400).send({
                        message: locale.maintance_payment_not_fetch,
                        success: false,
                        data: {},
                    })
                }
                let totalData = await MaintancePayment.find({ societyId: admin.societyId });
                let count = totalData.length
                let page = count / limit;
                let page3 = Math.ceil(page);
                return res.status(200).send({
                    success: true,
                    message: locale.maintance_payment_fetch,
                    data: data,
                    totalPages: page3,
                    count: count,
                    perPageData: limit
                });
            });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//serach user from paymenthistory
exports.search = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let condition = { $or: [{ name: { $regex: req.params.key, $options: "i" } }, { houseNumber: req.params.key }], societyId: admin.societyId, "isDeleted": false, status: "active" }
        await ResidentialUser.findOne(condition)
            .then(async data => {
                if (!data) {
                    return res.status(400).send({
                        message: locale.not_found,
                        success: false,
                        data: {},
                    })
                }
                await MaintancePayment.find({ userId: data._id }).populate("userId").sort({ createdDate: -1 }).limit(limit).skip(page * limit)
                    .exec(async (err, result) => {
                        if (err) {
                            return res.status(400).send({
                                success: false,
                                message: locale.not_found,
                                data: {},
                            });
                        }
                        let totalData = await MaintancePayment.find({ userId: data._id });
                        let count = totalData.length
                        let page1 = count / limit;
                        let page3 = Math.ceil(page1);
                        return res.status(200).send({
                            success: true,
                            message: locale.user_fetched,
                            data: result,
                            totalPages: page3,
                            count: count,
                            perPageData: limit
                        });
                    })
            }).catch(err => {
                return res.status(400).send({
                    message: locale.not_found,
                    success: false,
                    data: {},
                })
            });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};

//payment history for particula user
exports.paymentHistoryForUser = async (req, res) => {
    try {
        let user = await helper.validateSocietyAdmin(req);
        await MaintancePayment.find({ userId: user._id }).sort({ createdDate: -1 }).then(async data => {
            if (data.length > 0)
                return res.status(200).send({
                    message: locale.maintance_payment_fetch,
                    success: true,
                    data: data,
                });
            else
                return res.status(200).send({
                    message: locale.maintance_payment_not_fetch,
                    success: false,
                    data: {},
                });
        }).catch(err => {
            return res.status(400).send({
                message: locale.maintance_payment_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//payment slip 
exports.paymentslip = async (req, res) => {
    try {
        await MaintancePayment.find({ transactionId: req.params.transactionId }).select("createdDate amount societyId adminId userId state city month transactionId year ").then(async data => {//.populate("societyId").populate("adminId").select('name')
            if (data) {
                let society = await Society.findOne({ "_id": data[0].societyId }).select(" name address country state city registrationNumber");
                let admin = await ResidentialUser.findOne({ "_id": data[0].adminId }).select(" name ");
                let user = await ResidentialUser.findOne({ "_id": data[0].userId }).select(" name houseNumber phoneNumber");
                let result = {
                    "societyDetails": society,
                    "adminDetails": admin,
                    "user": user,
                    "transactions": data
                }
                return res.status(200).send({
                    message: locale.payment_slip_fetch,
                    success: true,
                    data: result,
                });
            }
            else
                return res.status(200).send({
                    message: locale.payment_slip_not_fetch,
                    success: false,
                    data: {},
                });
        }).catch(err => {
            return res.status(400).send({
                message: locale.payment_slip_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

//user list
exports.userpaymentlist = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (admin.isAdmin == 0) {
            return res.status(400).send({
                success: false,
                message: locale.admin_not_valide,
                data: {},
            });
        }
        if (!req.params.id) {
            return res.status(400).send({
                success: false,
                message: "locale.admin_not_valide",
                data: {},
            });
        }
        let data = await ResidentialUser.findOne({ _id: req.params.id });
        let details = [];
        let a = [];
        let maintance = await Maintance.findOne({ societyId: admin.societyId, adminId: admin._id, isDefault: true, deleted: false });
        let payment = await MaintancePayment.findOne({ userId: req.params.id }).sort({ 'createdDate': -1 }).select('amount month year createdDate userId');
        let paymentMonth, paymentYear;
        if (!payment) {
            paymentMonth = new Date().getMonth()
            paymentYear = new Date().getFullYear()
        } else {
            paymentMonth = payment.month
            paymentYear = payment.year
        }
        let lastMonth1 = paymentMonth + 1
        let user, k, k1;
        let maintance1 = await Maintance.find({
            societyId: admin.societyId, adminId: admin._id, deleted: false
        });
        for (let i = 0; i < maintance1.length; i++) {
            for (let j = lastMonth1; j <= maintance1[i].endMonth; j++) {
                if (maintance1[i].startMonth < lastMonth1 && lastMonth1 < maintance1[i].endMonth || lastMonth1 == maintance1[i].endMonth || lastMonth1 == maintance1[i].startMonth) {
                    k = maintance1[i].year
                    k1 = maintance1[i].amount
                    user = {
                        year: maintance1[i].year,
                        month: lastMonth1,
                        amount: maintance1[i].amount,
                    }
                    lastMonth1++;
                    details.push(user)
                }
            }
        }
        let y = paymentMonth
        for (let j = 0; j <= (11 - paymentMonth); j++) {
            let km = parseInt(k)
            if (y >= 0) {
                user = {
                    year: km + 1,
                    month: y,
                    amount: k1,
                }
                y--;
                details.push(user);
            }
        }
        // let user11 = {
        //     // "user": data,
        //     "payment": details,
        // }
        // a.push(user11);
        return res.status(200).send({
            success: true,
            message: locale.user_fetched,
            data: details,
        });
    } catch (err) {
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};