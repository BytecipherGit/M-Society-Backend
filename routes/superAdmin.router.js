module.exports = app => {
  const admin = require("../controllers/superAdmin.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  /**
    * @swagger
    * /api/superAdmin/login:
    *   post:
    *     summary: Super admin login.
    *     tags:
    *       - Super Admin
    *     parameters:
    *       - in: body
    *         description: Super admin login with email and password.
    *         schema:
    *           type: object
    *           required:
    *             - email
    *             - password
    *           properties:
    *             email:
    *               type: string
    *             password:
    *               type: string
    *     responses:
    *       200:
    *         description: Super admin login successfully.
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
    *                       email:
    *                         type: string
    *                         example: admin@gmail.com
 */
  router.post("/login", admin.login);

  /**
* @swagger
* /api/superAdmin/setNewPassword:
*   post:
*     summary: Super admin set new password.
*     tags:
*       - Super Admin
*     parameters:
*       - in: body
*         description: Super admin set new password.
*         schema:
*           type: object
*           required:
*             - email
*             - newPassword
*             - otp
*           properties:
*             email:
*               type: string
*             newPassword:
*               type: string
*             otp:
*               type: number 
*     responses:
*       200:
*         description: Super admin set new password.
*/
  router.post("/setNewPassword", admin.ForgetPassword);

  /**
    * @swagger
    * /api/superAdmin/changePassword:
    *   post:
    *     summary: Super admin change password.
    *     tags:
    *       - Super Admin
    *     parameters:
    *       - in: body
    *         description: Super admin change password.
    *         schema:
    *           type: object
    *           required:
    *             - oldPassword
    *             - newPassword
    *           properties:
    *             oldPassword:
    *               type: string
    *             newPassword :
    *               type: string
    *     responses:
    *       200:
    *         description: Super admin change password.
 */
  router.post("/changePassword", validateTokenMiddleware.validateToken, admin.passwordChange);

  /**
    * @swagger
    * /api/superAdmin/sendOtp:
    *   post:
    *     summary: Super admin send otp.
    *     tags:
    *       - Super Admin
    *     parameters:
    *       - in: body
    *         description: Super admin send otp to email.
    *         schema:
    *           type: object
    *           required:
    *             - email
    *           properties:
    *             email:
    *               type: string
    *     responses:
    *       200:
    *         description: Super admin login successfully.
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
  router.post("/sendOtp", admin.sendotp);

  /**
   * @swagger
   * /api/superAdmin/logout:
   *   delete:
   *     summary: Logout the super admin from the application
   *     tags:
   *       - Super Admin
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
  router.delete("/logout", validateTokenMiddleware.validateToken, admin.logout);

  /**
 * @swagger
 * /admin/superAdmin/refresh-token:
 *   post:
 *     summary: Refresh the auth token.
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: body
 *         description: Get the refresh token.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - token
 *           properties:
 *             email:
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
 *                       refreshToken:
 *                         type: string
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Nzg5MSIsImlhdCI6MTY3Mjc0MzMxOSwiZXhwIjoxNjcyNzQ2OTE5fQ._75j6QJfuk9LWepjVTerqjJ5ymUdtzHh1jyzFKURzso
 *                       accessToken:
 *                         type: string
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTIzNDU2Nzg5MSIsImlhdCI6MTY3Mjc0MzMxOSwiZXhwIjoxNjcyNzQ2OTE5fQ._75j6QJfuk9LWepjVTerqjJ5ymUdtzHh1jyzFKURzso
 *
 */
  router.post("/refresh-token", admin.refreshToken);

  /**
   * @swagger
   * /api/superAdmin/phoneValidation:
   *   get:
   *     summary: Fetch phoneValidation.
   *     tags:
   *       - Super Admin
   *     parameters:
   *         description: Fetch phoneValidation.
   *     responses:
   *       200:
   *         description: Fetch phoneValidation.
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
   *                       beforDays:
   *                         type: string
   *                         example: 7
 */
  router.get("/phoneValidation", admin.contentget);

  /**
* @swagger
* /admin/superAdmin/contactUs:
*   post:
*     summary: Contact Us
*     tags:
*       - Super Admin
*     parameters:
*       - in: body
*         description: Contact Us
*         schema:
*           type: object
*           required:
*             - email
*             - firstName
*             - lastName
*             - text
*           properties:
*             email:
*               type: string
*             firstName:
*               type: string
*             lastName:
*               type: string
*             text:
*               type: string
*     responses:
*       200:
*         description: Contact Us
*/
  router.post("/contactUs", admin.contactUs);

  app.use("/api/superAdmin", router);
};
