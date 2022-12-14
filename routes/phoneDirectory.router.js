module.exports = app => {
  let router = require("express").Router();
  const phoneBooK = require("../controllers/phoneDirectory.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  /**
  * @swagger
  * /api/directory/:
  *   post:
  *     summary: Phone directory add.
  *     tags:
  *       - Phone Directory
  *     parameters:
  *       - in: body
  *         description: Phone directory add.
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
  *         description: Phone directory add successfully.
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
   * /api/directory/all:
   *   get:
   *     summary: Phone directory fetch (directory listing for society admin).
   *     tags:
   *       - Phone Directory
   *     responses:
   *       200:
   *         description: Phone directory fetch successfully.
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
   * /api/directory/:id:
   *   get:
   *     summary: Phone directory fetch by id.
   *     tags:
   *       - Phone Directory
   *     responses:
   *       200:
   *         description: Phone directory fetch successfully.
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
  * /api/directory/search/:profession:
  *   get:
  *     summary: Phone directory search by profession.
  *     tags:
  *       - Phone Directory
  *     responses:
  *       200:
  *         description: Phone directory search by profession successfully.
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
  router.get("/search/:profession", validateTokenMiddleware.validateToken, phoneBooK.search);

  /**
* @swagger
* /api/directory/resident/all:
*   get:
*     summary: Phone directory fetch for residentialUser by societyId (directory listing for residential user).
*     tags:
*       - Phone Directory
*     responses:
*       200:
*         description: Phone directory fetch by societyId successfully.
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
  router.get("/resident/all", validateTokenMiddleware.validateToken, phoneBooK.allphone);
  
  /**
* @swagger
* /api/directory/:
*   put:
*     summary: Phone directory updated.
*     tags:
*       - Phone Directory
*     parameters:
*       - in: body
*         description: Phone directory updated.
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
*         description: Phone directory add successfully.
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
* /api/directory/:
*   delete:
*     summary: Phone directory delete.
*     tags:
*       - Phone Directory
*     parameters:
*       - in: body
*         description: Phone directory delete.
*         schema:
*           type: object
*           required:
*             - id
*           properties:
*             id:
*               type: string
*     responses:
*       200:
*         description: Phone directory delete successfully.
*/
  router.delete("/", validateTokenMiddleware.validateToken, phoneBooK.delete);

  app.use("/api/directory", router);
}