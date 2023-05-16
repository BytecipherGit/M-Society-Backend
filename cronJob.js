var CronJob = require('cron').CronJob;
const Society = require("./models/society");
const subscriptionPayment = require("./models/subscriptionPayment");

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
        // let society = await Society.find({ "isDeleted": false }).select("_id");
        // console.log(society);
        // for (let i = 0; i < society.length; i++) {
        //     let sub = await subscriptionPayment.findOne({ "isDeleted": false, societyId: society[i]._id, subscription_status :'active'}).sort({ createdDate: -1 }).select("endDateOfSub");
        //     if(sub){
        //         console.log(sub);
        //     }
        // }
        console.log("object");
    }
    console.log("object")
}