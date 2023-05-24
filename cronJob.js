var CronJob = require('cron').CronJob;
const Society = require("./models/society");
const subscriptionPayment = require("./models/subscriptionPayment");
const societySub = require("./models/societySubscription");
const ServiceProvider = require("./models/serviceProvider.js");//models/serviceProvider.js
// const Subscription = require("../models/serviceSubscription");
const ServiceProviderSub = require("./models/serviceProviderSub");
const ServiceProviderSubPayHis = require("./models/serviceSubPayHis");
// const CRONJOBENABLE = process.env.CRONJOBENABLE;
const CRONJOBENABLE = true;

var job = new CronJob('*/30 * * * * *', getUserInfo);
job.start();

// var cron = require('node-cron');
// cron.schedule('0 0 0 * * *', () => {//*/30 * * * * *
//     console.log('running every minute 1, 2, 4 and 5');
// });

async function getUserInfo() {
    if (CRONJOBENABLE) {
        const currentDate = new Date().toLocaleDateString('en-CA');
        console.log(currentDate);
        let society = await Society.find({ "isDeleted": false }).select("_id");
        let serviceProvider = await ServiceProvider.find({ "deleted": false }).select("_id");
        console.log("serviceProvider ", serviceProvider.length);
        for (let i = 0; i < society.length; i++) {
            let sub = await societySub.findOne({ "isDeleted": false, societyId: society[i]._id }).sort({ createdDate: -1 }).select("endDateOfSub");
            if (sub) {
                const enddate = sub.endDateOfSub.toLocaleDateString('en-CA');
                if (enddate != currentDate) {
                    if (sub.endDateOfSub < new Date()) {
                        let subPayment = await subscriptionPayment.findOne({ "isDeleted": false, societyId: society[i]._id, razorpayPaymentId: { $ne: null } }).sort({ createdDate: -1 }).select("startDateOfSub");
                        if (subPayment) {
                            if (sub.endDateOfSub < subPayment.startDateOfSub) {
                            } else {
                                await Society.updateOne({
                                    "_id": society[i]._id
                                }, {
                                    $set: {
                                        // subscriptionId: subPayment.subscriptionId,
                                        subscriptionType: 'expired'
                                    }
                                });
                            }
                        } else {
                            await Society.updateOne({
                                "_id": society[i]._id
                            }, {
                                $set: {
                                    // subscriptionId: subPayment.subscriptionId,
                                    subscriptionType: 'expired'
                                }
                            });
                        }
                    }
                }
            }
        }
        if (serviceProvider.length > 0)
            for (let i = 0; i < serviceProvider.length; i++) {
                let sub = await ServiceProviderSub.findOne({ "deleted": false, serviceProviderId: serviceProvider[i]._id }).sort({ createdDate: -1 }).select("endDateOfSub");
                if (sub) {
                    const enddate = sub.endDateOfSub.toLocaleDateString('en-CA');
                    console.log(enddate);
                    if (enddate != currentDate) {
                        if (sub.endDateOfSub < new Date()) {
                            let subPayment = await subscriptionPayment.findOne({ "deleted": false, serviceProviderId: serviceProvider[i]._id, razorpayPaymentId: { $ne: null } }).sort({ createdDate: -1 }).select("startDateOfSub");
                            if (subPayment) {
                                if (sub.endDateOfSub < subPayment.startDateOfSub) {
                                } else {
                                    await ServiceProvider.updateOne({
                                        "_id": serviceProvider[i]._id
                                    }, {
                                        $set: {
                                            // subscriptionId: subPayment.subscriptionId,
                                            subscriptionType: 'expired'
                                        }
                                    });
                                }
                            } else {
                                await ServiceProvider.updateOne({
                                    "_id": serviceProvider[i]._id
                                }, {
                                    $set: {
                                        // subscriptionId: subPayment.subscriptionId,
                                        subscriptionType: 'expired'
                                    }
                                });
                            }
                        }
                    }
                }
            }
    }
};
