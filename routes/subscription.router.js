module.exports = app => {
    const Subscription = require("../controllers/subscription.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

/**
 * @swagger
 * /api/subscription/:
 *   post:
 *     summary: Subscription add.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: body
 *         description: Subscription add. 
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
 *             support: 
 *               type: object
 *     responses:
 *       200:
 *         description: Subscription add successfully.
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
  router.post("/", validateTokenMiddleware.validateToken, Subscription.add);

/**
 * @swagger
 * /api/subscription/:
 *   put:
 *     summary: Subscription update.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: body
 *         description: Subscription update. 
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
 *         description: Subscription update successfully.
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
  router.put("/", validateTokenMiddleware.validateToken, Subscription.updatesubscription);

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
 router.get("/", Subscription.get);

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
 router.get("/:id", validateTokenMiddleware.validateToken, Subscription.getbyid);

/**
 * @swagger
 * /api/subscription/:
 *   delete:
 *     summary: Subscription delete.
 *     tags:
 *       - Subscription
 *     parameters:
 *       - in: body
 *         description: Subscription update. 
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *     responses:
 *       200:
 *         description: Subscription delete successfully.
 */
 router.delete("/", validateTokenMiddleware.validateToken, Subscription.delete);

  app.use("/api/subscription", router);
}