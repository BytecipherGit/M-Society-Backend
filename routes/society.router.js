module.exports = app => {
    const Society = require("../controllers/society.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    const ResidentialUser = require("../controllers/residentialUser.controller");
    let router = require("express").Router();
    const multer = require('multer');
    //for image store
    const storage = multer.diskStorage({
        // destination: 'public/uploads/society',
        destination: (req, file, cb) => {
            if (file.fieldname === "images") {
                cb(null, 'public/uploads/society')
            }
            if (file.fieldname === "logo") {
                cb(null, 'public/logo');
            }
        },
        filename: (request, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
    const upload = multer({ storage: storage });
/**
* @swagger
* /api/society/:
*   post:
*     summary: Society add with society admin also added.
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
*             - subscriptionId  
*           properties:
*             societyName:
*               type: string
*             societyAddress:
*               type: string
*             registrationNumber:
*               type: string
*             pin:
*               type: string
*             city:
*               type: string
*             state:
*               type: string
*             country:
*               type: string
*             status:
*               type: string
*             adminName:
*               type: string
*             email:
*               type: string
*             phoneNumber:
*               type: string
*             designationId:
*               type: string
*             houseNumber:
*               type: string
*             occupation:
*               type: string
*             latitude:
*               type: number
*             longitude:
*               type: number
*             description:
*               type: string
*             subscriptionId:
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
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       description:
*                         type: string
*                         example: good gardern
*                       subscriptionId:
*                         type: string
*                         example: 63d8c35106b90e5292f5a6b2
*                       subscriptionType:
*                         type: string
*                         example: Free/Paid  
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore  
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF
*                       logo:
*                         type: string
*                       bgColour:
*                         type: string
*                         example: #ffffff
*                       fontColour:  
*                         type: string
*                         example: #000000     
*/
router.post("/", validateTokenMiddleware.validateToken, Society.add);//upload.array('images'),

 /**
* @swagger
* /api/society/:
*   put:
*     summary: Society update images(formdata) description status successfully.
*     tags:
*       - Society
*     parameters:
*       - in: body
*         description: Society update images(formdata) description status successfully.
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
*             latitude:
*               type: number
*             longitude:
*               type: number
*             description:
*               type: string
*             images:
*               type: string
*             logo:
*               type: string
*             bgColour:
*               type: string
*             fontColour:  
*               type: string
*     responses:
*       200:
*         description: Society update images(formdata) description status successfully.
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
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       description:
*                         type: string
*                         example: good gardern
*                       images:
*                         type: array
*                         example: [images.png,images.jpg]
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       primaryColour:
*                         type: string
*                         example: #0182c1
*                       secondaryColour:
*                         type: string
*                         example: #ffffff
*                       logo:
*                         type: string   
*                       bgColour:
*                         type: string
*                         example: #ffffff
*                       fontColour:  
*                         type: string
*                         example: #000000
 */
router.put("/", validateTokenMiddleware.validateToken, upload.any(), Society.updateSociety);

 /**
 * @swagger
 * /api/society/all:
 *   get:
 *     summary: Society fetch all (society listing for super admin).
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
 *                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF
*                       logo:
*                         type: string
*                       bgColour:
*                         type: string
*                         example: #ffffff
*                       fontColour:  
*                         type: string
*                         example: #000000     
*/
router.get("/all", validateTokenMiddleware.validateToken, Society.all);

 /**
 * @swagger
 * /api/society/:
 *   get:
 *     summary: Society fetch all (society data for super admin).
 *     tags:
 *       - Society
 *     responses:
 *       200:
 *         description: All society fetch successfully.
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
 *                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore 
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF
*                       logo:
*                         type: string    
 */
 router.get("/", validateTokenMiddleware.validateToken, Society.allFetch);

 /**
 * @swagger
 * /api/masterData/:
 *   get:
 *     summary: All report title fetch successfully v2
 *     tags:
 *       - Society
 *     responses:
 *       200:
 *         description: All report title fetch successfully.
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
 *                         example: 
 */
 router.get("/masterData", Society.allreportOption);
router.get("/qrCode", validateTokenMiddleware.validateToken, Society.getQR);

router.get("/attendance", validateTokenMiddleware.validateToken, Society.getAttence);

/**
 * @swagger
 * /api/society/:id:
 *   get:
 *     summary: Society fetch by id.
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
 *                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF
*                       logo:
*                         type: string     
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

/**
* @swagger
* /api/society/search/:name:
*   post:
*     summary: Society search by name and type.
*     tags:
*       - Society
*     parameters:
*       - in: body
*         description: Society add.
*         schema:
*           type: object
*           required:
*             - name
*           properties:
*             name:
*               type: string
*             type:
*               type: string
*     responses:
*       200:
*         description: Society search by name successfully.
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
*                         example: Bangali society / Indore
*                       type:
*                         type: string
*                         example: Active,Inactive,Paid,Free 
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF
*                       logo:
*                         type: string
*                       bgColour:
*                         type: string
*                         example: #ffffff
*                       fontColour:  
*                         type: string
*                         example: #000000     
*/
router.post("/search", validateTokenMiddleware.validateToken, Society.search);

/**
* @swagger
* /api/society/request:
*   post:
*     summary: Society request send.
*     tags:
*       - Society
*     parameters:
*       - in: body
*         description: Society request send.
*         schema:
*           type: object
*           required:
*             - name
*             - address 
*             - registrationNumber 
*             - subscriptionId  
*           properties:
*             societyName:
*               type: string
*             societyAddress:
*               type: string
*             registrationNumber:
*               type: string
*             pin:
*               type: string
*             city:
*               type: string
*             state:
*               type: string
*             country:
*               type: string
*             status:
*               type: string
*             adminName:
*               type: string
*             email:
*               type: string
*             phoneNumber:
*               type: string
*             houseNumber:
*               type: string
*             occupation:
*               type: string
*             latitude:
*               type: number
*             longitude:
*               type: number
*             password:
*               type: string
*     responses:
*       200:
*         description: Society request send successfully.
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
*                       latitude:
*                         type: number
*                         example: 71.5249154
*                       longitude:
*                         type: number
*                         example: 25.5504396
*                       description:
*                         type: string
*                         example: good gardern
*                       subscriptionId:
*                         type: string
*                         example: 63d8c35106b90e5292f5a6b2
*                       subscriptionType:
*                         type: string
*                         example: Free/Paid  
*                       country:
*                         type: string
*                         example: india
*                       state:
*                         type: string
*                         example: M.P.
*                       city:
*                         type: string
*                         example: indore
*                       primaryColour:
*                         type: string
*                         example: #00FFFF 
*                       secondaryColour:
*                         type: string
*                         example: #0000FF     
*/
router.post("/request", Society.addRequist);

/**
 * @swagger
* /api/society/request/all:
*   get:
*     summary: Society request fetch.
*     tags:
*       - Society
*     responses:
*       200:
*         description: Society request fetch successfully.
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
router.get("/request/all", validateTokenMiddleware.validateToken, Society.allrequest);

/**
* @swagger
* /api/society/request:
*   put:
*     summary: Society request verify.
*     tags:
*       - Society
*     parameters:
*       - in: body
*         description: Society request verify successfully.
*         schema:
*           type: object
*           required:
*             - id 
*           properties:
*             id:
*               type: string 
*             isVerify:
*               type: string
*     responses:
*       200:
*         description: Society request verify successfully.  
 */
router.put("/request",validateTokenMiddleware.validateToken, Society.updateSocietyRequest);

    router.post("/qrCodeGenerator", validateTokenMiddleware.validateToken, Society.addQR);

 app.use("/api/society", router);
};