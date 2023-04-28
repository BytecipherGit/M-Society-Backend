module.exports = app => {
  let router = require("express").Router();
  const payment = require("../controllers/payment.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");

  //  /**
  //  * @swagger
  //  * /api/payment/link:
  //  *   post:
  //  *     summary: Take payment link send
  //  *     tags:
  //  *       - Take payment link send
  //  *     parameters:
  //  *       - in: body
  //  *         description: Take payment link send
  //  *         schema:
  //  *           type: object
  //  *           required:
  //  *             - subId
  //  *           properties:
  //  *             subId:
  //  *               type: string
  //  *     responses:
  //  *       200:
  //  *         description: Take payment link send successfully.
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 data:
  //  *                   type:
  //  *                   items:
  //  *                     properties:
  //  *                       link:
  //  *                         type: string
  //  *                         example: Raju
  //  *                       order_token:
  //  *                         type: string
  //  *                         example: Indore
  //  *                       order_id:
  //  *                         type: string
  //  *                         example: day/night
  //   */
  //   router.post("/link", validateTokenMiddleware.validateToken, payment.paymentTake);

  // router.get("/paymentStatement/:order_id", validateTokenMiddleware.validateToken, payment.paymentStatement);

  // router.get("/pay/:order_id/:order_token",payment.pay)

  /**
* @swagger
* /api/payment/getSubId:
*   post:
*     summary: Take payment subId send
*     tags:
*       - Take payment
*     parameters:
*       - in: body
*         description: Take payment subId send
*         schema:
*           type: object
*           required:
*             - subId
*           properties:
*             subId:
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
  router.post("/getSubId", validateTokenMiddleware.validateToken, payment.paymeny);

  /**
* @swagger
* /api/payment/statement:
*   post:
*     summary: Statement fetch by razorpayPaymentId
*     tags:
*       - Take payment 
*     parameters:
*       - in: body
*         description: Statement fetch by razorpayPaymentId
*         schema:
*           type: object
*           required:
*             - razorpayPaymentId
*             - razorpaySubscriptionId
*           properties:
*             razorpayPaymentId:
*               type: string
*             razorpaySubscriptionId:
*               type: string
*     responses:
*       200:
*         description: Statement fetch by razorpayPaymentId
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
  router.post("/statement", validateTokenMiddleware.validateToken, payment.statement);

//   /**
// * @swagger
// * /api/payment/createPlane:
// *   post:
// *     summary: Create plane
// *     tags:
// *       - Take payment 
// *     parameters:
// *       - in: body
// *         description: Create plane
// *         schema:
// *           type: object
// *           required:
// *             - razorpayPaymentId
// *             - razorpaySubscriptionId
// *           properties:
// *             razorpayPaymentId:
// *               type: string
// *             razorpaySubscriptionId:
// *               type: string
// *     responses:
// *       200:
// *         description: Create plane
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
//   router.post("/createPlane", validateTokenMiddleware.validateToken, payment.craetePlane);

  /**
* @swagger
* /api/payment/cancelSub:
*   post:
*     summary: Cancel subscription by razorpaySubscriptionId
*     tags:
*       - Take payment 
*     parameters:
*       - in: body
*         description: Cancel subscription by razorpaySubscriptionId
*         schema:
*           type: object
*           required:
*             - razorpaySubscriptionId
*           properties:
*             razorpaySubscriptionId:
*               type: string
*     responses:
*       200:
*         description: Cancel subscription by razorpaySubscriptionId
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
  router.post("/cancelRazorpaySubscription", validateTokenMiddleware.validateToken, payment.cancel);

  /**
* @swagger
* /api/payment/getPaymentDetail:
*   post:
*     summary: Webhook url set
*     tags:
*       - Take payment 
*     parameters:
*       - in: body
*         description: Webhook url set
*         schema:
*           type: object
*           required:
*             - razorpaySubscriptionId
*           properties:
*             razorpaySubscriptionId:
*               type: string
*     responses:
*       200:
*         description: Webhook url set
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
  router.post("/getPaymentDetail", payment.test);//http://43.231.127.169:9001/api/payment/getPaymentDetail 

  /**
* @swagger
* /api/payment/currentSubOfSociety:
*   get:
*     summary: Fetch current sub of society
*     tags:
*       - Take payment 
*     parameters:
*         description: Fetch current sub of society
*     responses:
*       200:
*         description: Fetch current sub of society
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
  router.get("/currentSubOfSociety",validateTokenMiddleware.validateToken,payment.currentSub);

  /**
* @swagger
* /api/payment/history:
*   get:
*     summary: Fetch payment history of society with  pagination
*     tags:
*       - Take payment 
*     parameters:
*         description: Fetch payment history of socety with  pagination
*     responses:
*       200:
*         description: Fetch payment history of society with  pagination
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
  router.get("/history",validateTokenMiddleware.validateToken,payment.history);

/**
* @swagger
* /api/payment/historyAll:
*   get:
*     summary: Fetch all payment history with  pagination
*     tags:
*       - Take payment 
*     parameters:
*         description: Fetch all payment history with  pagination
*     responses:
*       200:
*         description: Fetch all payment history with  pagination
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
  router.get("/historyAll", validateTokenMiddleware.validateToken, payment.historyAll);

/**
* @swagger
* /api/payment/ServiceHistoryAll:
*   get:
*     summary: Fetch service provider all payment history with  pagination
*     tags:
*       - Take payment 
*     parameters:
*         description: Fetch service provider all payment history with  pagination
*     responses:
*       200:
*         description: Fetch service provider all payment history with  pagination
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type:
*                   items:
*                     properties:
*                       data:
*                         type: object
*/
  router.get("/ServiceHistoryAll", validateTokenMiddleware.validateToken, payment.Servicehistory);

  app.use("/api/payment", router);
};