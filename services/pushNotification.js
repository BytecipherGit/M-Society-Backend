
const admin = require('../config/firebase.config');
const notification_options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
};

exports.sendWebNotification = (req, res) => {
    console.log("object ", req.body);
    admin
        .messaging()
        .sendToDevice(req.body.token, req.body.payload, notification_options)
        .then((response) => {
            // console.log("response ", response);
            // console.log("response err", response.results[0]);
            //return res.status(200).send("Notification sent successfully");
            return response;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });
};
