module.exports = app => {
  const Complaint = require("../controllers/complaint.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();
  const multer = require('multer');
  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads/complaint',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });
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
   *             attachedImage:
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
   *                         example: loud neighbors
   *                       applicantName:
   *                         type: string
   *                         example: Ram
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       description:
   *                         type: string
   *                         example: Almost anywhere you live, you're going to have to deal with neighbors
   *                       attachedImage:
   *                         type: string
   *                         example: optional
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/", validateTokenMiddleware.validateToken, upload.single('attachedImage'), Complaint.add);

  /**
 * @swagger
 * /api/complaint/all:
 *   get:
 *     summary: Complaint fetch all with pagination (complaint listing for society admin).
 *     tags:
 *       - Complaint
 *     responses:
 *       200:
 *         description: Complaint fetch with pagination successfully.
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
 *                         example: loud neighbors
 *                       applicantName:
 *                         type: string
 *                         example: Ram
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       description:
 *                         type: string
 *                         example: Almost anywhere you live, you're going to have to deal with neighbors
 *                       attachedImage:
 *                         type: string
 *                         example: optional
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
   *                         example: loud neighbors
   *                       applicantName:
   *                         type: string
   *                         example: Ram
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       description:
   *                         type: string
   *                         example: Almost anywhere you live, you're going to have to deal with neighbors
   *                       attachedImage:
   *                         type: string
   *                         example: optional
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Complaint.get);

  /**
  * @swagger
  * /api/complaint/search/:complainTitle:
  *   get:
  *     summary: Complaint search by complain title with pagination for society admin.
  *     tags:
  *       - Complaint
  *     responses:
  *       200:
  *         description: Complaint search by complain title with pagination.
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
  router.get("/search/:complainTitle", validateTokenMiddleware.validateToken, Complaint.search); 

  /**
 * @swagger
 * /api/complaint/resident/all:
 *   get:
 *     summary: Complaint fetch for residentialUser (complaint listing for residential user).
 *     tags:
 *       - Complaint
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
 *                         example: loud neighbors
 *                       applicantName:
 *                         type: string
 *                         example: Ram
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       description:
 *                         type: string
 *                         example: Almost anywhere you live, you're going to have to deal with neighbors
 *                       attachedImage:
 *                         type: string
 *                         example: optional
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/resident/all", validateTokenMiddleware.validateToken, Complaint.allcomplain);

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
   *             description:
   *               type: string
   *             status:
   *               type: string
   *             attachedImage:
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
   *                         example: loud neighbors
   *                       applicantName:
   *                         type: string
   *                         example: Ram
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       description:
   *                         type: string
   *                         example: Almost anywhere you live, you're going to have to deal with neighbors
   *                       attachedImage:
   *                         type: string
   *                         example: optional
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.single('attachedImage') ,Complaint.update);

  /**
   * @swagger
   * /api/complaint/byAdmin:
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
   *             description:
   *               type: string
   *             status:
   *               type: string
   *             attachedImage:
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
   *                         example: loud neighbors
   *                       applicantName:
   *                         type: string
   *                         example: Ram
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       description:
   *                         type: string
   *                         example: Almost anywhere you live, you're going to have to deal with neighbors
   *                       attachedImage:
   *                         type: string
   *                         example: optional
   *                       status:
   *                         type: string
   *                         example: cancel/new/inprogress/resolved/reopen
 */
  router.put("/byAdmin", validateTokenMiddleware.validateToken, upload.single('attachedImage'), Complaint.byadmin);
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