const Maintance = require("../models/maintanace");
const MaintancePayment = require("../models/maintanacePayment");
const helper = require("../helpers/helper");
const User = require("../models/residentialUser");
const ResidentialUser = require("../models/residentialUser");
const notification = require("../services/pushNotification");
const userToken = require("../models/residentialUserToken");
const Society = require("../models/society");
const SSM = require("../services/msg");
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
        req.body.endMonth = 11;
        await Maintance.create({
            startMonth: req.body.startMonth,
            endMonth: req.body.endMonth,
            adminId: admin._id,
            societyId: admin.societyId,
            amount: req.body.amount,
            year: req.body.year,
            isDefault: true,
            description: req.body.description
        }).then(async data => {
            //send push notification
            // let user = await ResidentialUser.find({ societyId: admin.societyId, status: "active", "isAdmin": 0 });
            // for (let i = 0; i < user.length; i++) {
            // let token = await userToken.findOne({ accountId: user._id });
            // req.body.message = locale.payment_msg
            // req.body.token = [token.deviceToken ]
            // notification.sendnotification(req)
            // }
            //push notification
            // if (req.body.status == 'published') {
            //     let userId = await User.find({ 'societyId': admin.societyId }).select('_id');
            //     let token = await Token.find({ '_id': userId }).select('deviceToken');
            //     if (token.length > 0) {
            //         req.body = {
            //             token: userPushToken.pushToken,
            //             payload: {
            //                 notification: {
            //                     title: "Maintance",
            //                     body: userData.shopName + " has successfully received payment of amount " + req.body.amount
            //                 }
            //             }
            //         }
            //        await notification.sendWebNotification(req);
            //     }
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

//maintance list previouse button 
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
        let maintance = await Maintance.findOne({ societyId: admin.societyId, adminId: admin._id, isDefault: true, deleted: false }).sort({ createdDate: -1 });
        let givenMonth = req.body.month
        let givenMonth1 = 0
        let year = parseInt(req.body.year)
        let details = [];
        for (let i = 0; i <= 11; i++) {
            if (givenMonth <= 11) {
                let user = {
                    month: givenMonth,
                    maintanceId: maintance._id,
                    amount: maintance.amount,
                    year: year - 1,
                    fistTimePayment: true
                }
                givenMonth++;
                details.push(user)
            } else {
                let user = {
                    month: givenMonth1,
                    maintanceId: maintance._id,
                    amount: maintance.amount,
                    year: req.body.year,
                    fistTimePayment: true
                }
                givenMonth1++;
                details.push(user)
            }
        }
        return res.status(200).send({
            message: locale.maintance_fetch,
            success: true,
            data: details,
        })
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
        if (req.body.month.length == 0 || !req.body.userId) {
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
        let payMonth = await MaintancePayment.findOne({ userId: req.body.userId, }).sort({ 'createdDate': -1 });
        // for (let i = 0; i < req.body.month.length; i++) {
        if (payMonth) {
            if (req.body.month[0].month > payMonth.month + 1) {
                return res.status(200).send({
                    message: locale.month_valid,
                    success: false,
                    data: {},
                });
            }
        }
        // };
        // program to generate transactionId strings  
        const taxId = Math.random().toString(36).substring(5, 11).toUpperCase();
        for (let i = 0; i < req.body.month.length; i++) {
            await MaintancePayment.create({
                userId: req.body.userId,
                amount: req.body.month[i].amount,
                societyAdmin: admin._id,
                societyId: admin.societyId,
                month: req.body.month[i].month,
                maintanceId: req.body.month[i].maintanceId,
                year: req.body.month[i].year,
                transactionId: taxId,
                adminId: admin
            });
        };
        let data = await MaintancePayment.find({ userId: req.body.userId, });
        let traId = await MaintancePayment.findOne({ userId: req.body.userId, }).sort({ 'createdDate': -1 });
        // //send push notification
        // let message = locale.payment_msg
        // req.body.message = message.replace('%SlipLink%', process.env.FRANTEND_URL + "/" + "/payment-slip/" + traId.transactionId);
        // req.body.message = locale.payment_msg
        // let token = await userToken.findOne({ accountId: req.body.userId });
        // req.body.token = [token.deviceToken ]
        // notification.sendnotification(req)

        // send msg on phone number
        // let message = locale.payment_msg;
        // req.body.phoneNumber  =user.phoneNumber
        // message = message.replace('%SlipLink%', process.env.FRANTEND_URL + "/" + "/payment-slip/" + traId.transactionId);
        // await SSM.sendSsm(req,res, message)
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
        await ResidentialUser.find({ societyId: admin.societyId, status: "active", "isDeleted": false }).then(async data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].profileImage)
                    data[i].profileImage = process.env.API_URL + "/" + data[i].profileImage
                else
                    data[i].profileImage = ""
            }
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
        let condition = { $or: [{ name: { $regex: req.query.key, $options: "i" } }, { houseNumber: req.query.key }], societyId: admin.societyId, "isDeleted": false, status: "active" }
        await ResidentialUser.find(condition)
            .then(async data => {
                if (!data) {
                    return res.status(200).send({
                        message: locale.not_found,
                        success: true,
                        data: [],
                        totalPages: 0,
                        count: 0,
                        perPageData: 0
                    })
                }
                let user = []
                for (let i = 0; i < data.length; i++) {
                    user.push(data[i]._id)
                }
                await MaintancePayment.find({ userId: { $in: user } }).populate("userId").sort({ createdDate: -1 }).limit(limit).skip(page * limit)
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
        // let admin = await helper.validateSocietyAdmin(req);
        if (!req.params.id) {
            return res.status(200).send({
                message: locale.enter_id,
                success: false,
                data: {},
            });
        }
        let user = await User.findOne({ _id: req.params.id });
        await MaintancePayment.find({ userId: req.params.id }).sort({ createdDate: -1 }).then(async data => {
            let allHistory = await MaintancePayment.find({ societyId: user.societyId}).sort({ createdDate: -1 });
            // if (data.length > 0)
                return res.status(200).send({
                    message: locale.maintance_payment_fetch,
                    success: true,
                    data: data,
                    user: user,
                    allHistory: allHistory,
                });
            // else
            //     return res.status(200).send({
            //         message: locale.payment_history,
            //         success: false,
            //         data: {},
            //         user: {}
            //     });
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
                let society = await Society.findOne({ "_id": data[0].societyId }).select(" name address country state city registrationNumber images logo");
                let admin = await ResidentialUser.findOne({ "_id": data[0].adminId }).select(" name ");
                let user = await ResidentialUser.findOne({ "_id": data[0].userId }).select(" name houseNumber phoneNumber");
                let image = "";
                if (society.logo)
                    society.logo = process.env.API_URL + "/" + society.logo   
                let result = {
                    "societyDetails": society,
                    "adminDetails": admin,
                    "user": user,
                    "transactions": data,
                    "societyImage": image
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
                message: locale.enter_id,
                data: {},
            });
        }
        let details = [];
        let fistTimePayment;
        let payment = await MaintancePayment.findOne({ userId: req.params.id }).sort({ 'createdDate': -1 }).select('amount month year createdDate userId');
        let paymentMonth, paymentYear, lastMonth1;
        if (!payment) {
            paymentMonth = new Date().getMonth()
            paymentYear = new Date().getFullYear()
            fistTimePayment = true
            lastMonth1 = paymentMonth 
        } else {
            paymentMonth = payment.month
            lastMonth1 = paymentMonth +1
            paymentYear = payment.year
            fistTimePayment = false
        }
        // let lastMonth1 = paymentMonth 
        let user, k, k1, kId;
        let maintance1 = await Maintance.find({
            societyId: admin.societyId, adminId: admin._id, deleted: false
        });
        if (maintance1.length==0) {
            return res.status(200).send({
                success: false,
                message: locale.maintance_not_fetch,
                data: {},
            });
        }
        let y1 = []
        for (let i = 0; i < maintance1.length; i++) {
            y1.push(maintance1[i].year)
        }
        let p = paymentYear.toString()
        let yearCheck = y1.includes(p)
        if (yearCheck == true) {
            for (let i = 0; i < maintance1.length; i++) {
                for (let j = lastMonth1; j <= maintance1[i].endMonth; j++) {
                    if (maintance1[i].startMonth < lastMonth1 && lastMonth1 < maintance1[i].endMonth || lastMonth1 == maintance1[i].endMonth || lastMonth1 == maintance1[i].startMonth) {
                        k = maintance1[i].year
                        k1 = maintance1[i].amount
                        kId = maintance1[i]._id
                        user = {
                            year: maintance1[i].year,
                            month: lastMonth1,
                            amount: maintance1[i].amount,
                            maintanceId: maintance1[i]._id,
                            fistTimePayment: fistTimePayment
                        }
                        lastMonth1++;
                        details.push(user)
                    }
                }
            }
        } else {
            let givenMonth1 = 0
            let paymentMonth1 = parseInt(paymentMonth + 1)
            let year = parseInt(paymentYear)
            let maintance = await Maintance.findOne({ societyId: admin.societyId, adminId: admin._id, isDefault: true, deleted: false }).sort({ createdDate: -1 });
            for (let i = 0; i <= 11; i++) {
                if (paymentMonth1 <= 11) {
                    let user = {
                        month: paymentMonth1,
                        maintanceId: maintance._id,
                        amount: maintance.amount,
                        year: paymentYear,
                        fistTimePayment: false
                    }
                    paymentMonth1++;
                    details.push(user)
                } else {
                    let user = {
                        month: givenMonth1,
                        maintanceId: maintance._id,
                        amount: maintance.amount,
                        year: year + 1,
                        fistTimePayment: false
                    }
                    givenMonth1++;
                    details.push(user)
                }
            }
        }
        let y = 11 - details.length
        let z = 0
        let s = (11 - details.length);
        for (let j = 0; j <= s; j++) {
            let km = parseInt(k)
            if (y >= 0) {
                user = {
                    year: km + 1,
                    month: z,
                    amount: k1,
                    maintanceId: kId,
                    fistTimePayment: fistTimePayment
                }
                z++;
                details.push(user);
            }
        }
        return res.status(200).send({
            success: true,
            message: locale.user_fetched,
            data: details,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            message: locale.something_went_wrong,
            success: false,
            data: {},
        });
    }
};
