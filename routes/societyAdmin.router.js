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

  app.use("/api/admin", router);
};