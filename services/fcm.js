var fcm = require('fcm-notification');
// var serverKey = 'BLsQmpQ2afgp46ZMvNUT1EpT-JnXBdnJJytt2loOHdVW0Y5h3XF3UopnsF2izu2ku4zv6p1xLLgoS_4KZJLcick';
// var fcm = new FCM(serverKey);
var FCM = new fcm(".././config/serviceAccountKey.json");
// var message = {
// to:'72027c60bbfcceb9bf612a05c734e3c51c6d93eb1104a0609d764ae1b155b36ec6b7ecde26fb50b37d38929391d1a968',
//     notification: {
//         title: 'NotifcatioTestAPP',
//         body: '{"Message from node js app"}',
//     },
//     data: { //you can send only notification or only data(or include both)
//         title: 'ok cdfsdsdfsd',
//         body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
//     }
// };
// fcm.send(message, function(err, response) {
//     if (err) {
//         console.log("Something has gone wrong!"+err);
// 		console.log("Respponse:! "+response);
//     } else {
//         // showToast("Successfully sent with response");
//         console.log("Successfully sent with response: ", response);
//     }
// });
var token = '72027c60bbfcceb9bf612a05c734e3c51c6d93eb1104a0609d764ae1b155b36ec6b7ecde26fb50b37d38929391d1a968';

var message = {
    data: {    //This is only optional, you can send any data
        score: '850',
        time: '2:45'
    },
    notification: {
        title: 'Title of notification',
        body: 'Body of notification'
    },
    token: token
};

// FCM.send(message, function (err, response) {
//     if (err) {
//         console.log('error found', err);
//     } else {
//         console.log('response here', response);
//     }
// })
exports.noti = (req, res) => {
    console.log(req.body);
    var message = {
        data: {    //This is only optional, you can send any data
            score: '850',
            time: '2:45'
        },
        notification: {
            title: 'Title of notification',
            body: 'Body of notification'
        },
        token: token
    };
    FCM.send(message, function (err, response) {
        if (err) {
            console.log('error found', err);
        } else {
            console.log('response here', response);
        }
    })
};