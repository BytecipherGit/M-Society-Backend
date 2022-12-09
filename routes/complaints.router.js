module.exports = app => {
  const Complaint = require("../controllers/complaint.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  /**
   * @swagger
   * /api/complaint/:
   *   post:
   *     summary: Complaint add.
   *     tags:
   *       - Complaint
   *     parameters:
   *       - in: body
   *         description: Complaint add.
   *         schema:
   *           type: object
   *           required:
   *             - name
   *           properties:
   *             complainTitle:
   *               type: string
   *             applicantName:
   *               type: string
   *             phoneNumber:
   *               type: string
   *             description:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Complaint add successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       complainTitle:
   *                         type: string
   *                         example: 
   *                       applicantName:
   *                         type: string
   *                         example: 
   *                       phoneNumber:
   *                         type: string
   *                         example: 
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/", validateTokenMiddleware.validateToken, Complaint.add);

  /**
   * @swagger
   * /api/complaint/:
   *   put:
   *     summary: Complaint update.
   *     tags:
   *       - Complaint
   *     parameters:
   *       - in: body
   *         description: Complaint update.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string 
   *             complainTitle:
   *               type: string
   *             applicantName:
   *               type: string
   *             phoneNumber:
   *               type: string
   *             description:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Complaint update successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       complainTitle:
   *                         type: string
   *                         example: 
   *                       applicantName:
   *                         type: string
   *                         example: 
   *                       phoneNumber:
   *                         type: string
   *                         example: 
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, Complaint.update);

  /**
 * @swagger
 * /api/complaint/all:
 *   get:
 *     summary: Complaint fetch all.
 *     tags:
 *       - Complaint
 *     responses:
 *       200:
 *         description: Complaint fetch successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       complainTitle:
 *                         type: string
 *                         example: 
 *                       applicantName:
 *                         type: string
 *                         example: 
 *                       phoneNumber:
 *                         type: string
 *                         example: 
 *                       description:
 *                         type: string
 *                         example: 
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/all", validateTokenMiddleware.validateToken, Complaint.all);

  /**
   * @swagger
   * /api/complaint/:id:
   *   get:
   *     summary: Complaint fetch by id.
   *     tags:
   *       - Complaint
   *     responses:
   *       200:
   *         description: Complaint fetch successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   items:
   *                     properties:
   *                       complainTitle:
   *                         type: string
   *                         example: 
   *                       applicantName:
   *                         type: string
   *                         example: 
   *                       phoneNumber:
   *                         type: string
   *                         example: 
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Complaint.get);

  /**
      * @swagger
      * /api/complaint/:
      *   delete:
      *     summary: Complaint delete.
      *     tags:
      *       - Complaint
      *     parameters:
      *       - in: body
      *         description: Complaint delete.
      *         schema:
      *           type: object
      *           required:
      *             - id
      *           properties:
      *             id:
      *               type: string 
      *     responses:
      *       200:
      *         description: Complaint delete successfully.
    */
  router.delete("/", validateTokenMiddleware.validateToken, Complaint.delete);

  app.use("/api/complaint", router);
};