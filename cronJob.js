var CronJob = require('cron').CronJob;

// const CRONJOBENABLE = process.env.CRONJOBENABLE;
const CRONJOBENABLE = false;

var job = new CronJob('1 * * * * *', getUserInfo);
job.start();

async function getUserInfo() {
    if (CRONJOBENABLE) {
        console.log("object");
    }
    // console.log("object")
}