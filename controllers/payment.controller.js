const httpRequest = require("request");
const { Curl } = require('node-libcurl');
const helper = require("../helpers/helper");
const sendSMS = require("../services/mail");
const subscription = require("../models/subscription");

const x_client_id = process.env.CASHFREE_CLIENT_ID;
const x_client_secret = process.env.CASHFREE_CLIENT_SECRET;
const x_api_version = process.env.CASHFREE_API_VRESION;
const Url = process.env.CASHFREE_EASYSPLIT_ENDPOINT;
const minute = process.env.ORDER_EXPIRY_TIME

exports.paymentTake = async (req, res) => {
    let admin = await helper.validateSocietyAdmin(req);
    let sub = await subscription.findOne({ '_id': req.body.subId });
    let date = new Date()
    date.setMinutes(date.getMinutes() + minute);
    let customer_id = admin._id
    let customer_email = admin.email
    let customer_phone = admin.phoneNumber
    let customer_name = admin.name
    let order_amount = sub.price
    const requestData =
    {
        // "order_id": "order_1626945143520",
        "order_amount": order_amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": customer_id,
            "customer_email": customer_email,
            "customer_phone": customer_phone,
            "customer_name": customer_name,
        },
        "order_meta": {
            //url for frontend render 
            // for success
            // "return_url": "https://b8af79f41056.eu.ngrok.io?order_id={order_id}&order_token={order_token}",
            "return_url": "http://localhost:3000/payment-success/order_id={order_id}&order_token={order_token}",
            //for failed
            // "notify_url": "https://b8af79f41056.eu.ngrok.io/webhook.php"
            "notify_url": "https://c86b-122-168-227-157.in.ngrok.io/api/payment/pay"
        },
        "order_expiry_time": date
    }

    const options = {
        url: Url,
        // url: { { Sandbox_URL } } /orders,
        headers: {
            'content-type': "application/json",
            "x-client-id": x_client_id,
            "x-client-secret": x_client_secret,
            "x-api-version": x_api_version,
        },
        json: true,
        body: requestData
    };

    httpRequest.post(options,
        async function (error, response, body) {
            // console.log(response);
            if (!error && response.statusCode == 200) {
                console.log(response.body);
                let data = {
                    "payment_link": response.body.payment_link,
                    "order_token": response.body.order_token,
                    "order_id": response.body.order_id
                }
                return res.status(200).send({
                    success: true,
                    message: "payment created",
                    data: data
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
        url: Url + "/" + order_id + "/payments",
        headers: {
            'content-type': "application/json",
            "x-client-id": x_client_id,
            "x-client-secret": x_client_secret,
            "x-api-version": x_api_version,
        },
        json: true,
    };
    httpRequest.get(options,
        async function (error, response, body) {
            // console.log(response);
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
    console.log("pay");
};