module.exports = app => {
    let router = require("express").Router();
    const payment = require("../controllers/payment.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");

 /**
 * @swagger
 * /api/payment/link:
 *   post:
 *     summary: Take payment link send
 *     tags:
 *       - Take payment link send
 *     parameters:
 *       - in: body
 *         description: Take payment link send
 *         schema:
 *           type: object
 *           required:
 *             - subId
 *           properties:
 *             subId:
 *               type: string
 *     responses:
 *       200:
 *         description: Take payment link send successfully.
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
    router.post("/link", validateTokenMiddleware.validateToken, payment.paymentTake);

  router.get("/paymentStatement/:order_id", validateTokenMiddleware.validateToken, payment.paymentStatement);

    // router.get("/pay/:order_id/:order_token",payment.pay)

    app.use("/api/payment", router);
};