
const admin = require('../config/firebase.config');
const notification_options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
};

exports.sendWebNotification = (req, res) => {
    console.log("object ", req.body);
    // req.body = {
    //     token: 'dYX4j6BqTzy4pXjszuGSjL:APA91bHrXmOwIR6fN3Dmq0Rzfw5loGHWzw9UVykMpiSh6qQMlBEPaYkBq-zBCh1YRrh0Jf-sq2h2Lkw8MfNJouLkC2o1-Yu98S5TklWZ70EqnfOSYsIA7fJ-Z3ZGmQB4xfIEP_qNuLIl',//userPushToken.pushToken,
    //     payload: {
    //         notification: {
    //             title: "Payment Received",
    //             body: userData.shopName + " has successfully received payment of amount " + req.body.amount
    //         }
    //     }
    // }
    admin
        .messaging()
        .sendToDevice(req.body.token, req.body.payload, notification_options)
        .then((response) => {
            console.log("response ", response);
            // console.log("response err", response.results[0]);
            //return res.status(200).send("Notification sent successfully");
            return response;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });
};
