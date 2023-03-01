module.exports = app => {
  const Guard = require("../controllers/guard.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();
  const multer = require('multer');
  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads/guard',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });
  /**
 * @swagger
 * /api/guard/:
 *   post:
 *     summary: Guard add.
 *     tags:
 *       - Guard
 *     parameters:
 *       - in: body
 *         description: Guard add.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - dob
 *             - phoneNumber
 *             - address
 *             - shift
 *             - joiningDate
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             profileImage:
 *               type: string
 *             dob:
 *               type: date
 *             shift:
 *               type: string
 *             countryCode: 
 *               type: string
 *             joiningDate:
 *                type: date
 *     responses:
 *       200:
 *         description: Guard add successfully.
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
 *                         example: Raju
 *                       address:
 *                         type: string
 *                         example: Indore
 *                       shift:
 *                         type: string
 *                         example: day/night
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       dob:
 *                         type: date
 *                         example: date of birth
 *                       profileImage:
 *                         type: string
 *                         example: optional
 *                       status:
 *                         type: string
 *                         example: active/Inactive
 *                       countryCode: 
 *                         type: string  
 *                         example: +91
 *                       joiningDate: 
 *                         type: date  
 *                         example: 25/02/23   
  */
  router.post("/", validateTokenMiddleware.validateToken, upload.any(), Guard.add);

 /**
* @swagger
* /api/guard/:
*   get:
*     summary: Guard fetch all with pagination (Guard listing for society admin).
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch with pagination successfully.
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
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       dob:
*                         type: date
*                         example: date of birth
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       joiningDate: 
*                         type: date  
*                         example: 25/02/23   
 */
  router.get("/", validateTokenMiddleware.validateToken, Guard.all);

 /**
* @swagger
* /api/guard/:id:
*   get:
*     summary: Guard fetch by id.
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   items:
*                     properties:
*                       name:
*                         type: string
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       dob:
*                         type: date
*                         example: date of birth
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       joiningDate: 
*                         type: date  
*                         example: 25/02/23   
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Guard.get);

 /**
* @swagger
* /api/guard/:
*   put:
*     summary: Guard update.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard update.
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
*             profileImage:
*               type: string
*             dob:
*               type: date
*             shift:
*               type: string
*             status:
*                type: string
*             countryCode: 
*               type: string
*             joiningDate:
*                type: date
*     responses:
*       200:
*         description: Guard update successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       name:
*                         type: string
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       dob:
*                         type: date
*                         example: date of birth
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
*                       countryCode: 
*                         type: string  
*                         example: +91  
*                       joiningDate: 
*                         type: date  
*                         example: 25/02/23  
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.any(), Guard.update);

 /**
* @swagger
* /api/guard/:
*   delete:
*     summary: Guard delete.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard delete.
*         schema:
*           type: object
*           required:
*             - id
*           properties:
*             id:
*               type: string 
*     responses:
*       200:
*         description: Guard delete successfully.
  */
  router.delete("/", validateTokenMiddleware.validateToken, Guard.delete);

 router.post("/login",Guard.login);

 router.post("/sendOtp",Guard.sendotp);

 router.post("/setNewPassword",Guard.ForgetPassword);
 
 router.post("/changePassword",validateTokenMiddleware.validateToken,Guard.passwordChange);

 router.put("/profileUpdate", validateTokenMiddleware.validateToken, upload.any(), Guard.updateGuard);
  app.use("/api/guard", router);
};