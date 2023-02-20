module.exports = app => {
  const Document = require("../controllers/document.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();
  const multer = require('multer');
  const path = require("path");
  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads/document',
    filename: (request, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
   * @swagger
   * /api/document/:
   *   post:
   *     summary: Document add.
   *     tags:
   *       - Document
   *     parameters:
   *       - in: body
   *         description: Document add.
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
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Document add successfully.
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
   *                         example: Registry
   *                       documentImageFile:
   *                         type: string
   *                         example: file.pdf
   *                       description:
   *                         type: string
   *                         example: it is registry file of society
   *                       status:
   *                         type: string
   *                         example: draft/publish
 */
  router.post("/", validateTokenMiddleware.validateToken, upload.single('documentImageFile'), Document.add);

  /**
 * @swagger
 * /api/document/all:
 *   get:
 *     summary: Document fetch all with pagination (document listing for society admin).
 *     tags:
 *       - Document
 *     responses:
 *       200:
 *         description: Document fetch with pagination successfully.
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
 *                         example: Registry
 *                       documentImageFile:
 *                         type: string
 *                         example: file.pdf
 *                       description:
 *                         type: string
 *                         example: it is registry file of society
 *                       status:
 *                         type: string
 *                         example: draft/publish
*/
  router.get("/all", validateTokenMiddleware.validateToken, Document.all);

  /**
   * @swagger
   * /api/document/:id:
   *   get:
   *     summary: Documente fetch by id.
   *     tags:
   *       - Document
   *     responses:
   *       200:
   *         description: Document fetch successfully.
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
   *                         example: Registry
   *                       documentImageFile:
   *                         type: string
   *                         example: file.pdf
   *                       description:
   *                         type: string
   *                         example: it is registry file of society
   *                       status:
   *                         type: string
   *                         example: draft/publish
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Document.get);
 
  /**
 * @swagger
 * /api/document/search/:documentName:
 *   get:
 *     summary: Documente search by documentName with pagination.
 *     tags:
 *       - Document
 *     responses:
 *       200:
 *         description: Document search by documentName with pagination.
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
 *                         example: Registry
 *                       documentImageFile:
 *                         type: string
 *                         example: file.pdf
 *                       description:
 *                         type: string
 *                         example: it is registry file of society
 *                       status:
 *                         type: string
 *                         example: draft/publish
*/
  router.get("/search/:documentName", validateTokenMiddleware.validateToken, Document.search);
  
  /**
   * @swagger
   * /api/document/:
   *   put:
   *     summary: Document update.
   *     tags:
   *       - Document
   *     parameters:
   *       - in: body
   *         description: Document update.
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
   *         description: Document update successfully.
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
   *                         example: Registry
   *                       documentImageFile:
   *                         type: string
   *                         example: file.pdf
   *                       description:
   *                         type: string
   *                         example: it is registry file of society
   *                       status:
   *                         type: string
   *                         example: draft/publish
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.single('documentImageFile'), Document.update);

  /**
      * @swagger
      * /api/document/:
      *   delete:
      *     summary: Document delete.
      *     tags:
      *       - Document
      *     parameters:
      *       - in: body
      *         description: Document delete.
      *         schema:
      *           type: object
      *           required:
      *             - id
      *           properties:
      *             id:
      *               type: string 
      *     responses:
      *       200:
      *         description: Document delete successfully.
    */
  router.delete("/", validateTokenMiddleware.validateToken, Document.delete);

  app.use("/api/document", router);
};