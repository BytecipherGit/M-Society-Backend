module.exports = app => {
    const Society = require("../controllers/society.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    const ResidentialUser = require("../controllers/residentialUser.controller");
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
   *     summary: Society admin send invitetion.
   *     tags:
   *       - Society Admin
   *     parameters:
   *       - in: body
   *         description: Society admin send invitetion.
   *         schema:
   *           type: object
   *           required:
   *             - email
   *           properties:
   *             email:
   *               type: string
   *     responses:
   *       200:
   *         description: send invitetion successfully.
   */
    router.post("/invitation/send", validateTokenMiddleware.validateToken, Society.sendInvitetion);

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
   *             societyUniqueId:
   *                type: string
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
   *                         example: admin
   *                       address:
   *                         type: string
   *                         example: admin
   *                       PhoneNumber:
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
   *                         example:  
   */
    router.post("/signup", upload.single('profileImage'), ResidentialUser.adminsingUp);

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
 *                         example: ResidentialUser
 *                       address:
 *                         type: string
 *                         example: Hawa Bangla
 *                       PhoneNumber:
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
 */
    router.post("/login", ResidentialUser.adminlogin);

    app.use("/api/admin", router);
};