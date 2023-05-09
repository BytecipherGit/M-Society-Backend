module.exports = (app) => {
    let router = require("express").Router();
    const validateTokenMiddleware = require("../middleware/validateToken");
    const Support = require("../controllers/support.controller");


  /**
    * @swagger
    * /api/support/society:
    *   post:
    *     summary: Support used by society adimn
    *     tags:
    *       - Support
    *     parameters:
    *       - in: body
    *         description: Support used by society adimn
    *         schema:
    *           type: object
    *           required:
    *             - type
    *             - chat
    *           properties:
    *             type:
    *               type: string
    *             chat:
    *               type: object
    *     responses:
    *       200:
    *         description: Support used by society adimn
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: 
    *                   items:
    *                     type: object
    *                     properties:
    *                       type:
    *                         type: string
    *                         example: email/chat/contact
    *                       chat:
    *                         type: object
    *                         example: {'subject':"",'text':""}
    *                       status:
    *                         type: string
    *                         example: new/inProgess/resolved
 */
    router.post('/society', validateTokenMiddleware.validateToken, Support.add);
    app.use('/api/support', router);
}