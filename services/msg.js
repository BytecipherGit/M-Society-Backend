exports.sendSsm = (req, res, message) => {
    let msg = message
    let phone = req.body.phoneNumber
    let url = "http://api.bulksmsgateway.in/sendmessage.php?user=Bytecipher&password=" + process.env.PASSWORD + "&mobile=" + phone + "&message=" + msg + "Gateway&sender=" + process.env.SENDER + "&type=" + process.env.TYPE + "&template_id=" + process.env.TEMPLATE_ID;

    // console.log("6  ",url);

    // httpRequest.get(url,
    //     async function (error, response, body) {
    //         if (error) {
    //             console.log("SSM Not Sended");
    //         } else {
    //             console.log("SSM Send Sccessfuly");
    //         }
    //     }
    // );
};
//http://api.bulksmsgateway.in/sendmessage.php?user=Bytecipher&password=.......&mobile=........&message=Thank you for Testing our service, Regards BULK SMS Gateway&sender=TESTKK&type=3&template_id=1507161717524942102

//http://api.bulksmsgateway.in/sendmessage.php?user=Bytecipher&password=A&mobile=1234567890&message=You Get Paid Maintenance Slip From This Link: 192.168.1.122//payment-slip/6RI0PNGateway&sender=TESTKK&&type=3&template_id=1507161717524942102