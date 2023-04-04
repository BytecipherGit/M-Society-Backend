module.exports = app => {
    const Maintenance = require("../controllers/maintance.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

    /**
 * @swagger
 * /api/maintenance/:
 *   post:
 *     summary: Maintenance add.
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: body
 *         description: Maintenance add.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - description
 *             - amount
 *             - year
 *             - startMonth        
 *           properties:
 *             amount:
 *               type: number
 *             startMonth:
 *               type: number
 *             year:
 *               type: string
 *             description:
 *               type: string    
 *     responses:
 *       200:
 *         description: Maintenance add successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       amount:
 *                         type: Number
 *                         example: Amount of per month.
 *                       startMonth:
 *                         type: Number
 *                         example: 0 to 11.
 *                       endMonth:
 *                         type: Number
 *                         example: 0 to 11.
 *                       year:
 *                         type: string
 *                         example: 2023
 * 
*/
    router.post("/", validateTokenMiddleware.validateToken, Maintenance.maintanceAdd);

    /**
    * @swagger
    * /api/maintenance/:
    *   get:
    *     summary: Maintenance fetch all for society admin.
    *     tags:
    *       - Maintenance
    *     responses:
    *       200:
    *         description: Maintenance fetch all for society admin successfully.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: 
    *                   items:
    *                     properties:
    *                       amount:
    *                         type: Number
    *                         example: Amount of per month.
    *                       startMonth:
    *                         type: Number
    *                         example: 0 to 11.
    *                       endMonth:
    *                         type: Number
    *                         example: 0 to 11.
    *                       year:
    *                         type: string
    *                         example: 2023
    * 
   */
    router.get("/", validateTokenMiddleware.validateToken, Maintenance.maintanceList);

    /**
   * @swagger
   * /api/maintenance/user:
   *   get:
   *     summary: User list for take payment.
   *     tags:
   *       - Maintenance
   *     responses:
   *       200:
   *         description: User list for take payment.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       name:
   *                         type: string
   *                         example: ResidentialUser
   *                       address:
   *                         type: string
   *                         example: Hawa Bangla
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       designationId:
   *                         type: string
   *                         example:  1
   *                       houseNumber:
   *                         type: string
   *                         example: 491
   *                       societyUniqueId:
   *                         type: string
   *                         example:  HBJ7
   *                       societyId:
   *                         type: string
   *                         example: 121
   *                       status:
   *                         type: string
   *                         example:  Inactive/active
   *                       occupation:
   *                         type: string
   *                         example:  teacher
   *                       profileImage:
   *                         type: string
   *                         example: 
   * 
   */
    router.get("/user", validateTokenMiddleware.validateToken, Maintenance.user);

    /**
    * @swagger
    * /api/maintenance/takePayment:
    *   post:
    *     summary: Take Paymnet.
    *     tags:
    *       - Maintenance
    *     parameters:
    *       - in: body
    *         description: Maintenance add.
    *         schema:
    *           type: object
    *           required:
    *             - userId
    *             - maintanceId 
    *             - month 
    *             - year 
    *           properties:
    *             userId:
    *               type: string
    *             maintanceId:
    *               type: string
    *             year:
    *               type: string
    *             month:
    *               type: string 
    *     responses:
    *       200:
    *         description: Take Paymnet successfully.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: 
    *                   items:
    *                     properties:
    *                       maintanceId:
    *                         type: string
    *                         example: 63ec8378f21f95a2b46f75db
    *                       month:
    *                         type: array
    *                         example: [{"month":1,"amount":5000}]
    *                       userId:
    *                         type: string
    *                         example: 63e34e56d02c6935f489bd72
    *                       year:
    *                         type: string
    *                         example: 2023
    * 
   */
    router.post("/takePayment", validateTokenMiddleware.validateToken, Maintenance.takePayment);

    /**
   * @swagger
   * /api/maintenance/previousMonth:
   *   post:
   *     summary: Maintenance previous month fetch for take payment previous button.
   *     tags:
   *       - Maintenance
   *     parameters:
   *       - in: body
   *         description: Maintenance previous month fetch for take payment previous button.
   *         schema:
   *           type: object
   *           required:
   *             - month
   *             - year 
   *           properties:
   *             year:
   *               type: string
   *             month:
   *               type: string 
   *     responses:
   *       200:
   *         description: Maintenance previous month fetch for take payment previous button.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       amount:
   *                         type: Number
   *                         example: Amount of per month.
   *                       month:
   *                         type: Number
   *                         example: 0 to 11.
   *                       endMonth:
   *                         type: Number
   *                         example: 0 to 11.
   *                       year:
   *                         type: string
   *                         example: 2023
   * 
    */
    router.post("/previousMonth", validateTokenMiddleware.validateToken, Maintenance.maintanceget);

    /**
   * @swagger
   * /api/maintenance/paymentHistory:
   *   get:
   *     summary: Maintenance payment history fetch with pagination for receive payment list.
   *     tags:
   *       - Maintenance
   *     responses:
   *       200:
   *         description: Maintenance payment history fetch with pagination successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       user:
   *                         type: Number
   *                         example: Amount of per month.
   *                       month:
   *                         type: Number
   *                         example: 0 to 11.
   *                       amount:
   *                         type: Number
   *                         example: 1000
   *                       year:
   *                         type: string
   *                         example: 2023
   *                       transactionId:
   *                         type: string
   *                         example: SJLK253 
   * 
    */
    router.get("/paymentHistory", validateTokenMiddleware.validateToken, Maintenance.paymentHistory);

    /**
   * @swagger
   * /api/maintenance/search/:key:
   *   get:
   *     summary: Maintenance payment serach by user name and house number .
   *     tags:
   *       - Maintenance
   *     responses:
   *       200:
   *         description: Maintenance payment history fetch with pagination successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       user:
   *                         type: Number
   *                         example: Amount of per month.
   *                       month:
   *                         type: Number
   *                         example: 0 to 11.
   *                       amount:
   *                         type: Number
   *                         example: 1000
   *                       year:
   *                         type: string
   *                         example: 2023
   *                       transactionId:
   *                         type: string
   *                         example: SJLK 
   *
    */
    router.get("/transaction/search/", validateTokenMiddleware.validateToken, Maintenance.search);

    /**
       * @swagger
       * /api/maintenance/userPaymentHistory/:id:
       *   get:
       *     summary: Maintenance payment history fetch for particular user by user id .
       *     tags:
       *       - Maintenance
       *     responses:
       *       200:
       *         description: Maintenance payment history fetch for particular user successfully.
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 data:
       *                   type: 
       *                   items:
       *                     properties:
       *                       user:
       *                         type: Number
       *                         example: Amount of per month.
       *                       month:
       *                         type: Number
       *                         example: 0 to 11.
       *                       amount:
       *                         type: Number
       *                         example: 1000
       *                       year:
       *                         type: string
       *                         example: 2023
          *                       transactionId:
   *                         type: string
   *                         example: SJLK253 
       * 
        */
    router.get("/userPaymentHistory/:id", validateTokenMiddleware.validateToken, Maintenance.paymentHistoryForUser);

    /**
   * @swagger
   * /api/maintenance/payment/slip/:transactionId:
   *   get:
   *     summary: Payment slip fetch.
   *     tags:
   *       - Maintenance
   *     responses:
   *       200:
   *         description: Payment slip fetch successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       user:
   *                         type: Number
   *                         example: Amount of per month.
   *                       month:
   *                         type: Number
   *                         example: 0 to 11.
   *                       amount:
   *                         type: Number
   *                         example: 1000
   *                       year:
   *                         type: string
   *                         example: 2023
   *                       transactionId:
   *                         type: string
   *                         example: SJLK 
   *
    */
    router.get("/payment/slip/:transactionId", Maintenance.paymentslip);

    /**
  * @swagger
  * /api/maintenance/userTakePaymentMonthList/:id:
  *   get:
  *     summary: User take payment month list by user id.
  *     tags:
  *       - Maintenance
  *     responses:
  *       200:
  *         description: User take payment month list by user id successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: 
  *                   items:
  *                     properties:
  *                       user:
  *                         type: Number
  *                         example: Amount of per month.
  *                       month:
  *                         type: Number
  *                         example: 0 to 11.
  *                       amount:
  *                         type: Number
  *                         example: 1000
  *                       year:
  *                         type: string
  *                         example: 2023
  *                       transactionId:
  *                         type: string
  *                         example: SJLK 
  *
   */
    router.get("/userTakePaymentMonthList/:id", validateTokenMiddleware.validateToken, Maintenance.userpaymentlist);

    app.use("/api/maintenance", router);
};