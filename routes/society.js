module.exports = app => {
    const Society = require("../controllers/society.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    const ResidentialUser = require("../controllers/residentialUser.controller");
    let router = require("express").Router();
    const multer = require('multer');

    //for image store
    const storage = multer.diskStorage({
        destination: 'public/uploads',
        filename: (request, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
    const upload = multer({ storage: storage });

    /**
   * @swagger
   * /api/society/sendInvitation:
   *   post:
   *     summary: Society admin send invitetion.
   *     tags:
   *       - Society
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
    router.post("/sendInvitation", validateTokenMiddleware.validateToken, Society.sendInvitetion);
    
    /**
   * @swagger
   * /api/society/adminSignup:
   *   post:
   *     summary: Society admin signup.
   *     tags:
   *       - Society
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
    router.post("/adminSignup", upload.single('profileImage'), ResidentialUser.adminsingUp);

    /**
 * @swagger
 * /api/society/adminLogin:
 *   post:
 *     summary: society admin user login.
 *     tags:
 *       - Society
 *     parameters:
 *       - in: body
 *         description: society admin login with phone and password.
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
 *         description: society admin login successfully.
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
    router.post("/adminLogin", ResidentialUser.adminlogin);

    /**
     * @swagger
     * /api/society/:
     *   post:
     *     summary: Society add.
     *     tags:
     *       - Society
     *     parameters:
     *       - in: body
     *         description: Society add.
     *         schema:
     *           type: object
     *           required:
     *             - name
     *             - address 
     *             - registrationNumber 
     *           properties:
     *             name:
     *               type: string
     *             address:
     *               type: string
     *             registrationNumber:
     *               type: string
     *             pin:
     *               type: string
     *             status:
     *               type: string
     *     responses:
     *       200:
     *         description: Society add successfully.
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
     *                         example: bangali society
     *                       address:
     *                         type: string
     *                         example: palasiya 
     *                       registrationNumber:
     *                         type: string
     *                         example: 121
     *                       pin:
     *                         type: string
     *                         example: 452001
     *                       status:
     *                         type: string
     *                         example: active/Inactive
    */
    router.post("/", validateTokenMiddleware.validateToken, Society.add);
  
    /**
     * @swagger
     * /api/society/:
     *   put:
     *     summary: Society update.
     *     tags:
     *       - Society
     *     parameters:
     *       - in: body
     *         description: Society update.
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
     *             registrationNumber:
     *               type: string
     *             pin:
     *               type: string
     *             status:
     *               type: string 
     *     responses:
     *       200:
     *         description: Society update successfully.
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
     *                         example: bangali society
     *                       address:
     *                         type: string
     *                         example: palasiya 
     *                       registrationNumber:
     *                         type: string
     *                         example: 121
     *                       pin:
     *                         type: string
     *                         example: 452001
     *                       status:
     *                         type: string
     *                         example: active/Inactive
   */
    router.put("/", validateTokenMiddleware.validateToken, Society.updateSociety);

    /**
 * @swagger
 * /api/society/all:
 *   get:
 *     summary: Society fetch all.
 *     tags:
 *       - Society
 *     responses:
 *       200:
 *         description: Society fetch successfully.
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
 *                         example: bangali society
 *                       address:
 *                         type: string
 *                         example: palasiya 
 *                       registrationNumber:
 *                         type: string
 *                         example: 121
 *                       pin:
 *                         type: string
 *                         example: 452001
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
    router.get("/all", validateTokenMiddleware.validateToken, Society.all);

    /**
 * @swagger
 * /api/society/:id:
 *   get:
 *     summary: Society get by id.
 *     tags:
 *       - Society
 *     responses:
 *       200:
 *         description: Society get successfully.
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
 *                         example: bangali society
 *                       address:
 *                         type: string
 *                         example: palasiya 
 *                       registrationNumber:
 *                         type: string
 *                         example: 121
 *                       pin:
 *                         type: string
 *                         example: 452001
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
    router.get("/:id", validateTokenMiddleware.validateToken, Society.get);

    /**
* @swagger
* /api/society/:
*   delete:
*     summary: Society delete by id.
*     tags:
*       - Society
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
*         description: Society delete successfully.
*/
    router.delete("/", validateTokenMiddleware.validateToken, Society.delete);

    app.use("/api/society", router);
};