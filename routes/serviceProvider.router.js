module.exports = app => {
  let router = require("express").Router();
  const service = require("../controllers/serviceProvider.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  const multer = require('multer');
  //for image store
  const storage = multer.diskStorage({
    destination: 'public/uploads/serviceProvider',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
  * @swagger
  * /api/serviceProvider/registration:
  *   post:
  *     summary: Service Provider register successfully.
  *     tags:
  *       - Service Provider
  *     parameters:
  *       - in: body
  *         description: Service Provider register successfully.
  *         schema:
  *           type: object
  *           required:
  *             - name
  *             - phoneNumber
  *             - serviceName
  *             - address
  *           properties:
  *             name:
  *               type: string
  *             address:
  *               type: string
  *             phoneNumber:
  *               type: string
  *             serviceName:
  *               type: string
  *             latitude:
  *               type: number
  *             longitude:
  *               type: number
  *             countryCode: 
  *               type: string
  *             city:
  *               type: string
  *             state:
  *               type: string
  *             country: 
  *               type: string
  *             socetyId:
  *               type: string
  *             profileImage:
  *               type: string
  *             idProof:
  *               type: string
  *             idProofType:
  *               type: string  
  *             email:
  *               type: string
  *             webUrl:
  *               type: string
  *             otherPhoneNumber:
  *               type: string  
  *     responses:
  *       200:
  *         description: Service Provider register successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: 
  *                   items:
  *                     properties:
  *                       societyAdminId:
  *                         type: string
  *                         example: 63999e0ce5e60462a407c868
  *                       name:
  *                         type: string
  *                         example: Ramu
  *                       address:
  *                         type: string
  *                         example: Palasiya
  *                       phoneNumber:
  *                         type: string
  *                         example: 1234567891
  *                       serviceName:
  *                         type: string
  *                         example: 63999e0ce5e60462a407c868
  *                       societyId:
  *                         type: string
  *                         example: [1,4,3,2]
  *                       status:
  *                         type: string
  *                         example: active/Inactive
  *                       latitude:
  *                         type: number
  *                         example: 71.5249154
  *                       longitude:
  *                         type: number
  *                         example: 25.5504396
  *                       countryCode: 
  *                         type: string  
  *                         example: +91
  *                       country:
  *                         type: string
  *                         example: india
  *                       state:
  *                         type: string
  *                         example: M.P.
  *                       city:
  *                         type: string
  *                         example: indore  
  *                       webUrl:
  *                         type: string
  *                         example: https://www.google.com/  
  *                       otherPhoneNumber:
  *                         type: string
  *                         example: 9999966666  
  *                       email:
  *                         type: string
  *                         example: a@gmail.com  
  */
  router.post("/registration", upload.any(), service.add);

  /**
 * @swagger
 * /api/serviceProvider:
 *   put:
 *     summary: Service provider update.
 *     tags:
 *       - Service Provider
 *     parameters:
 *       - in: body
 *         description: Service provider update.
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *             isVerify:
 *               type: string
 *             status:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             socetyId:
 *               type: array
 *     responses:
 *       200:
 *         description: Service provider update successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       societyAdminId:
 *                         type: string
 *                         example: 63999e0ce5e60462a407c868
 *                       name:
 *                         type: string
 *                         example: Ramu
 *                       address:
 *                         type: string
 *                         example: Palasiya
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       serviceName:
 *                         type: string
 *                         example: 63999e0ce5e60462a407c868
 *                       societyId:
 *                         type: string
 *                         example: 1234567891
 *                       status:
 *                         type: string
 *                         example: active/Inactive
 *                       latitude:
 *                         type: number
 *                         example: 71.5249154
 *                       longitude:
 *                         type: number
 *                         example: 25.5504396
 *                       countryCode: 
 *                         type: string  
 *                         example: +91
 *                       country:
 *                         type: string
 *                         example: india
 *                       state:
 *                         type: string
 *                         example: M.P.
 *                       city:
 *                         type: string
 *                         example: indore
 *                       isverify:
 *                         type: string
 *                         example: true false
 *                       webUrl:
 *                         type: string
 *                         example: https://www.google.com/  
 *                       otherPhoneNumber:
 *                         type: string
 *                         example: 9999966666  
 *                       email:
 *                         type: string
 *                         example: a@gmail.com    
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.any(), service.update);

  /**
 * @swagger
 * /api/serviceProvider:
 *   get:
 *     summary: Service provider fetch with pagination.
 *     tags:
 *       - Service Provider
 *     parameters:
 *     responses:
 *       200:
 *         description: Service provider fetch with pagnation successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: 
 *                   items:
 *                     properties:
 *                       societyAdminId:
 *                         type: string
 *                         example: 63999e0ce5e60462a407c868
 *                       name:
 *                         type: string
 *                         example: Ramu
 *                       address:
 *                         type: string
 *                         example: Palasiya
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       serviceName:
 *                         type: string
 *                         example: 63999e0ce5e60462a407c868
 *                       societyId:
 *                         type: string
 *                         example: 1234567891
 *                       status:
 *                         type: string
 *                         example: active/Inactive
 *                       latitude:
 *                         type: number
 *                         example: 71.5249154
 *                       longitude:
 *                         type: number
 *                         example: 25.5504396
 *                       countryCode: 
 *                         type: string  
 *                         example: +91
 *                       country:
 *                         type: string
 *                         example: india
 *                       state:
 *                         type: string
 *                         example: M.P.
 *                       city:
 *                         type: string
 *                         example: indore
 *                       webUrl:
 *                         type: string
 *                         example: https://www.google.com/  
 *                       otherPhoneNumber:
 *                         type: string
 *                         example: 9999966666  
 *                       email:
 *                         type: string
 *                         example: a@gmail.com   
 */
  router.get("/", validateTokenMiddleware.validateToken, service.findAll);

  /**
* @swagger
* /api/serviceProvider/allCount:
*   get:
*     summary: Service provider fetch for count.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Service provider fetch for count.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       webUrl:
*                         type: string
*                         example: https://www.google.com/  
*                       otherPhoneNumber:
*                         type: string
*                         example: 9999966666  
*                       email:
*                         type: string
*                         example: a@gmail.com   
*/
  router.get("/allCount", validateTokenMiddleware.validateToken, service.list);

  /**
* @swagger
* /api/serviceProvider/societyList:
*   get:
*     summary: Society List fetch with filter for service provider.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Society List fetch with filter for service provider.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore  
*/
  router.get("/societyList", validateTokenMiddleware.validateToken, service.societyList);

  /**
* @swagger
* /api/serviceProvider/all:
*   get:
*     summary: Service provider fetch for app.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Service provider fetch for app.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       webUrl:
*                         type: string
*                         example: https://www.google.com/  
*                       otherPhoneNumber:
*                         type: string
*                         example: 9999966666  
*                       email:
*                         type: string
*                         example: a@gmail.com   
*/
  router.get("/all", validateTokenMiddleware.validateToken, service.listUser);

  /**
* @swagger
* /api/serviceProvider/serviceName:
*   get:
*     summary: Service name fetch for drop down.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Service name fetch for drop down successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       service:
*                         type: string
*                         example: true
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*/
  router.get("/ServiceName", service.serviceList);

  /**
   * @swagger
   * /api/serviceProvider/serviceName/add:
   *   post:
   *     summary: Service name add
   *     tags:
   *       - Service Provider
   *     parameters:
   *       - in: body
   *         description: Service name add.
   *         schema:
   *           type: object
   *           required:
   *             - name
   *           properties:
   *             name:
   *               type: string
   *     responses:
   *       200:
   *         description: Service name add successfully.
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
   *                         example: Doctor
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/serviceName/add", service.serviceAdd);

  /**
  * @swagger
  * /api/serviceProvider/:id:
  *   get:
  *     summary: Service provider fetch by id.
  *     tags:
  *       - Service Provider
  *     parameters:
  *     responses:
  *       200:
  *         description: Service provider fetch by id successfully.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: 
  *                   items:
  *                     properties:
  *                       societyAdminId:
  *                         type: string
  *                         example: 63999e0ce5e60462a407c868
  *                       name:
  *                         type: string
  *                         example: Ramu
  *                       address:
  *                         type: string
  *                         example: Palasiya
  *                       phoneNumber:
  *                         type: string
  *                         example: 1234567891
  *                       serviceName:
  *                         type: string
  *                         example: 63999e0ce5e60462a407c868
  *                       societyId:
  *                         type: string
  *                         example: 1234567891
  *                       status:
  *                         type: string
  *                         example: active/Inactive
  *                       latitude:
  *                         type: number
  *                         example: 71.5249154
  *                       longitude:
  *                         type: number
  *                         example: 25.5504396
  *                       countryCode: 
  *                         type: string  
  *                         example: +91
  *                       country:
  *                         type: string
  *                         example: india
  *                       state:
  *                         type: string
  *                         example: M.P.
  *                       city:
  *                         type: string
  *                         example: indore
  *                       webUrl:
  *                         type: string
  *                         example: https://www.google.com/  
  *                       otherPhoneNumber:
  *                         type: string
  *                         example: 9999966666  
  *                       email:
  *                         type: string
  *                         example: a@gmail.com   
  */
  router.get("/:id", validateTokenMiddleware.validateToken, service.findOne);

  /**
  * @swagger
  * /api/serviceProvider/logout:
  *   delete:
  *     summary: Service provider logout.
  *     tags:
  *       - Service Provider
  *     parameters:
  *       - in: body
  *         description: Service provider logout.
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
  *         description: Service provider logout
  */
  router.delete("/logout", validateTokenMiddleware.validateToken, service.logout);

  /**
  * @swagger
  * /api/serviceProvider/:id:
  *   delete:
  *     summary: Service provider delete by id.
  *     tags:
  *       - Service Provider
  *     parameters:
  *     responses:
  *       200:
  *         description: Service provider delete by id successfully.
  */
  router.delete("/:id", validateTokenMiddleware.validateToken, service.delete);

  /**
* @swagger
* /api/serviceProvider/society/:city:
*   get:
*     summary: Society fetch for drop down.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Society fetch for drop down successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore  
*/
  router.get("/society/:city", service.allSociety);

  /**
 * @swagger
 * /api/serviceProvider/login:
 *   post:
 *     summary: Service provider login successfully.
 *     tags:
 *       - Service Provider
 *     parameters:
 *       - in: body
 *         description: Service provider login successfully.
 *         schema:
 *           type: object
 *           required:
 *             - phoneNumber
 *             - password
 *             - countryCode 
 *           properties:
 *             phoneNumber:
 *               type: string
 *             password:
 *               type: string
 *             countryCode:
 *               type: string
 *     responses:
 *       200:
 *         description: Service provider login successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       webUrl:
*                         type: string
*                         example: https://www.google.com/  
*                       otherPhoneNumber:
*                         type: string
*                         example: 9999966666  
*                       email:
*                         type: string
*                         example: a@gmail.com   
*/
  router.post("/login", service.login);

  /**
 * @swagger
 * /api/serviceProvider/sendOtp:
 *   post:
 *     summary: Service provider send otp.
 *     tags:
 *       - Service Provider
 *     parameters:
 *       - in: body
 *         description: Service provider send otp.
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
 *         description: Service provider send otp.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       societyAdminId:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       name:
*                         type: string
*                         example: Ramu
*                       address:
*                         type: string
*                         example: Palasiya
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       serviceName:
*                         type: string
*                         example: 63999e0ce5e60462a407c868
*                       societyId:
*                         type: string
*                         example: 1234567891
*                       status:
*                         type: string
*                         example: active/Inactive
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       countryCode: 
*                         type: string  
*                         example: +91
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       webUrl:
*                         type: string
*                         example: https://www.google.com/  
*                       otherPhoneNumber:
*                         type: string
*                         example: 9999966666  
*                       email:
*                         type: string
*                         example: a@gmail.com   
*/
  router.post("/sendOtp", service.sendotp);

  /**
 * @swagger
 * /api/serviceProvider/setNewPassword:
 *   post:
 *     summary: Service provider password update.
 *     tags:
 *       - Service Provider
 *     parameters:
 *       - in: body
 *         description: Service provider password update.
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
 *         description: Service provider password update.
 */
  router.post("/setNewPassword", service.ForgetPassword);


  /**
* @swagger
* /api/serviceProvider/changePassword:
*   post:
*     summary: Service provider change password
*     tags:
*       - Service Provider
*     parameters:
*       - in: body
*         description: Service provider change password
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
*         description:Service provider change password
*/
  router.post("/changePassword", validateTokenMiddleware.validateToken, service.passwordChange);

  /**
* @swagger
* /api/serviceProvider/refresh-token:
*   post:
*     summary: Service provider refresh-token
*     tags:
*       - Service Provider
*     parameters:
*       - in: body
*         description: Service provider refresh-token
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
*         description:Service provider refresh-token
*/
  router.post("/refresh-token", service.refreshToken);

  /**
   * @swagger
   * /api/serviceProvider/count:
   *   post:
   *     summary: Service provider count increase
   *     tags:
   *       - Service Provider
   *     parameters:
   *       - in: body
   *         description: Service provider count increase
   *         schema:
   *           type: object
   *           required:
   *             - serviceProviderId
   *           properties:
   *             serviceProviderId:
   *               type: string
   *               example: 64476d6fffc104a52d317750
   *     responses:
   *       200:
   *         description: Service provider count increased
   */
  router.post("/count", validateTokenMiddleware.validateToken, service.viewCount);

  app.use("/api/serviceProvider", router);
}