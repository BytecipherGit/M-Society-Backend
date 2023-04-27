// const httpRequest = require("request");
// const { Curl } = require('node-libcurl');
const helper = require("../helpers/helper");
const sendEmail = require("../services/mail");
const subscription = require("../models/subscription");
const subPayment = require("../models/subscriptionPayment");
const societyAdmin = require("../models/residentialUser");
const societySubscription = require("../models/societySubscription");
const history = require("../models/societySubHistory");
const Society = require("../models/society");
const Razorpay = require('razorpay');
// const crypto = require('crypto');
const webhookTest = require("../models/webhookTest");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// const x_client_id = process.env.CASHFREE_CLIENT_ID;
// const x_client_secret = process.env.CASHFREE_CLIENT_SECRET;
// const x_api_version = process.env.CASHFREE_API_VRESION;
// const Url = process.env.CASHFREE_EASYSPLIT_ENDPOINT;
// const minute = process.env.ORDER_EXPIRY_TIME

// exports.paymentTake = async (req, res) => {
//     let admin = await helper.validateSocietyAdmin(req);
//     let sub = await subscription.findOne({ '_id': req.body.subId });
//     let date = new Date()
//     date.setMinutes(date.getMinutes() + minute);
//     let customer_id = admin._id
//     let customer_email = admin.email
//     let customer_phone = "+919090407368" // admin.phoneNumber
//     let customer_name = admin.name
//     let order_amount = sub.price
//     const requestData =
//     {
//         // "order_id": "order_1626945143520",
//         "order_amount": order_amount,
//         "order_currency": "INR",
//         "customer_details": {
//             "customer_id": customer_id,
//             "customer_email": customer_email,
//             "customer_phone": customer_phone,
//             "customer_name": customer_name,
//         },
//         "order_meta": {
//             //url for frontend render 
//             // for success
//             // "return_url": "https://b8af79f41056.eu.ngrok.io?order_id={order_id}&order_token={order_token}",
//             "return_url": "http://localhost:3000/my-subscription/order_id={order_id}&order_token={order_token}",
//             //for failed
//             // "notify_url": "https://b8af79f41056.eu.ngrok.io/webhook.php"
//             "notify_url": "https://c86b-122-168-227-157.in.ngrok.io/api/payment/pay"
//         },
//         "order_expiry_time": date
//     }

//     const options = {
//         url: Url,
//         // url: { { Sandbox_URL } } /orders,
//         headers: {
//             'content-type': "application/json",
//             "x-client-id": x_client_id,
//             "x-client-secret": x_client_secret,
//             "x-api-version": x_api_version,
//         },
//         json: true,
//         body: requestData
//     };

//     httpRequest.post(options,
//         async function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 let sub = {
//                     societyId: admin.societyId,
//                     subscriptionId: req.body.subId,
//                     order_id: response.body.order_id,
//                     payment_status: "pending"
//                 }
//                 await subPayment.create(sub);
//                 let data = {
//                     "payment_link": response.body.payment_link,
//                     "order_token": response.body.order_token,
//                     "order_id": response.body.order_id
//                 }
//                 return res.status(200).send({
//                     success: true,
//                     message: "payment created",
//                     data: data
//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     message: "payment error",
//                     data: response.error,
//                 });
//             }
//         }
//     );
// };

// //payment statement 
// exports.paymentStatement = async (req, res) => {
//     // let order_id = "order_3460642NSb9t2bLNCC4bjMEJcMHabmNDE"
//     let admin = await helper.validateSocietyAdmin(req);
//     let order_id = req.params.order_id
//     const options = {
//         url: Url + "/" + order_id + "/payments",
//         headers: {
//             'content-type': "application/json",
//             "x-client-id": x_client_id,
//             "x-client-secret": x_client_secret,
//             "x-api-version": x_api_version,
//         },
//         json: true,
//     };
//     httpRequest.get(options,
//         async function (error, response, body) {
//             // console.log(response);
//             if (!error && response.statusCode == 200) {
//                 if (response.body) {
//                     let data = response.body[0]
//                     let subpay = await subPayment.findOne({ order_id: order_id });
//                     await subPayment.updateOne({
//                         order_id: order_id, $set: {
//                             payment_currency: data.payment_currency,
//                             payment_status: data.payment_status,
//                             payment_time: data.payment_time,
//                             paymentObject: response.body,
//                             // payment_method: data.payment_type
//                         }
//                     });
//                     let subfind = await subscription.findOne({ "_id": subpay.subscriptionId });
//                     let society = await Society.findById(admin.societyId);
//                     if (society.subscriptionType == "Free") {
//                         let sub = await subscription.findOne({ '_id': subpay.subscriptionId });
//                         let h = await Society.updateOne({
//                             _id: admin.societyId
//                         }, {
//                             $set: {
//                                 subscriptionType: sub.name, subscriptionId: subpay.subscriptionId

//                             }
//                         });
//                         // let d = societySub.endDateOfSub;
//                         var d = new Date();
//                         d.toLocaleString()
//                         d.setDate(d.getDate() + sub.duration);
//                         var utcs = new Date(d.getTime() + d.getTimezoneOffset() * 60000);//UTC format date
//                         awaitupdateOne({
//                             societyId: admin.societyId
//                         }, {
//                             $set: {
//                                 subscriptionId: sub._id, startDateOfSub: utcs, endDateOfSub: d
//                             }
//                         });
//                     }
//                     let societySub = await societySubscription.findOne({ societyId: admin.societyId });
//                     let d2 = societySub.endDateOfSub;
//                     d2.toLocaleString()
//                     d2.setDate(d2.getDate() + 1);
//                     var utcstart = new Date(d2.getTime() + d2.getTimezoneOffset() * 60000);//UTC format date

//                     utcstart.toLocaleString()
//                     utcstart.setDate(utcstart.getDate() + subfind.duration);
//                     var utclast = new Date(utcstart.getTime() + utcstart.getTimezoneOffset() * 60000);//UTC format date
//                     let sub1 = {
//                         societyId: admin.societyId,
//                         subscriptionId: subfind._id,
//                         // subscriptionType: subfind.name,
//                         startDate: utcstart,
//                         endDate: utclast,//null
//                         isLast: true
//                     }
//                     await history.create(sub1)
//                 }
//                 // req.body.subject = "MSOCIETY Subscription Paid"
//                 // req.body.msg = locale.subscription_paid
//                 // req.body.email = "darwadedaya882@gmail.com" // admin.email
//                 // await sendEmail.sendEmailSendGrid(req)
//                 return res.status(200).send({
//                     success: true,
//                     message: "payment statement fetch",
//                     data: response.body[0],
//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     message: "payment not done know by link",
//                     data: response.error,
//                 });
//             }
//         }
//     );
// };

exports.paymeny = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        if (!req.body.plan_id || !req.body.subId) {
            return res.status(200).send({
                success: false,
                message: locale.sub_fields,
                data: err,
            });
        }
        let sub = await subscription.findOne({ '_id': req.body.subId });
        const startDate = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(startDate.getDate() + 1);
        let unixTimestamp = Math.floor(tomorrow.getTime() / 1000);
        if (req.body.razorpaySubscriptionId) {
            let oldSubDate = await subPayment.findOne({ razorpaySubscriptionId: req.body.razorpaySubscriptionId }).sort({ createdDate: -1 });
            unixTimestamp = Math.floor(oldSubDate.endDateOfSub.getTime() / 1000);
        }
        let plan_id = req.body.plan_id;
        let options = {
            plan_id: plan_id,
            customer_notify: 1,
            // quantity: 1,
            total_count: 10,
            // amount: 10,
            start_at: unixTimestamp,
            // addons: [{
            //         item: {
            //             name: "Delivery charges",
            //             amount: 0,
            //             currency: "INR"
            //         }
            //     }],
            notes: {
                key1: "value3",
                key2: "value2"
            }
        }
        await instance.subscriptions.create(options, async function (err, response) {
            let data
            if (response) {
                data = {
                    "id": response.id,
                    "entity": response.entity
                }
                await subPayment.create({
                    razorpaySubscriptionId: response.id,
                    plan_id: req.body.plan_id,
                    societyId: admin.societyId,
                    subscriptionId: req.body.subId,
                    subscriptionObject: response,
                    // societyId: admin.societyId
                });

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
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: { err },
        });
    }
};

exports.statement = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        let id = req.body.razorpayPaymentId
        let subId = req.body.razorpaySubscriptionId
        let newSub = await subPayment.findOne({ razorpaySubscriptionId: subId, });
        let society = await Society.findOne({ _id: admin.societyId, });
        let societyUpdatedSub = await subscription.findOne({ "_id": society.subscriptionId });
        let newSocietyUpdatedSub = await subscription.findOne({ "_id": newSub.subscriptionId });
        instance.payments.fetch(id, { "expand[]": "card" }, async function (err, response) {
            if (response) {
                await subPayment.updateOne({
                    razorpaySubscriptionId: subId,
                }, {
                    $set: {
                        payment_method: response.method,
                        order_id: response.order_id,
                        payment_currency: response.currency,
                        paymentObject: response,
                        payment_amount: response.amount,
                        subscription_status: "active"
                    }
                });
                if (society.subscriptionType == "Free") {
                    var d = new Date();
                    d.toLocaleString()
                    d.setDate(d.getDate() + newSocietyUpdatedSub.duration);
                    let eDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);//UTC format date
                    await societySubscription.updateOne({
                        societyId: admin.societyId
                    }, {
                        $set: {
                            subscriptionId: newSocietyUpdatedSub._id,
                            startDateOfSub: new Date(),
                            endDateOfSub: eDate,
                            razorpaySubscriptionId: subId
                        }
                    });
                    await Society.updateOne({
                        "_id": admin.societyId
                    }, {
                        $set: {
                            subscriptionId: newSocietyUpdatedSub._id,
                            subscriptionType: newSocietyUpdatedSub.type,
                        }
                    });
                    await subPayment.updateOne({
                        razorpaySubscriptionId: subId,
                    }, {
                        $set: {
                            startDateOfSub: new Date(),
                            endDateOfSub: eDate,
                        }
                    });
                }
                if (req.body.oldRazorpaySubscriptionId) {
                    instance.subscriptions.cancel(req.body.oldRazorpaySubscriptionId, false, async function (err, response) {
                        if (response) {
                            let oldSub = await subPayment.findOne({ razorpaySubscriptionId: req.body.oldRazorpaySubscriptionId });
                            await subPayment.updateOne({
                                razorpaySubscriptionId: req.body.oldRazorpaySubscriptionId,
                            }, {
                                $set: {
                                    // payment_method: response.method,
                                    // order_id: response.order_id,
                                    // payment_currency: response.currency,
                                    // paymentObject: response,
                                    // payment_amount: response.amount,
                                    // cityCount: req.body.cityCount,
                                    // stateCount: req.body.stateCount,
                                    // type: req.body.type,
                                    subscription_status: "cancel",
                                    subscriptionCancelObject: response
                                }
                            });
                            await societySubscription.updateOne({
                                societyId: society._id //req.body.id
                            }, {
                                $set: {
                                    // subscriptionId: newSub.subscriptionId,
                                    // startDateOfSub: sDate,
                                    // endDateOfSub: eDate,
                                    // razorpaySubscriptionId: razorpaySubscriptionId,
                                    razorpaySubscriptionIdStatus: false
                                }
                            });
                            let a = oldSub.endDateOfSub
                            var d = oldSub.endDateOfSub
                            d.toLocaleString()
                            d.setDate(d.getDate() + newSocietyUpdatedSub.duration);
                            let eDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);//UTC format date
                            await subPayment.updateOne({
                                razorpaySubscriptionId: subId,
                            }, {
                                $set: {
                                    startDateOfSub: a,
                                    endDateOfSub: eDate,
                                }
                            });
                            // return res.status(200).send({
                            //     success: true,
                            //     message: locale.sub_cancel,
                            //     data: response
                            // });
                        }
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: locale.sub_payment,
                    data: response
                });
            }
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: locale.sub_payment_not,
                    data: { err },
                });
            }
            return res.status(200).send({
                success: true,
                message: locale.sub_payment,
                data: response
            });
        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: { err },
        });
    }
};

exports.craetePlane = async (req, res) => {
    let options = {
        // period: 1,//plan_LcMctr8atlHTnK
        // "period": 1,
        period: "yearly",//plan_LcMhFfnEXpuor4
        interval: 1, //1,
        item: {
            name: "Test plan - yearly",
            amount: 100000,
            currency: "INR",
            description: "Description create yearly plane"
        },
        notes: {
            notes_key_1: "MSQUARE",
            notes_key_2: "MSQUARE"
        }
    }
    instance.plans.create(options, function (err, order) {
        console.log("sub ", order);
        if (err) {
            console.log("err ", err);
        }
        return res.send(order)
        // });
    })
};

exports.cancel = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        var razorpaySubscriptionId = req.body.razorpaySubscriptionId;
        // var options = {
        //     cancel_at_cycle_end: false,
        //     cancel_immediately: true,
        //     cancel_reason: 'Customer requested cancellation',
        //     refund_amount: 100
        // };
        // instance.subscriptions.cancel(razorpaySubscriptionId, false, function (error, subscription) {
        //     // console.log("options ", options);
        //     if (error) {
        //         console.log(error);
        //         return res.status(400).send({
        //             success: false,
        //             message: locale.sub_not_cancel,
        //             data: {},
        //         });
        //     } else {
        //         console.log(subscription);
        //     }
        // });
        // console.log("subscription");
        instance.subscriptions.cancel(razorpaySubscriptionId, false, async function (err, response) {
            //instance.subscriptions.cancel(subscriptionId,options)
            // let data = {
            //     "id": response.id,
            //     "entity": response.entity
            // }
            if (response) {
                await subPayment.updateOne({
                    razorpaySubscriptionId: razorpaySubscriptionId,
                }, {
                    $set: {
                        // payment_method: response.method,
                        // order_id: response.order_id,
                        // payment_currency: response.currency,
                        // paymentObject: response,
                        // payment_amount: response.amount,
                        // cityCount: req.body.cityCount,
                        // stateCount: req.body.stateCount,
                        // type: req.body.type,
                        subscription_status: "cancel",
                        subscriptionCancelObject: response
                    }
                });
                await societySubscription.updateOne({
                    _id: req.body.id
                }, {
                    $set: {
                        // subscriptionId: newSub.subscriptionId,
                        // startDateOfSub: sDate,
                        // endDateOfSub: eDate,
                        razorpaySubscriptionId: razorpaySubscriptionId,
                        razorpaySubscriptionIdStatus: false
                    }
                });
                return res.status(200).send({
                    success: true,
                    message: locale.sub_cancel,
                    data: response
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

exports.test = async (req, res) => {
    try {
        // let subscription = instance.subscriptions.fetch("sub_Lc0dF4xv4jV7gh", function (error, subscription) {
        //     // console.log("options ", options);
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log(subscription);
        //     }
        // })
        // console.log(subscription);
        await webhookTest.create({
            resStatus: true,
            bodyObject: req.body
        }).then(data => {
            return res.status(200).send({
                success: true,
                message: "webHook Call Done",
                data: {},
            });
        }).catch(err => {
            return res.status(400).send({
                success: false,
                message: locale.something_went_wrong,
                data: {},
            });
        })
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: locale.something_went_wrong,
            data: {},
        });
    }
}

exports.currentSub = async (req, res) => {
    try {
        let admin = await helper.validateSocietyAdmin(req);
        // let societySub = await societySubscription.findOne({ societyId: admin.societyId });
        let canceled = await subPayment.findOne({ societyId: admin.societyId, subscription_status: 'cancel' }).sort({ createdDate: -1 });
        let active = await subPayment.findOne({ societyId: admin.societyId, subscription_status: "active" }).sort({ createdDate: -1 });

        let result = [];
        if (active) {
            result[0] = active
        }
        if (canceled) {
            result[1] = canceled
        }
        // result = canceled

        //razorpaySubscriptionId
        //subscriptionId
        // if (societySub) {
        return res.status(200).send({
            success: true,
            message: locale.society_sub,
            data: result
        });
        // } else
        //     return res.status(200).send({
        //         success: true,
        //         message: locale.society_sub_not,
        //         data: {},
        //     });
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
        let admin = await helper.validateSocietyAdmin(req);
        // let societySub = await societySubscription.findOne({ societyId: admin.societyId });
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        var query = { societyId: admin.societyId }
        let societySubAll = await subPayment.find(query).sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit).exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let totalData = await subPayment.find(query);
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

exports.historyAll = async (req, res) => {
    try {
        let admin = await helper.validateSuperAdmin(req);
        // let societySub = await societySubscription.findOne({ societyId: admin.societyId });
        var page = parseInt(req.query.page) || 0;
        var limit = parseInt(req.query.limit) || 5;
        // var query = { "societyId": admin.societyId, "isDeleted": false };
        await subPayment.find().sort({ createdDate: -1 }).limit(limit)
            .skip(page * limit).exec(async (err, doc) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: locale.something_went_wrong,
                        data: {},
                    });
                }
                let totalData = await subPayment.find();
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