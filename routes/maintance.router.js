module.exports = app => {
    const Maintance = require("../controllers/maintance.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

    /**
 * @swagger
 * /api/maintance/:
 *   post:
 *     summary: Maintance add.
 *     tags:
 *       - Maintance
 *     parameters:
 *       - in: body
 *         description: Maintance add.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             amount:
 *               type: number
 *             startMonth:
 *               type: number
 *             endMonth:
 *               type: number
 *             year:
 *               type: string
 *     responses:
 *       200:
 *         description: Maintance add successfully.
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
    router.post("/", validateTokenMiddleware.validateToken, Maintance.maintanceAdd);

 /**
 * @swagger
 * /api/maintance/:
 *   get:
 *     summary: Maintance fetch all for society admin.
 *     tags:
 *       - Maintance
 *     responses:
 *       200:
 *         description: Maintance fetch all for society admin successfully.
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
    router.get("/", validateTokenMiddleware.validateToken, Maintance.maintanceList);

 /**
* @swagger
* /api/maintance/user:
*   get:
*     summary: User list for take payment.
*     tags:
*       - Maintance
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
    router.get("/user", validateTokenMiddleware.validateToken, Maintance.user);

 /**
 * @swagger
 * /api/maintance/takePayment:
 *   post:
 *     summary: Take Paymnet.
 *     tags:
 *       - Maintance
 *     parameters:
 *       - in: body
 *         description: Maintance add.
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
    router.post("/takePayment", validateTokenMiddleware.validateToken, Maintance.takePayment);

 /**
* @swagger
* /api/maintance/details:
*   get:
*     summary: Maintance details fetch for take payment.
*     tags:
*       - Maintance
*     responses:
*       200:
*         description: Maintance details fetch for take payment.
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
 router.get("/details",validateTokenMiddleware.validateToken,Maintance.maintanceget);

 /**
* @swagger
* /api/maintance/paymentHistory:
*   get:
*     summary: Maintance payment history fetch with pagination for receive payment list.
*     tags:
*       - Maintance
*     responses:
*       200:
*         description: Maintance payment history fetch with pagination successfully.
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
* 
 */
router.get("/paymentHistory",validateTokenMiddleware.validateToken,Maintance.paymentHistory);

/**
    * @swagger
    * /api/maintance/search/:key:
    *   get:
    *     summary: Maintance payment serach by user name and house number .
    *     tags:
    *       - Maintance
    *     responses:
    *       200:
    *         description: Maintance payment history fetch with pagination successfully.
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
    * 
     */
 router.get("/search/:key", validateTokenMiddleware.validateToken, Maintance.search);
  app.use("/api/maintance", router);
};