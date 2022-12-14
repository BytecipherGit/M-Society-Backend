module.exports = app => {
    const Society = require("../controllers/society.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    const ResidentialUser = require("../controllers/residentialUser.controller");
    const Admin = require("../controllers/societyAdmin.controller");
    let router = require("express").Router();
    const multer = require('multer');

    //for image store
    const storage = multer.diskStorage({
        destination: 'public/uploads/admin',
        filename: (request, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
    const upload = multer({ storage: storage });

/**
   * @swagger
   * /api/admin/invitation/send:
   *   post:
   *     summary: Society admin send invitetion to residential user.
   *     tags:
   *       - Society Admin
   *     parameters:
   *       - in: body
   *         description: Society admin send invitetion to residential user.
   *         schema:
   *           type: object
   *           required:
   *             - email
   *           properties:
   *             email:
   *               type: string
   *     responses:
   *       200:
   *         description: Invitetion send successfully.
   */
router.post("/invitation/send", validateTokenMiddleware.validateToken, Admin.sendInvitetion);

/**
   * @swagger
   * /api/admin/signup:
   *   post:
   *     summary: Society admin signup.
   *     tags:
   *       - Society Admin
   *     parameters:
   *       - in: body
   *         description: Society admin signup.
   *         schema:
   *           type: object
   *           required:
   *             - phoneNumber
   *             - password
   *             - name
   *             - address 
   *           properties:
   *             name:
   *               type: string
   *             password:
   *               type: string
   *             address:
   *               type: string
   *             PhoneNumber:
   *               type: string
   *             designationId:
   *               type: string
   *             houseNumber:
   *               type: string
   *             societyId:
   *                type: string
   *             status:
   *               type: string
   *             occupation:
   *               type: string
   *             profileImage:
   *               type: string
   *     responses:
   *       200:
   *         description: Society admin signup successfully.
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
   *                         example: test admin 
   *                       address:
   *                         type: string
   *                         example: bangali society indore m.p.
   *                       PhoneNumber:
   *                         type: string
   *                         example: 1236547892
   *                       designationId:
   *                         type: string
   *                         example:  63abf95f71c09e91244ef1e9
   *                       houseNumber:
   *                         type: string
   *                         example: 491 A
   *                       societyUniqueId:
   *                         type: string
   *                         example:  X60B
   *                       societyId:
   *                         type: string
   *                         example: 63ae90f96e4991e46be283c5
   *                       status:
   *                         type: Enum
   *                         example:  active/Inactive
   *                       occupation:
   *                         type: string
   *                         example:  teacher
   *                       profileImage:
   *                         type: string
   *                         example: https://picsum.photos/200/300
   */
router.post("/signup", upload.single('profileImage'), Admin.adminsingUp);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Society admin user login.
 *     tags:
 *       - Society Admin
 *     parameters:
 *       - in: body
 *         description: Society admin login with phone and password.
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
 *     responses:
 *       200:
 *         description: Society admin login successfully.
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
 *                         example: test admin 
 *                       address:
 *                         type: string
 *                         example: bangali society indore m.p.
 *                       PhoneNumber:
 *                         type: string
 *                         example: 1236547892
 *                       designationId:
 *                         type: string
 *                         example:  63abf95f71c09e91244ef1e9
 *                       houseNumber:
 *                         type: string
 *                         example: 491 A
 *                       societyUniqueId:
 *                         type: string
 *                         example:  X60B
 *                       societyId:
 *                         type: string
 *                         example: 63ae90f96e4991e46be283c5
 *                       status:
 *                         type: Enum
 *                         example:  active/Inactive
 *                       occupation:
 *                         type: string
 *                         example:  teacher
 *                       profileImage:
 *                         type: string
 *                         example: https://picsum.photos/200/300
 */
router.post("/login", Admin.adminlogin);

/**
* @swagger
* /api/user/logout:
*   delete:
*     summary: Logout the user from the application
*     tags:
*       - Society Admin
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
  router.delete("/logout", validateTokenMiddleware.validateToken, Admin.logout);
    
/**
* @swagger
* /api/admin/changePassword:
*   post:
*     summary: Society admin password changed.
*     tags:
*       - Society Admin
*     parameters:
*       - in: body
*         description: Society admin password updated.
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
*         description: Society admin password updated!.
*/
  router.post("/changePassword", validateTokenMiddleware.validateToken, Admin.passwordChange);

 /**
 * @swagger
 * /api/admin/makeSubAdmin:
 *   post:
 *     summary: Society admin make sub admin to residential user.
 *     tags:
 *       - Society Admin
 *     parameters:
 *       - in: body
 *         description: Society admin make sub admin to residential user.
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
  *     responses:
  *       200:
  *         description: Society admin make sub admin to residential user.
  */
  router.post("/makeSubAdmin", validateTokenMiddleware.validateToken, Admin.makeSupAdmin);

  /**
* @swagger
* /api/admin/refresh-token:
*   post:
*     summary: Refresh the auth token.
*     tags:
*       - Society Admin
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
  router.post("/refresh-token", Admin.refreshToken);

  app.use("/api/admin", router);
};