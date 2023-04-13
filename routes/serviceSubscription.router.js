module.exports = app => {
    const ServiceSubscription = require("../controllers/serviceSubscription.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

    /**
     * @swagger
     * /api/serviceSubscription/:
     *   post:
     *     summary: ServiceSubscription add.
     *     tags:
     *       - Service Subscription
     *     parameters:
     *       - in: body
     *         description: ServiceSubscription add. 
     *         schema:
     *           type: object
     *           required:
     *             - name
     *             - duration
     *             - price 
     *           properties:
     *             name:
     *               type: string
     *             duration:
     *               type: string
     *             price:
     *               type: string
     *             status:
     *               type: string
     *     responses:
     *       200:
     *         description: ServiceSubscription add successfully.
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
     *                       id:
     *                         type: string
     *                         example: 63fdcc27fcc6e188dc9c60f8
     *                       name:
     *                         type: string
     *                         example: Free/Paid 
     *                       duration:
     *                         type: string
     *                         example: 1year 6month 
     *                       price:
     *                         type: string
     *                         example: 5000
     *                       status:
     *                         type: Enum
     *                         example:  active/Inactive
     */
    router.post("/", validateTokenMiddleware.validateToken, ServiceSubscription.add);

    /**
     * @swagger
     * /api/serviceSubscription/:
     *   put:
     *     summary: ServiceSubscription update.
     *     tags:
     *       - Service Subscription
     *     parameters:
     *       - in: body
     *         description: ServiceSubscription update. 
     *         schema:
     *           type: object
     *           required:
     *             - id
     *           properties:
     *             id:
     *               type: string
     *             name:
     *               type: string
     *             duration:
     *               type: string
     *             price:
     *               type: string
     *             status:
     *               type: string
     *     responses:
     *       200:
     *         description: ServiceSubscription update successfully.
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
     *                       id:
     *                         type: string
     *                         example: 63fdcc27fcc6e188dc9c60f8
     *                       name:
     *                         type: string
     *                         example: Free/Paid 
     *                       duration:
     *                         type: string
     *                         example: 1year 6month 
     *                       price:
     *                         type: string
     *                         example: 5000
     *                       status:
     *                         type: Enum
     *                         example:  active/Inactive
     */
    router.put("/", validateTokenMiddleware.validateToken, ServiceSubscription.updatesubscription);

    /**
    * @swagger
    * /api/serviceSubscription/:
    *   get:
    *     summary: ServiceSubscription fetch all.
    *     tags:
    *       - Service Subscription
    *     responses:
    *       200:
    *         description: ServiceSubscription fetch successfully.
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
    *                       id:
    *                         type: string
    *                         example: 63fdcc27fcc6e188dc9c60f8
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
    router.get("/", ServiceSubscription.get);

    /**
    * @swagger
    * /api/serviceSubscription/:id:
    *   get:
    *     summary: ServiceSubscription fetch by id.
    *     tags:
    *       - Service Subscription
    *     responses:
    *       200:
    *         description: ServiceSubscription fetch by id successfully.
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
    *                       id:
    *                         type: string
    *                         example: 63fdcc27fcc6e188dc9c60f8
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
    router.get("/:id", validateTokenMiddleware.validateToken, ServiceSubscription.getbyid);

    /**
     * @swagger
     * /api/serviceSubscription/:
     *   delete:
     *     summary: ServiceSubscription delete.
     *     tags:
     *       - Service Subscription
     *     parameters:
     *       - in: body
     *         description: ServiceSubscription update. 
     *         schema:
     *           type: object
     *           required:
     *             - id
     *           properties:
     *             id:
     *               type: string
     *     responses:
     *       200:
     *         description: ServiceSubscription delete successfully.
     */
    router.delete("/", validateTokenMiddleware.validateToken, ServiceSubscription.delete);

    app.use("/api/serviceSubscription", router);
}