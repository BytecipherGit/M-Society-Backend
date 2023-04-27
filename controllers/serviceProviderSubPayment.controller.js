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
        console.log(req.body);
        let sub = await Subscription.findOne({ "_id": req.body.subscriptionId });
        console.log(sub);
        if (!sub) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        const startDate = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(startDate.getDate() + 1);
        let unixTimestamp = Math.floor(tomorrow.getTime() / 1000);

        // let plan_id = req.body.plan_id;
        // console.log(365 / sub.duration * 10);
        // let a = 365 / sub.duration * 10
        // console.log("36 ", a);
        // let s = parseInt(a)
        // console.log(typeof s);
        let options = {
            plan_id: sub.razoPlanId,
            customer_notify: 1,
            // quantity: 1,
            total_count: parseInt(365 / sub.duration * 10),
            // amount: 1000,
            start_at: unixTimestamp,
            // addons: [{
            //         item: {
            //             name: "Delivery charges",
            //             amount: 0,
            //             currency: "INR"
            //         }
            //     }],
            notes: {
                userId: user._id,
                role: "Service Provider"
            }
        }
        await instance.subscriptions.create(options, async function (err, response) {
            console.log("response ", response);
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
                console.log(err);
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
            data: {},
        });
    }
}

exports.statement = async (req, res) => {
    try {
        let user = await helper.validateServiceProvider(req);
        // console.log(req.body);
        if (!req.body.razorpayPaymentId || !req.body.id) {
            console.log(req.body);
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        let serSub = await ServiceProviderSubPayHis.findOne({ _id: req.body.id });
        // console.log(serSub);

        if (!serSub) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        let newSub = await Subscription.findOne({ "_id": serSub.subscriptionId });

        instance.payments.fetch(req.body.razorpayPaymentId, { "expand[]": "card" }, async function (err, response) {
            if (response) {
                if (user.subscriptionType == 'free') {
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
                    await ServiceProviderSubPayHis.updateOne({ _id: req.body.id }, {
                        $set: {
                            endDateOfSub: tomorrow,
                            startDateOfSub: startDate,
                            razorpaySubscriptionStatus: 'active',
                            razorpayPaymentId: response.id,
                            payment_amount: response.amount,
                            payment_method: response.method,
                            payment_time: response.created_at,
                            razorpayPaymentObject: response
                        }
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
                let newSerSub = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
                const startDate1 = newSerSub.endDateOfSub
                let tomorrow1 = newSerSub.endDateOfSub
                tomorrow1.setDate(startDate1.getDate() + newSub.duration);
                let newSerSub1 = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
                await ServiceProviderSubPayHis.updateOne({ _id: req.body.id }, {
                    $set: {
                        endDateOfSub: tomorrow1,
                        startDateOfSub: newSerSub1.endDateOfSub,
                        razorpaySubscriptionStatus: 'active',
                        razorpayPaymentId: response.id,
                        payment_amount: response.amount,
                        payment_method: response.method,
                        payment_time: response.created_at,
                        razorpayPaymentObject: response
                    }
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
}

exports.cancel = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.razorpaySubscriptionId) {
            return res.status(200).send({
                success: false,
                message: locale.valide_id_not,
                data: {},
            });
        }
        instance.subscriptions.cancel(req.body.razorpaySubscriptionId, false, async function (err, response) {
            if (response) {
                console.log("razorpaySubscriptionId ",response);
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
            // return res.status(200).send({
            //     success: true,
            //     message: "payment created",
            //     data: response
            // });
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
        let sub = await ServiceProviderSubPayHis.findOne({ serviceProviderId: user._id }).sort({ createdDate: -1 });
        let sub2 = await ServiceProviderSub.findOne({ serviceProviderId: user._id });
        let data = {
            currentSub: sub2,
            upcommingSub: sub
        }
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data,
        });
    } catch (err) {
        console.log(err);
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
        let data = await ServiceProviderSubPayHis.find({ serviceProviderId: user._id, razorpayPaymentId: { $ne: null } }).sort({ createdDate: -1 });
        return res.status(200).send({
            success: true,
            message: locale.id_fetched,
            data: data,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
};