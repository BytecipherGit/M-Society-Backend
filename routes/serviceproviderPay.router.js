module.exports = app => {
    const payment = require("../controllers/serviceProviderSubPayment.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

  /**
* @swagger
* /api/serviceProviderPayment/getSubId:
*   post:
*     summary: Take payment subId send
*     tags:
*       - ServiceProvider  Payment
*     parameters:
*       - in: body
*         description: Take payment subId send
*         schema:
*           type: object
*           required:
*             - subscriptionId
*           properties:
*             subscriptionId:
*               type: string
*     responses:
*       200:
*         description: Take payment subId send successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type:
*                   items:
*                     properties:
*                       link:
*                         type: string
*                         example: Raju
*                       order_token:
*                         type: string
*                         example: Indore
*                       order_id:
*                         type: string
*                         example: day/night
 */
    router.post("/getSubId", validateTokenMiddleware.validateToken, payment.getSubId);

// /**
// * @swagger
// * /api/serviceProviderPayment/current:
// *   get:
// *     summary: Fecth current subscription 
// *     tags:
// *       - ServiceProvider  Payment
// *     parameters:
// *         description: Fecth current subscription 
// *     responses:
// *       200:
// *         description: Fecth current subscription 
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 data:
// *                   type:
// *                   items:
// *                     properties:
// *                       currentSub:
// *                         type: object
// *                       upcommingSub:
// *                         type: object
//  */
    router.get("/current", validateTokenMiddleware.validateToken, payment.currentSub);

    /**
* @swagger
* /api/serviceProviderPayment/statement:
*   post:
*     summary: Fetch statement 
*     tags:
*       - ServiceProvider  Payment
*     parameters:
*       - in: body
*         description: Fetch statement 
*         schema:
*           type: object
*           required:
*             - id
*             - razorpayPaymentId
*           properties:
*             id:
*               type: string
*             razorpayPaymentId:
*               type: string
*     responses:
*       200:
*         description: Fetch statement 
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type:
*                   items:
*                     properties:
*                       razorpayPaymentId:
*                         type: string
*                       payment_amount:
*                         type: string
*                       payment_method:
*                         type: string
*/
 router.post("/statement", validateTokenMiddleware.validateToken, payment.statement);

 /**
* @swagger
* /api/serviceProviderPayment/cancel:
*   post:
*     summary: Subscription Cancel
*     tags:
*       - ServiceProvider  Payment
*     parameters:
*       - in: body
*         description: Subscription Cancel
*         schema:
*           type: object
*           required:
*             - id
*             - razorpayPaymentId
*           properties:
*             id:
*               type: string
*             razorpayPaymentId:
*               type: string
*     responses:
*       200:
*         description: Subscription Cancel
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type:
*                   items:
*                     properties:
*                       razorpayPaymentId:
*                         type: string
*                       payment_amount:
*                         type: string
*                       payment_method:
*                         type: string
*/
 router.post("/cancel", validateTokenMiddleware.validateToken, payment.cancel);

// /**
// * @swagger
// * /api/serviceProviderPayment/paymentHistory:
// *   get:
// *     summary: Fecth payment history
// *     tags:
// *       - ServiceProvider  Payment
// *     parameters:
// *         description: Fecth payment history
// *     responses:
// *       200:
// *         description: Fecth payment history
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 data:
// *                   type:
// *                   items:
// *                     properties:
// *                       link:
// *                         type: string
// *                         example: Raju
// *                       order_token:
// *                         type: string
// *                         example: Indore
// *                       order_id:
// *                         type: string
// *                         example: day/night
//  */
router.get("/paymentHistory", validateTokenMiddleware.validateToken, payment.history);

  app.use("/api/serviceProviderPayment", router);
}

