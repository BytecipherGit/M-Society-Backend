module.exports = app => {
  const ResidentialUser = require("../controllers/residentialUser.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  const multer = require('multer');

  //for file store
  const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
* @swagger
* /api/residentialUser/signup:
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
*                         example: admin
*                       phoneNumber:
*                         type: string
*                         example: admin
*                       designationId:
*                         type: string
*                         example: 0
*                       houseNumber:
*                         type: string
*                         example: admin
*                       societyUniqueId:
*                         type: string
*                         example:  1234
*                       societyId:
*                         type: string
*                         example:  1234
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
  router.post("/signup", upload.single('profileImage'), ResidentialUser.singUp);

  /**
* @swagger
* /api/residentialUser/login:
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
*/
  router.post("/login", ResidentialUser.login);

  /**
* @swagger
* /api/residentialUser/:
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
 * /api/residentialUser/all:
 *   get:
 *     summary: Residential user fetch all.
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
 */
  router.get("/all", validateTokenMiddleware.validateToken, ResidentialUser.all);

  /**
* @swagger
* /api/residentialUser/:id:
*   get:
*     summary: Residential user get by id.
*     tags:
*       - Residential User
*     responses:
*       200:
*         description: Residential user get successfully.
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
*/
  router.get("/:id", validateTokenMiddleware.validateToken, ResidentialUser.get);

  /**
* @swagger
* /api/residentialUser/:
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
*             password:
*               type: string
*             address:
*               type: string
*             phoneNumber:
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
*                         example: 
*/
  router.put("/", validateTokenMiddleware.validateToken, upload.single('profileImage'), ResidentialUser.update);

  /**
* @swagger
* /api/residentialUser/forgetPassword:
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
*           properties:
*             phoneNumber:
*               type: string
*             newPassword:
*               type: string
*     responses:
*       200:
*         description: Residential user password update.
*/
  router.post("/forgetPassword", ResidentialUser.ForgetPassword);

  /**
* @swagger
* /api/residentialUser/changePassword:
*   post:
*     summary: Residential user password changed.
*     tags:
*       - Residential User
*     parameters:
*       - in: body
*         description: Residential user password changed.
*         schema:
*           type: object
*           required:
*             - phoneNumber
*             - password
*             - newPassword
*           properties:
*             phoneNumber:
*               type: string
*             password:
*               type: string
*             changePassword:
*               type: string
*     responses:
*       200:
*         description: Residential user password changed!.
*/
  router.post("/changePassword", validateTokenMiddleware.validateToken, ResidentialUser.passwordChange);

  app.use("/api/residentialUser", router);
};