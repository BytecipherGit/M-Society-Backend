module.exports = app => {
  const designation = require("../controllers/designation.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  /**
   * @swagger
   * /api/designation/:
   *   post:
   *     summary: Designation add.
   *     tags:
   *       - Designation
   *     parameters:
   *       - in: body
   *         description: Designation add.
   *         schema:
   *           type: object
   *           required:
   *             - name
   *           properties:
   *             name:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Designation add successfully.
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
   *                         example: admin
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/", validateTokenMiddleware.validateToken, designation.add);

  /**
   * @swagger
   * /api/designation/:
   *   delete:
   *     summary: Designation delete.
   *     tags:
   *       - Designation
   *     parameters:
   *       - in: body
   *         description: Designation delete.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string 
   *     responses:
   *       200:
   *         description: Designation delete successfully.
 */
  router.delete("/", validateTokenMiddleware.validateToken, designation.delete);

  /**
   * @swagger
   * /api/designation/:
   *   put:
   *     summary: Designation update.
   *     tags:
   *       - Designation
   *     parameters:
   *       - in: body
   *         description: Designation update.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             name:
   *               type: string
   *             id:
   *               type: string 
   *             status:
   *               type: string 
   *     responses:
   *       200:
   *         description: Designation update successfully.
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
   *                         example: admin
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, designation.updateDesignation);

  /**
 * @swagger
 * /api/designation/all:
 *   get:
 *     summary: Designation get all.
 *     tags:
 *       - Designation
 *     responses:
 *       200:
 *         description: Designation fetch successfully.
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
 *                         example: admin
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/all", validateTokenMiddleware.validateToken, designation.all);

  /**
   * @swagger
   * /api/designation/:id:
   *   get:
   *     summary: Designation get by id.
   *     tags:
   *       - Designation
   *     responses:
   *       200:
   *         description: Designation get successfully.
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
   *                         example: admin
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, designation.get);


  app.use("/api/designation", router);
};