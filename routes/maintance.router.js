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
 *             amt:
 *               type: Number
 *             startMonth:
 *               type: Number
 *             endMonth:
 *               type: Number
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
 *                       amt:
 *                         amt: Number
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
 *     summary: Maintance fetch.
 *     tags:
 *       - Maintance
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
 *                       amt:
 *                         amt: Number
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
 *     summary: User fetch.
 *     tags:
 *       - Maintance
 *     parameters:
 *       - in: body
 *         description: Maintance add.
 *         schema:
 *           type: object
 *           required:
 *             - amt
 *             - month
 *             - userId
 *             - maitanceId  
 *           properties:
 *             amt:
 *               type: Number
 *             userId:
 *               type: string
 *             maitanceId:
 *               type: string
 *             month:
 *               type: string
 *     responses:
 *       200:
 *         description: User add successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       amt:
 *                         amt: Number
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
    router.get("/user", validateTokenMiddleware.validateToken, Maintance.user);

    /**
 * @swagger
 * /api/maintance/takePayment:
 *   post:
 *     summary: Take Paymnet.
 *     tags:
 *       - Maintance
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
 *                       amt:
 *                         amt: Number
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
    router.post("/takePayment", validateTokenMiddleware.validateToken, Maintance.takePayment);

    router.get("/list",validateTokenMiddleware.validateToken,Maintance.maintanceget);
    app.use("/api/maintance", router);
};