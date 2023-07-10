const helper = require("../helpers/helper");
const sendEmail = require("../services/mail");
const Subscription = require("../models/serviceSubscription");
const ServiceProviderSub = require("../models/serviceProviderSub");
const ServiceProviderSubPayHis = require("../models/serviceSubPayHis");
const ServiceProvider = require("../models/serviceProvider");
const Razorpay = require('razorpay');
// const webhookTest = require("../models/webhookTest");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getSubId = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        let sub = await Subscription.findOne({ "_id": req.body.subscriptionId });
        if (!sub) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        let plan_id = sub.razoPlanId;
        let societyDetails = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
        let options = {
            plan_id: plan_id,
            customer_notify: 1,
            // quantity: 1,
            total_count: parseInt(365 / sub.duration * 9),
            notes: {
                userId: user._id,
                role: "Service Provider"
            }
        }
        if (user.subscriptionType != 'free') {
            const startDate = societyDetails.endDateOfSub
            let tomorrow = societyDetails.endDateOfSub
            tomorrow.setDate(startDate.getDate() + 1);
            let unixTimestamp = Math.floor(tomorrow.getTime() / 1000);
            options = {
                plan_id: plan_id,
                customer_notify: 1,
                // quantity: 1,
                total_count: parseInt(365 / sub.duration * 9),
                start_at: unixTimestamp,
                notes: {
                    userId: user._id,
                    role: "Service Provider"
                }
            }
        }
        await instance.subscriptions.create(options, async function (err, response) {
            let data
            if (response) {

                let result = await ServiceProviderSubPayHis.create({
                    razorpaySubscriptionId: response.id,
                    razorpayPlanId: sub.razoPlanId,
                    subscriptionId: req.body.subscriptionId,
                    subscriptionObject: response,
                    // endDateOfSub:'',
                    // startDateOfSub:"",
                    razorpaySubscriptionStatus: response.entity,
                    serviceProviderId: user._id,
                    razorpaySubscriptionObject: response,
                    // razorpaySubscriptionCancelObject:"",
                    // razorpayPaymentId:"",
                    // payment_amount:"",
                    // payment_method:"",
                    // payment_time:"",
                    // razorpayPaymentObject:""
                });
                data = {
                    "razorpaySubscriptionId": response.id,
                    "entity": response.entity,
                    "id": result._id
                }
                return res.status(200).send({
                    success: true,
                    message: locale.sub_id,
                    data: data
                });
            }
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: locale.sub_id_not,
                    data: err,
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: err,
        });
    }
}

exports.statement = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        if (!req.body.razorpayPaymentId || !req.body.id) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        let serSub = await ServiceProviderSubPayHis.findOne({ _id: req.body.id });
        if (!serSub) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        let newSub = await Subscription.findOne({ "_id": serSub.subscriptionId });
        let subSer = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
        instance.payments.fetch(req.body.razorpayPaymentId, { "expand[]": "card" }, async function (err, response) {
            let condition
            if (response) {
                const new2 = subSer.endDateOfSub.toLocaleDateString('en-CA');
                const new1 = new Date().toLocaleDateString('en-CA');
                if (user.subscriptionType == 'free' || new2 < new1 || new2 == new1 || user.subscriptionType == 'expired') {
                    await ServiceProvider.updateOne({ _id: user._id }, {
                        $set: {
                            subscriptionId: newSub._id,
                            subscriptionType: newSub.type
                        }
                    });
                    const startDate = new Date();
                    let tomorrow = new Date();
                    tomorrow.setDate(startDate.getDate() + newSub.duration);
                    await ServiceProviderSub.updateOne({ serviceProviderId: user._id }, {
                        $set: {
                            subscriptionId: newSub._id,
                            subscriptionType: newSub.type,
                            razorpaySubscriptionId: serSub.razorpaySubscriptionId,
                            razorpayPlanId: serSub.razorpayPlanId,
                            razorpaySubscriptionIdStatus: "active",
                            startDateOfSub: startDate,
                            endDateOfSub: tomorrow
                        }
                    });
                    condition = {
                        endDateOfSub: tomorrow,
                        startDateOfSub: startDate,
                        razorpaySubscriptionStatus: 'active',
                        razorpayPaymentId: response.id,
                        payment_amount: response.amount,
                        payment_method: response.method,
                        payment_time: response.created_at,
                        razorpayPaymentObject: response,
                        token_id: response.token_id,
                    }
                    // await ServiceProviderSubPayHis.updateOne({ _id: req.body.id }, {
                    //     $set: {
                    //         endDateOfSub: tomorrow,
                    //         startDateOfSub: startDate,
                    //         razorpaySubscriptionStatus: 'active',
                    //         razorpayPaymentId: response.id,
                    //         payment_amount: response.amount,
                    //         payment_method: response.method,
                    //         payment_time: response.created_at,
                    //         razorpayPaymentObject: response
                    //     }
                    // });
                    // let data = {
                    //     razorpayPaymentId: response.id,
                    //     payment_amount: response.amount,
                    //     payment_method: response.method,
                    // }
                    // return res.status(200).send({
                    //     success: true,
                    //     message: locale.sub_payment,
                    //     data: data,
                    // });
                }
                let newSerSub = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
                const startDate1 = newSerSub.endDateOfSub
                let tomorrow1 = newSerSub.endDateOfSub
                tomorrow1.setDate(startDate1.getDate() + newSub.duration);
                let newSerSub1 = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
                if (!condition) {
                    condition = {
                        endDateOfSub: tomorrow1,
                        startDateOfSub: newSerSub1.endDateOfSub,
                        razorpaySubscriptionStatus: 'active',
                        razorpayPaymentId: response.id,
                        payment_amount: response.amount,
                        payment_method: response.method,
                        payment_time: response.created_at,
                        razorpayPaymentObject: response,
                        token_id: response.token_id,
                    }
                }
                await ServiceProviderSubPayHis.updateOne({ _id: req.body.id }, {
                    $set: condition
                    //  {endDateOfSub: tomorrow1,
                    //     startDateOfSub: newSerSub1.endDateOfSub,
                    //     razorpaySubscriptionStatus: 'active',
                    //     razorpayPaymentId: response.id,
                    //     payment_amount: response.amount,
                    //     payment_method: response.method,
                    //     payment_time: response.created_at,
                    //     razorpayPaymentObject: response }
                });
                let data = {
                    razorpayPaymentId: response.id,
                    payment_amount: response.amount,
                    payment_method: response.method,
                }
                return res.status(200).send({
                    success: true,
                    message: locale.sub_payment,
                    data: data,
                });
            }

            if (err) {
                return res.status(400).send({
                    success: false,
                    message: locale.sub_payment_not,
                    data: err,
                });
            }
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: err,
        });
    }
}

exports.cancel = async (req, res) => {
    try {
        if (!req.body.razorpaySubscriptionId) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        instance.subscriptions.cancel(req.body.razorpaySubscriptionId, false, async function (err, response) {
            if (response) {
                await ServiceProviderSubPayHis.updateMany({
                    razorpaySubscriptionId: req.body.razorpaySubscriptionId,
                }, {
                    $set: {
                        razorpaySubscriptionStatus: response.status,
                        razorpaySubscriptionCancelObject: response
                    }
                });
                await ServiceProviderSub.updateOne({
                    razorpaySubscriptionId: req.body.razorpaySubscriptionId,
                }, {
                    $set: {
                        razorpaySubscriptionIdStatus: response.status
                    }
                });
                return res.status(200).send({
                    success: true,
                    message: locale.sub_cancel,
                    data: {}
                });
            }
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: locale.sub_not_cancel,
                    data: {},
                });
            }
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};

exports.currentSub = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        let subscription = await Subscription.find({ deleted: false });
        let upcoming = await ServiceProviderSubPayHis.findOne({
            serviceProviderId: user._id, razorpayPaymentId: { $ne: null },
        }).sort({ createdDate: -1 });
        let currentSub = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
        let data = []
        for (let i = 0; i < subscription.length; i++) {
            let details = {
                subscriptionId: subscription[i]._id,
                razorpaySubscriptionId: "",
                btnName: false,
                endDate: ""
            }
            if (currentSub)
                if (subscription[i]._id.toString() == currentSub.subscriptionId.toString()) {
                    if (currentSub.razorpaySubscriptionIdStatus == "cancelled") {
                        const subDate = currentSub.endDateOfSub.toLocaleDateString('en-CA');
                        const currentDate = new Date().toLocaleDateString('en-CA');
                        if (subDate == currentDate || subDate > currentDate) {
                            details = {
                                razorpaySubscriptionId: currentSub.razorpaySubscriptionId,
                                subscriptionId: currentSub.subscriptionId,
                                btnName: currentSub.razorpaySubscriptionIdStatus,
                                endDate: currentSub.endDateOfSub
                            }
                        } else {
                            details = {
                                subscriptionId: subscription[i]._id,
                                razorpaySubscriptionId: "",
                                btnName: false,
                                endDate: ""
                            }
                        }
                    } else {
                        details = {
                            razorpaySubscriptionId: currentSub.razorpaySubscriptionId,
                            subscriptionId: currentSub.subscriptionId,
                            btnName: currentSub.razorpaySubscriptionIdStatus,
                            endDate: currentSub.endDateOfSub
                        }
                    }
                }
            if (upcoming)
                if (subscription[i]._id.toString() == upcoming.subscriptionId.toString()) {
                    if (upcoming.razorpaySubscriptionStatus == "cancelled") {
                        const subDate = upcoming.startDateOfSub.toLocaleDateString('en-CA');
                        const currentDate = new Date().toLocaleDateString('en-CA');
                        if (subDate == currentDate || subDate < currentDate) {
                            details = {
                                subscriptionId: upcoming.subscriptionId,
                                razorpaySubscriptionId: upcoming.razorpaySubscriptionId,
                                btnName: upcoming.razorpaySubscriptionStatus,
                                endDate: ""
                            }
                        } else {
                            details = {
                                subscriptionId: subscription[i]._id,
                                razorpaySubscriptionId: "",
                                btnName: false,
                                endDate: ''
                            }
                        }
                    } else {
                        details = {
                            subscriptionId: upcoming.subscriptionId,
                            razorpaySubscriptionId: upcoming.razorpaySubscriptionId,
                            btnName: upcoming.razorpaySubscriptionStatus,
                            endDate: upcoming.endDateOfSub
                        }
                    }
                }

            data.push(details)
        }
        // let data = {
        //     currentSub: upcoming,
        //     upcommingSub: currentSub
        // }
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
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

exports.history = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        let query = { serviceProviderId: user._id, razorpayPaymentId: { $ne: null } };
        await ServiceProviderSubPayHis.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit).exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let totalData = await ServiceProviderSubPayHis.find(query);
                let count = totalData.length
                let page1 = count / limit;
                let page3 = Math.ceil(page1);
                if (doc.length == 0) {
                    return res.status(200).send({
                        success: true,
                        message: locale.is_empty,
                        data: [],
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
            })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};