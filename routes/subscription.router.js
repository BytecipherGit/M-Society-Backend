module.exports = app => {
    const Subscription = require("../controllers/subscription.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();
    /**
     * @swagger
     * /api/subscription/:
     *   get:
     *     summary: Subscription fetch all.
     *     tags:
     *       - Subscription
     *     responses:
     *       200:
     *         description: Subscription fetch successfully.
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
     *                       name:
     *                         type: string
     *                         example: Free
     *                       price:
     *                         type: number
     *                         example: 0 
     *                       duration:
     *                         type: string
     *                         example: 1 year
     *                       status:
     *                         type: string
     *                         example: active/Inactive
    */
    router.get("/", validateTokenMiddleware.validateToken, Subscription.get);
    /**
         * @swagger
         * /api/subscription/:id:
         *   get:
         *     summary: Subscription fetch by id.
         *     tags:
         *       - Subscription
         *     responses:
         *       200:
         *         description: Subscription fetch by id successfully.
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
         *                       name:
         *                         type: string
         *                         example: Free
         *                       price:
         *                         type: number
         *                         example: 0 
         *                       duration:
         *                         type: string
         *                         example: 1 year
         *                       status:
         *                         type: string
         *                         example: active/Inactive
        */
    router.get("/:id", validateTokenMiddleware.validateToken, Subscription.getbyid);
    app.use("/api/subscription", router);
}