module.exports = app => {
    let router = require("express").Router();
    const payment = require("../controllers/payment.controller");


    router.post("/takePayment", payment.paymentTake);

    router.get("/paymentStatement/:order_id", payment.paymentStatement);

    router.get("/pay",payment.pay)

    app.use("/api/payment", router);
};