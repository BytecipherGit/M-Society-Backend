const httpRequest = require("request");
const { Curl } = require('node-libcurl');
const helper = require("../helpers/helper");
const sendSMS = require("../services/mail");

exports.paymentTake = async (req, res) => {
    let date = new Date()
    date.setMinutes(date.getMinutes() + 30);
    let customer_id = req.body.customer_id
    let customer_email = req.body.customer_email
    let customer_phone = req.body.customer_phone
    let customer_name = req.body.customer_name
    const requestData =
    {
        // "order_id": "order_1626945143520",
        "order_amount": 1.00,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": "7112AAA812234",
            "customer_email": "john@cashfree.com",
            "customer_phone": "8462933254",
            "customer_name": "",

            "customer_id": customer_id,
            "customer_email": customer_email,
            "customer_phone": customer_phone,
            "customer_name": customer_name,
        },
        "order_meta": {
            //url for frontend render 
            // for success
            // "return_url": "https://b8af79f41056.eu.ngrok.io?order_id={order_id}&order_token={order_token}",
            "return_url": "http://localhost:3000/api/superAdmin/payStatement/order_id={order_id}&order_token={order_token}",
            //for failed
            // "notify_url": "https://b8af79f41056.eu.ngrok.io/webhook.php"
            "notify_url": "https://c86b-122-168-227-157.in.ngrok.io/api/payment/pay"
        },
        "order_expiry_time": date
    }

    const options = {
        url: "https://sandbox.cashfree.com/pg/orders",
        // url: { { Sandbox_URL } } /orders,
        headers: {
            'content-type': "application/json",
            "x-client-id": "TEST346064e3e4a85e6d4e7c6d7f3c460643",
            "x-client-secret": "TESTeee03c8f305389d936d9ff0efdabc3260ae34543",
            "x-api-version": "2022-01-01"
        },
        json: true,
        body: requestData
    };

    httpRequest.post(options,
        async function (error, response, body) {
            console.log(response);
            if (!error && response.statusCode == 200) {
                console.log(response);
                console.log(response.body);
                return res.status(200).send({
                    success: true,
                    message: "payment created",
                    data: response.body,
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "payment error",
                    data: response.error,
                });
            }
        }
    );
};

//payment statement 
exports.paymentStatement = async (req, res) => {
    // let order_id = "order_3460642NSb9t2bLNCC4bjMEJcMHabmNDE"
    let order_id = req.params.order_id
    const options = {
        url: "https://sandbox.cashfree.com/pg/orders/" + order_id + "/payments",
        headers: {
            'content-type': "application/json",
            "x-client-id": "TEST346064e3e4a85e6d4e7c6d7f3c460643",
            "x-client-secret": "TESTeee03c8f305389d936d9ff0efdabc3260ae34543",
            "x-api-version": "2022-01-01"
        },
        json: true,
    };
    httpRequest.get(options,
        async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return res.status(200).send({
                    success: true,
                    message: "payment statement fetch",
                    data: response.body,
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "payment not done know by link",
                    data: response.error,
                });
            }
        }
    );
};

exports.pay = async (req, res) => {
    console.log(pay);
};