module.exports = app => {
    let router = require("express").Router();
    const service = require("../controllers/serviceProvider.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    const multer = require('multer');
    //for image store
    const storage = multer.diskStorage({
      destination: 'public/uploads/society',
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
  router.post("/registration", upload.any(), service.add)

 /**
* @swagger
* /api/serviceProvider:
*   put:
*     summary: Service provider verify.
*     tags:
*       - Service Provider
*     parameters:
*       - in: body
*         description: Service provider verify.
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
*               type: array
*     responses:
*       200:
*         description: Service provider verify successfully.
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
 router.put("/", validateTokenMiddleware.validateToken, service.update);

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
   *       - Profession
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
  router.post("/serviceName/add",service.serviceAdd);
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
*     summary: Socisty fetch for drop down.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Socisty fetch for drop down successfully.
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

  app.use("/api/serviceProvider", router);
}