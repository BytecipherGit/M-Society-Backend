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
*     summary: Service provider registration.
*     tags:
*       - Service Provider
*     parameters:
*       - in: body
*         description: Phone directory registration.
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
*     responses:
*       200:
*         description: Phone directory add successfully.
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
*/
  router.post("/registration", upload.any(), service.add)

 /**
* @swagger
* /api/serviceProvider:
*   put:
*     summary: Service provider Update.
*     tags:
*       - Service Provider
*     parameters:
*       - in: body
*         description: Phone directory Update.
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
*         description: Phone directory update successfully.
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
*/
 router.get("/", validateTokenMiddleware.validateToken, service.findAll);

  /**
* @swagger
* /api/serviceProvider/serviceName:
*   get:
*     summary: Service Name fetch for drop down.
*     tags:
*       - Service Provider
*     parameters:
*     responses:
*       200:
*         description: Service Name fetch for drop down successfully.
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