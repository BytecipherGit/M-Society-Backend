const Maintance = require("../models/maintanace");
const MaintancePayment = require("../models/maintanacePayment");
const helper = require("../helpers/helper");
const User = require("../models/residentialUser");
const ResidentialUser = require("../models/residentialUser");
//maintance add 
exports.maintanceAdd = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        // let main = await Maintance.find({ societyId: admin.societyId });
        // if (main.length > 0) {
        //     for (let i = 0; i < req.body.main.length; i++) {
        //         await MaintancePayment.updateOne({
        //             _id: main[i]._id
        //         }, {
        //             $set: {
        //                 isDefault: false,
        //             }
        //         });
        //     };
        // }
        await Maintance.create({
            startMonth: req.body.startMonth,
            endMonth: req.body.endMonth,
            adminId: admin._id,
            societyId: admin.societyId,
            amount: req.body.amount,
            year: req.body.year
        }).then(async data => {
            return res.status(200).send({
                message: locale.maintance_add,
                success: true,
                data: data,
            })
        }).catch(err => {
            console.log(err);
            return res.status(400).send({
                message: locale.maintance_not_add,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

//maintance list 
exports.maintanceList = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        await Maintance.find({ societyId: admin.societyId }).then(async data => {
            return res.status(200).send({
                message: locale.maintance_fetch,
                success: true,
                data: data,
            })
        }).catch(err => {
            console.log(err);
            return res.status(400).send({
                message: locale.maintance_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

//maintance list 
exports.maintanceget = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        let year = new Date().getFullYear();
        let result = [];
        await Maintance.find({ societyId: admin.societyId, "status": true, "year": year }).then(async data => {
            for (let i = 0; i < data.length; i++) {
                // if (!data[i].endMonth) {
                //     data[i].endMonth = 11;
                // }
                for (let j = data[i].startMonth; j <= data[i].endMonth; j++) {
                    if (data[i].isDefault=="active"){
                        let a = {
                            month: j,
                            amount: data[i].amount
                        }
                        result.push(a)
                    }                   
                }
            }
            // console.log(result);
            for (let i = 0; i < data.length; i++) {
                // if (!data[i].endMonth) {
                //     data[i].endMonth = 11;
                // }
                for (let j = data[i].startMonth; j <= data[i].endMonth; j++) {
                    // const array = [{ name: 'js' }, { name: 'css' }];
                    // console.log(result.some(code => JSON.stringify(code) === JSON.stringify({ month: data[i].startMonth })));
                    // result.some(code => JSON.stringify(code) === JSON.stringify({ month: data[i].startMonth }));
                    if (result.some(code => JSON.stringify(code) === JSON.stringify({ month: data[i].startMonth }))) {
                        console.log("object");
                        // let a = {
                        //     month: j,
                        //     amount: data[i].amount
                        // }
                        // result.push(a)
                    } else{
                        let a = {
                            month: j,
                            amount: data[i].amount
                        }
                        result.push(a)
                    }

                }
            }
            return res.status(200).send({
                message: locale.maintance_fetch,
                success: true,
                data: result,
            })
        }).catch(err => {
            console.log(err);
            return res.status(400).send({
                message: locale.maintance_not_fetch,
                success: false,
                data: {},
            })
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

//Take payment 
exports.takePayment = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
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
        for (let i = 0; i < req.body.month.length; i++) {
            if (req.body.month[i] > maintance.endMonth) {
                return res.status(200).send({
                    message: locale.month_valid,
                    success: false,
                    data: {},
                });
            }
        };
        for (let i = 0; i < req.body.month.length; i++) {
            await MaintancePayment.create({
                userId: req.body.userId,
                amount: req.body.amount,
                societyAdmin: admin._id,
                societyId: admin.societyId,
                month: req.body.month[i],
                maintanceId: req.body.maintanceId,
                year: maintance.year
            });
        };
        let data = await MaintancePayment.find({ userId: req.body.userId, });
        return res.status(200).send({
            message: locale.maintance_add,
            success: true,
            data: data,
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: err.message + locale.something_went_wrong,
            data: {},
        });
    }
};

//user list
exports.user = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        await ResidentialUser.find({ societyId: admin.societyId, status: "active", "isAdmin": 0 }).then(async data => {
            let details = [];
            for (let i = 0; i < data.length; i++) {
                let payment = await MaintancePayment.find({ userId: data[i]._id }).select('amount month year');;
                let user = {
                    "user": data[i],
                    "payment": payment,
                    "year": data[i].year
                }
                details.push(user);
            }
            return res.status(200).send({
                success: true,
                message: locale.user_fetched,
                data: details,
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
