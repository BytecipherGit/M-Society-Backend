module.exports = app => {
  const ResidentialUser = require("../controllers/residentialUser.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  const multer = require('multer');

  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads/user',
    filename: (request, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
* @swagger
* /api/user/signup:
*   post:
*     summary: Residential user signup.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user signup.
*         schema:
*           type: object
*           required:
*             - phoneNumber
*             - password
*           properties:
*             name:
*               type: string
*             password:
*               type: string
*             address:
*               type: string
*             phoneNumber:
*               type: string
*             houseNumber:
*               type: string
*             uniqueCode:
*                type: string
*             status:
*               type: string
*             occupation:
*               type: string
*             profileImage:
*               type: string 
*             userType:
*               type: string 
*             ownerName:
*               type: string
*             ownerEmail:
*               type: string
*             ownerAddress:
*               type: string
*             ownerPhoneNumber:
*               type: string
*             countryCode: 
*               type: string
*     responses:
*       200:
*         description: Residential user signup successfully.
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
*                       address:
*                         type: string
*                         example: bangali square
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       designationId:
*                         type: string
*                         example: 639c1c02411067377f947273
*                       houseNumber:
*                         type: string
*                         example: 491
*                       societyUniqueId:
*                         type: string
*                         example:  JHY7
*                       societyId:
*                         type: string
*                         example:  639c1c02411067377f947256
*                       status:
*                         type: Enum
*                         example:  active/Inactive
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: image.jpg
*                       userType:
*                         type: string 
*                         example: owner/rental
*                       countryCode: 
*                         type: string  
*                         example: +91
*/
  router.post("/signup", upload.single('profileImage'), ResidentialUser.singUp);

  /**
* @swagger
* /api/user/login:
*   post:
*     summary: Residential user login.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user login with phone and password.
*         schema:
*           type: object
*           required:
*             - phoneNumber
*             - password
*           properties:
*             phoneNumber:
*               type: string
*             password:
*               type: string
*             countryCode: 
*               type: string
*             deviceToken:
*               type: string
*             deviceType: 
*               type: string
*     responses:
*       200:
*         description: Residential user login successfully.
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
*                       address:
*                         type: string
*                         example: bangali square
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       designationId:
*                         type: string
*                         example: 639c1c02411067377f947273
*                       houseNumber:
*                         type: string
*                         example: 491
*                       societyUniqueId:
*                         type: string
*                         example:  JHY7
*                       societyId:
*                         type: string
*                         example:  639c1c02411067377f947256
*                       status:
*                         type: Enum
*                         example:  active/Inactive
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: image.jpg
*                       userType:
*                         type: string 
*                         example: owner/rental
*                       countryCode: 
*                         type: string  
*                         example: +91  
*/
  router.post("/login", ResidentialUser.login);

  /**
 * @swagger
 * /api/user/logout:
 *   delete:
 *     summary: Logout the user from the application
 *     tags:
 *       - Residential User
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
 *         description: Logout the user from the application.
 *
 */
  router.post("/logout", validateTokenMiddleware.validateToken, ResidentialUser.logout);

  /**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Residential user fetch all with pagination (user listing for society admin).
 *     tags:
 *       - Residential User
 *     responses:
 *       200:
 *         description: Residential user fetch with pagination successfully.
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
 *                         example: ResidentialUser
 *                       address:
 *                         type: string
 *                         example: Hawa Bangla
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       designationId:
 *                         type: string
 *                         example:  1
 *                       houseNumber:
 *                         type: string
 *                         example: 491
 *                       societyUniqueId:
 *                         type: string
 *                         example:  HBJ7
 *                       societyId:
 *                         type: string
 *                         example: 121
 *                       status:
 *                         type: string
 *                         example:  Inactive/active
 *                       occupation:
 *                         type: string
 *                         example:  teacher
 *                       profileImage:
 *                         type: string
 *                         example: 
 *                       countryCode: 
*                         type: string  
*                         example: +91 
 */
  router.get("/all", validateTokenMiddleware.validateToken, ResidentialUser.all);

 /**
 * @swagger
 * /api/user/notification:
 *   get:
 *     summary: Residential user notification fetch 
 *     tags:
 *       - Residential User
 *     responses:
 *       200:
 *         description: Residential user notification fetch successfully.
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
 *                       userId:
 *                         type: string
 *                         example: 
 *                       userType:
 *                         type: string
 *                         example: 
 *                       payload:
 *                         type: string
 *                         example: 
 *                       topic:
 *                         type: string
 *                         example:  
 */
  router.get("/notification", validateTokenMiddleware.validateToken, ResidentialUser.notificationAll);

  /**
* @swagger
* /api/user/app/all:
*   get:
*     summary: Residential user fetch for user App.
*     tags:
*       - Residential User
*     responses:
*       200:
*         description: Residential user fetch for user App.
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
*                         example: ResidentialUser
*                       address:
*                         type: string
*                         example: Hawa Bangla
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       designationId:
*                         type: string
*                         example:  1
*                       houseNumber:
*                         type: string
*                         example: 491
*                       societyUniqueId:
*                         type: string
*                         example:  HBJ7
*                       societyId:
*                         type: string
*                         example: 121
*                       status:
*                         type: string
*                         example:  Inactive/active
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: 
*                       countryCode: 
*                         type: string  
*                         example: +91 
*/
  router.get("/app/all", validateTokenMiddleware.validateToken, ResidentialUser.allApp);

  /**
 * @swagger
 * /api/user/profession:
 *   get:
 *     summary: Profession list for user.
 *     tags:
 *       - Residential User
 *     responses:
 *       200:
 *         description: Profession fetch successfully.
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
 *                         example: Software Develper
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/profession", ResidentialUser.profession);

  /**
 * @swagger
 * /api/user/houseOwner/:id:
 *   get:
 *     summary: House Owner Details for admin.
 *     tags:
 *       - Residential User
 *     responses:
 *       200:
 *         description: House Owner Details fetch successfully for admin.
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
 *                         example: Software Develper
 *                       email:
 *                         type: string
 *                         example: active/Inactive
 *                       phoneNumber:
 *                         type: string
 *                         example: Software Develper
 *                       residentialUserId:
 *                         type: string
 *                         example: active/Inactive
 *                       address:
 *                         type: string
 *                         example: Software Develper
 *                       societyId:
 *                         type: string
 *                         example: active/Inactive
 *                       status:
 *                         type: string
 *                         example: active/Inactive
 *                       countryCode: 
*                         type: string  
*                         example: +91   
*/
  router.get("/houseOwner/:id", validateTokenMiddleware.validateToken, ResidentialUser.getHouseOwner);

  /**
* @swagger
* /api/user/:id:
*   get:
*     summary: Residential user fetch by id.
*     tags:
*       - Residential User
*     responses:
*       200:
*         description: Residential user fetch successfully.
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
*                         example: ResidentialUser
*                       address:
*                         type: string
*                         example: Hawa Bangla
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       designationId:
*                         type: string
*                         example:  1
*                       houseNumber:
*                         type: string
*                         example: 491
*                       societyUniqueId:
*                         type: string
*                         example:  HBJ7
*                       societyId:
*                         type: string
*                         example: 121
*                       status:
*                         type: string
*                         example:  Inactive/active
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: 
*                       countryCode: 
*                         type: string  
*                         example: +91  
*/
  router.get("/:id", validateTokenMiddleware.validateToken, ResidentialUser.get);

  /**
* @swagger
* /api/user/name/search/:name:
*   get:
*     summary: Residential search by name with pagination.
*     tags:
*       - Residential User
*     responses:
*       200:
*         description: Residential user search by name with pagination.
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
*                         example: ResidentialUser
*                       address:
*                         type: string
*                         example: Hawa Bangla
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       designationId:
*                         type: string
*                         example:  1
*                       houseNumber:
*                         type: string
*                         example: 491
*                       societyUniqueId:
*                         type: string
*                         example:  HBJ7
*                       societyId:
*                         type: string
*                         example: 121
*                       status:
*                         type: string
*                         example:  Inactive/active
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: 
*                       countryCode: 
*                         type: string  
*                         example: +91  
*/
  router.get("/name/search", validateTokenMiddleware.validateToken, ResidentialUser.search);

  /**
* @swagger
* /api/user/:
*   put:
*     summary: Residential user update.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user update.
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
*             status:
*               type: string
*             occupation:
*               type: string
*             profileImage:
*               type: string
*     responses:
*       200:
*         description: Residential user singup successfully.
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
*                       address:
*                         type: string
*                         example: admin
*                       phoneNumber:
*                         type: string
*                         example: admin
*                       designationId:
*                         type: string
*                         example:  1234
*                       houseNumber:
*                         type: string
*                         example: admin
*                       societyUniqueId:
*                         type: string
*                         example:  1234
*                       societyId:
*                         type: string
*                         example: admin
*                       status:
*                         type: Enum
*                         example:  active/Inactive
*                       occupation:
*                         type: string
*                         example:  teacher
*                       profileImage:
*                         type: string
*                         example: image.pjg
*                       countryCode: 
*                         type: string  
*                         example: +91  
*/
  router.put("/", validateTokenMiddleware.validateToken, upload.single('profileImage'), ResidentialUser.update);

  /**
* @swagger
* /api/user/setNewPassword:
*   post:
*     summary: Residential user password update.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user password update.
*         schema:
*           type: object
*           required:
*             - phoneNumber
*             - newPassword
*             - otp
*             - countryCode
*           properties:
*             phoneNumber:
*               type: string
*             newPassword:
*               type: string
*             otp:
*               type: number 
*             countryCode:
*               type: number
*     responses:
*       200:
*         description: Residential user password update.
*/
  router.post("/setNewPassword", ResidentialUser.ForgetPassword);

  /**
* @swagger
* /api/user/changePassword:
*   post:
*     summary: Residential user password changed.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user password updated.
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
*         description: Residential user password updated!.
*/
  router.post("/changePassword", validateTokenMiddleware.validateToken, ResidentialUser.passwordChange);

  /**
  * @swagger
  * /api/user/sendOtp:
  *   post:
  *     summary: Residential user send otp.
  *     tags:
  *       - Residential User
  *     parameters:
  *       - in: body
  *         description: Super admin send otp to phone.
  *         schema:
  *           type: object
  *           required:
  *             - phoneNumber
  *           properties:
  *             phoneNumber:
  *               type: string
  *             countryCode: 
  *               type: string
  *     responses:
  *       200:
  *         description: Super admin send otp to phone.
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
  *                       countryCode: 
  *                         type: string  
  *                         example: +91
*/
  router.post("/sendOtp", ResidentialUser.sendotp);

  /**
* @swagger
* /api/user/refresh-token:
*   post:
*     summary: Refresh the auth token.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Get the refresh token.
*         schema:
*           type: object
*           required:
*             - phoneNumber
*             - token
*           properties:
*             phoneNumber:
*               type: string
*             token:
*               type: string
*     responses:
*       200:
*         description: Refresh the auth token of user.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: integer
*                         description: The user ID.
*                         example: 1
*                       name:
*                         type: string
*                         description: The user's name.
*                         example: Leanne Graham
*
*/
  router.post("/refresh-token", ResidentialUser.refreshToken);

  /**
* @swagger
* /api/user/:
*   delete:
*     summary: Residential user delete by id.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Society delete.
*         schema:
*           type: object
*           required:
*             - id 
*           properties:
*             id:
*               type: string 
*     responses:
*       200:
*         description: Residential user delete successfully.
*/
  router.delete("/", validateTokenMiddleware.validateToken, ResidentialUser.delete);

  /**
* @swagger
* /api/user/invitation/accept/:code:
*   get:
*     summary: Invitation accept by code.
*     tags:
*       - Residential User
*     responses:
*       200:
*         description: Invitation accepted by code.
*/
 router.get("/invitation/accept/:code", ResidentialUser.acceptInvitetion);
  app.use("/api/user", router);
};