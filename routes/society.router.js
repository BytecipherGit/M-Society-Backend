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
     *           properties:
     *             societyName:
     *               type: string
     *             societyAddress:
     *               type: string
     *             registrationNumber:
     *               type: string
     *             pin:
     *               type: string
     *             status:
     *               type: string
     *             adminName:
     *               type: string
     *             email:
     *               type: string
     *             adminAddress:
     *               type: string
     *             phoneNumber:
     *               type: string
     *             designationId:
     *               type: string
     *             houseNumber:
     *               type: string
     *             occupation:
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
     *                       uniqueId:
     *                         type: string
     *                         example: X60B
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
*/
    router.get("/all", validateTokenMiddleware.validateToken, Society.all);

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
*   get:
*     summary: Society search by name.
*     tags:
*       - Society
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
    router.get("/search/:name",validateTokenMiddleware.validateToken,Society.search);
    app.use("/api/society", router);
};