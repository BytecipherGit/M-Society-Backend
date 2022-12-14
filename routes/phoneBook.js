module.exports = app => {
  let router = require("express").Router();
  const phoneBooK = require("../controllers/phoneBokk.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  /**
  * @swagger
  * /api/phoneBooK/:
  *   post:
  *     summary: Phone book add.
  *     tags:
  *       - Phone Book
  *     parameters:
  *       - in: body
  *         description: Phone book add.
  *         schema:
  *           type: object
  *           required:
  *             - name
  *             - phoneNumber
  *             - profession
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
  *         description: Phone book add successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: 
  *                   items:
  *                     properties:
  *                       societyAdminId:
  *                         type: string
  *                         example: 63999e0ce5e60462a407c868
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
*     summary: Phone book updated.
*     tags:
*       - Phone Book
*     parameters:
*       - in: body
*         description: Phone book updated.
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
*         description: Phone book add successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
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
   * /api/phoneBooK/all:
   *   get:
   *     summary: Phone book fetch.
   *     tags:
   *       - Phone Book
   *     responses:
   *       200:
   *         description: Phone book fetch successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       societyAdminId:
   *                         type: string
   *                         example: 63999e0ce5e60462a407c868
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
  router.get("/all", validateTokenMiddleware.validateToken, phoneBooK.all);

  /**
   * @swagger
   * /api/phoneBooK/:id:
   *   get:
   *     summary: Phone book fetch by id.
   *     tags:
   *       - Phone Book
   *     parameters:
   *       - in: body
   *         description: Phone book fetch by id.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string
   *     responses:
   *       200:
   *         description: Phone book fetch successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       societyAdminId:
   *                         type: string
   *                         example: 63999e0ce5e60462a407c868
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
*     summary: Phone book delete.
*     tags:
*       - Phone Book
*     parameters:
*       - in: body
*         description: Phone book delete.
*         schema:
*           type: object
*           required:
*             - id
*           properties:
*             id:
*               type: string
*     responses:
*       200:
*         description: Phone book delete successfully.
*/
  router.delete("/", validateTokenMiddleware.validateToken, phoneBooK.delete);

  app.use("/api/phoneBooK", router);
}