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
* /api/guard/app/all:
*   get:
*     summary: Guard fetch all for App side.
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch for App side successfully.
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
  router.get("/app/all", validateTokenMiddleware.validateToken, Guard.Appall);

  /**
* @swagger
* /api/guard/app/list:
*   get:
*     summary: Guard fetch all for Guard App side v2
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch for Guard App side successfully.
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
  router.get("/app/list", validateTokenMiddleware.validateToken, Guard.guardAppall);

/**
* @swagger
* /api/guard/setting:
*   get:
*     summary: Guard setting fetch
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard setting fetch successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyId:
*                         type: string
*                         example: 
*                       guardApproveSetting:
*                         type: string
*                         example: true/false 
*/
  router.get("/setting", validateTokenMiddleware.validateToken, Guard.setting);

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

 /**
 * @swagger
 * /api/guard/login:
 *   post:
 *     summary: Guard login.
 *     tags:
 *       - Guard
 *     parameters:
 *       - in: body
 *         description: Guard login.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - password
 *             - countryCode
 *           properties:
 *             password:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             countryCode: 
 *               type: string
 *             deviceToken:
 *               type: string
 *             deviceType: 
 *               type: string
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
 router.post("/login",Guard.login);
 
/**
  * @swagger
  * /api/guard/sendOtp:
  *   post:
  *     summary: Guard send otp.
  *     tags:
  *       - Guard
  *     parameters:
  *       - in: body
  *         description: Guard send otp to phone number.
  *         schema:
  *           type: object
  *           required:
  *             - phoneNumber
  *             - countryCode
  *           properties:
  *             phoneNumber:
  *               type: string
  *             countryCode: 
  *               type: string
  *     responses:
  *       200:
  *         description: Guard send otp to phone number successfully.
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
  *                       otp:
  *                         type: string
  *                         example: 1354
*/
 router.post("/sendOtp",Guard.sendotp);

  /**
 * @swagger
 * /api/guard/setNewPassword:
 *   post:
 *     summary: Guard password updated.
 *     tags:
 *       - Guard
 *     parameters:
 *       - in: body
 *         description: Guard password updated.
 *         schema:
 *           type: object
 *           required:
 *             - otp
 *             - newPassword
 *             - countryCode
 *             - phoneNumber
 *           properties:
 *             otp:
 *               type: string
 *             newPassword:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             countryCode: 
 *               type: string
 *     responses:
 *       200:
 *         description: Guard password updated .
 */
 router.post("/setNewPassword",Guard.ForgetPassword);
 
/**
* @swagger
* /api/guard/changePassword:
*   post:
*     summary: Guard password changed.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard password changed.
*         schema:
*           type: object
*           required:
*             - oldPassword
*             - newPassword
*           properties:
*             oldPassword:
*               type: string
*             newPassword:
*               type: string
*     responses:
*       200:
*         description: Guard password changed successfully.
*/
 router.post("/changePassword",validateTokenMiddleware.validateToken,Guard.passwordChange);

 /**
 * @swagger
 * /api/guard/profileUpdate:
 *   put:
 *     summary: Guard profile update.
 *     tags:
 *       - Guard
 *     parameters:
 *       - in: body
 *         description: Guard profile update successfully.
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
 *             profileImage:
 *               type: string
 *             dob:
 *               type: string
 *     responses:
 *       200:
 *         description: Guard profile update successfully.
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
 router.put("/profileUpdate", validateTokenMiddleware.validateToken, upload.any(), Guard.updateGuard);

  /**
  * @swagger
  * /api/guard/logout:
  *   delete:
  *     summary: Logout the guard from the application
  *     tags:
  *       - Guard
  *     security:
  *       - apiKeyAuth: []
  *     parameters:
  *       - in: body
  *         description: access and refresh token of the loggedin user
  *         schema:
  *           type: object
  *           required:
  *             - refresh_token
  *             - token
  *           properties:
  *             refresh_token:
  *               type: string
  *             token:
  *               type: string
  *     responses:
  *       200:
  *         description: Logout the guard from the application.
  *
  */
  router.delete("/logout", validateTokenMiddleware.validateToken, Guard.logout);

  /**
* @swagger
* /api/guard/approveSetting:
*   put:
*     summary: Guard approve setting update.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard approve setting update.
*         schema:
*           type: object
*           required:
*             - visitorsVerification
*           properties:
*             visitorsVerification:
*               type: boolean 
*     responses:
*       200:
*         description: Guard approve setting updated successfully. 
*/
  router.put("/approveSetting", validateTokenMiddleware.validateToken, Guard.updateSetting);
  
  app.use("/api/guard", router);
};