module.exports = app => {
  const Documentation = require("../controllers/documentation.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();
  const multer = require('multer');

  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
   * @swagger
   * /api/documentation/:
   *   post:
   *     summary: Documentation add.
   *     tags:
   *       - Documentation
   *     parameters:
   *       - in: body
   *         description: Documentation add.
   *         schema:
   *           type: object
   *           required:
   *             - documentName
   *           properties:
   *             documentName:
   *               type: string
   *             description:
   *               type: string
   *             documentImageFile:
   *               type: string
   *     responses:
   *       200:
   *         description: Documentation add successfully.
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
   *                         example: 639978fdb1fa2c489173964e
   *                       societyId:
   *                         type: string
   *                         example: 121
   *                       documentName:
   *                         type: string
   *                         example: image.pdf
   *                       documentImageFile:
   *                         type: string
   *                         example: image.pdf
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/", validateTokenMiddleware.validateToken, upload.single('documentfile'), Documentation.add);

  /**
   * @swagger
   * /api/documentation/:
   *   put:
   *     summary: Documentation update.
   *     tags:
   *       - Documentation
   *     parameters:
   *       - in: body
   *         description: Documentation update.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *              type: string
   *             documentName:
   *               type: string
   *             description:
   *               type: string
   *             documentImageFile:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Documentation update successfully.
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
   *                         example: 639978fdb1fa2c489173964e
   *                       societyId:
   *                         type: string
   *                         example: 121
   *                       documentName:
   *                         type: string
   *                         example: image.pdf
   *                       documentImageFile:
   *                         type: string
   *                         example: image.pdf
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.single('documentfile'), Documentation.update);

  /**
 * @swagger
 * /api/documentation/all:
 *   get:
 *     summary: Documentation fetch all.
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: Documentation fetch successfully.
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
 *                       societyAdminId:
 *                         type: string
 *                         example: 639978fdb1fa2c489173964e
 *                       societyId:
 *                         type: string
 *                         example: 121
 *                       documentName:
 *                         type: string
 *                         example: file
 *                       documentImageFile:
 *                         type: string
 *                         example: image.pdf
 *                       description:
 *                         type: string
 *                         example: 
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/all", validateTokenMiddleware.validateToken, Documentation.all);

  /**
   * @swagger
   * /api/documentation/:id:
   *   get:
   *     summary: Documentatione fetch by id.
   *     tags:
   *       - Documentation
   *     responses:
   *       200:
   *         description: Documentation fetch successfully.
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
   *                       societyAdminId:
   *                         type: string
   *                         example: 639978fdb1fa2c489173964e
   *                       societyId:
   *                         type: string
   *                         example: 121
   *                       documentName:
   *                         type: string
   *                         example: file
   *                       documentImageFile:
   *                         type: string
   *                         example: image.pdf
   *                       description:
   *                         type: string
   *                         example: 
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Documentation.get);

  /**
      * @swagger
      * /api/documentation/:
      *   delete:
      *     summary: Documentation delete.
      *     tags:
      *       - Documentation
      *     parameters:
      *       - in: body
      *         description: Documentation delete.
      *         schema:
      *           type: object
      *           required:
      *             - id
      *           properties:
      *             id:
      *               type: string 
      *     responses:
      *       200:
      *         description: Documentation delete successfully.
    */
  router.delete("/", validateTokenMiddleware.validateToken, Documentation.delete);

  app.use("/api/documentation", router);
};