module.exports = app => {
    let router = require("express").Router();
    const phoneBooK = require("../controllers/phoneBokk.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    /**
    * @swagger
    * /api/phoneBooK/:
    *   post:
    *     summary: Phone Book add.
    *     tags:
    *       - Phone Book
    *     parameters:
    *       - in: body
    *         description: Phone Book add.
    *         schema:
    *           type: object
    *           required:
    *             - name
    *           properties:
    *             name:
    *               type: string
    *             address:
    *               type: string
    *             phoneNumber:
    *               type: string
    *             profession:
    *               type: string
    *             status:
    *               type: string
    *     responses:
    *       200:
    *         description: Phone Book add successfully.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: 
    *                   items:
    *                     properties:
    *                       name:
    *                         type: string
    *                         example: Ramu
    *                       address:
    *                         type: string
    *                         example: Palasiya
    *                       phoneNumber:
    *                         type: string
    *                         example: 1234567891
    *                       profession:
    *                         type: string
    *                         example: Plumber
    *                       status:
    *                         type: string
    *                         example: active/Inactive
    */
    router.post("/", validateTokenMiddleware.validateToken, phoneBooK.add);

    /**
 * @swagger
 * /api/phoneBooK/:
 *   put:
 *     summary: Phone Book updated.
 *     tags:
 *       - Phone Book
 *     parameters:
 *       - in: body
 *         description: Phone Book updated.
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             profession:
 *               type: string
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: Phone Book add successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Ramu
 *                       address:
 *                         type: string
 *                         example: Palasiya
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       profession:
 *                         type: string
 *                         example: Plumber
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
    router.put("/", validateTokenMiddleware.validateToken, phoneBooK.update);
    /**
     * @swagger
     * /api/phoneBooK/:
     *   get:
     *     summary: Phone Book fetch.
     *     tags:
     *       - Phone Book
     *     parameters:
     *       - in: body
     *         description: Phone Book fetch.
     *         schema:
     *           type: object
     *           required:
     *             - id
     *           properties:
     *             id:
     *               type: string
     *     responses:
     *       200:
     *         description: Phone Book add successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: 
     *                   items:
     *                     properties:
     *                       name:
     *                         type: string
     *                         example: Ramu
     *                       address:
     *                         type: string
     *                         example: Palasiya
     *                       phoneNumber:
     *                         type: string
     *                         example: 1234567891
     *                       profession:
     *                         type: string
     *                         example: Plumber
     *                       status:
     *                         type: string
     *                         example: active/Inactive
   */
    router.get("/:id", validateTokenMiddleware.validateToken, phoneBooK.get);

    /**
 * @swagger
 * /api/phoneBooK/:
 *   delete:
 *     summary: Phone Book delete.
 *     tags:
 *       - Phone Book
 *     parameters:
 *       - in: body
 *         description: Phone Book delete.
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *     responses:
 *       200:
 *         description: Phone Book delete successfully.
*/
    router.delete("/", validateTokenMiddleware.validateToken, phoneBooK.delete);

    app.use("/api/phoneBooK", router);
}