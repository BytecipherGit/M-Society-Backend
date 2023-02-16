var FCM = require('fcm-node');

const Welcome = "welcome to the app buddy!!!";

exports.sendnotification = async (req, res) => {
    console.log(req.body);
    console.log(typeof req.body.token);
    //  server key from the fireBase
    var serverKey = "AAAAa2LLA4E:APA91bGoKo66ZgmHhrlwrDhatTqkhKBG6dqAZUhHLrQ2C1_PBefegeP1QOhMgVP2wQIZ-vaHHiRmflAi4meAdnsITQzkYhLCCn7QPJhrpDZMuaqcTknIQCkHGuoyloofDME9MB3w6Or2";
    var fcm = new FCM(serverKey);
    // here put device token in which you want to send push notification
    var data = {
        // to:"c9iy9XldaUW1pWrEex3KaY:APA91bGPsPziJazhXQZUW3QckNGxCYdCs98icheswnxFA5vEab64IBfLO7h_V63B5cA7EGtZKHcvpkzoHo974tLZ5Fd0HK2QbHdj0OfRrw-svPzSbcp93n4B2Pa9JPMzDW8_kS6tLmGr",
        // registration_ids: ["c9iy9XldaUW1pWrEex3KaY:APA91bGPsPziJazhXQZUW3QckNGxCYdCs98icheswnxFA5vEab64IBfLO7h_V63B5cA7EGtZKHcvpkzoHo974tLZ5Fd0HK2QbHdj0OfRrw-svPzSbcp93n4B2Pa9JPMzDW8_kS6tLmGr",
        // "ec5kOZPaQBCLcU9MYKH6gJ: APA91bHmqAVbvDuFCTSFSnvPxkVNbM9gp8fNOsQLlqalO3YTPRDv_OkdiSR_PXmMiYqZCehsctpPN4baFxkiFYLNBx2CxKpBOMQasoB - fWTW_J7Z0rkvDLm3i3gFXg9JvaIWn - WFxG33 "],
        registration_ids: req.body.token,
        notification: {
            title: "MSociety",
            body: req.body.message,
            sound: "default",
            icon: "\uD83D\uDCE7",
            color: "#7e55c3",
        },
    };
    fcm.send(data, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
            console.log(response);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};
