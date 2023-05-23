var CronJob = require('cron').CronJob;
const Society = require("./models/society");
const subscriptionPayment = require("./models/subscriptionPayment");
const societySub = require("./models/societySubscription");

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
        let society = await Society.find({ "isDeleted": false }).select("_id");
        for (let i = 0; i < society.length; i++) {
            let sub = await societySub.findOne({ "isDeleted": false, societyId: society[i]._id }).sort({ createdDate: -1 }).select("endDateOfSub");
            if (sub) {
                const enddate = sub.endDateOfSub.toLocaleDateString('en-CA');
                if (enddate != currentDate) {
                    if (sub.endDateOfSub < new Date()) {
                        let subPayment = await subscriptionPayment.findOne({ "isDeleted": false, societyId: society[i]._id, razorpayPaymentId: { $ne: null } }).sort({ createdDate: -1 }).select("startDateOfSub");
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
                    }
                }
            }
        }
    }
};
