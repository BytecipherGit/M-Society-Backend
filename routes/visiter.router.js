module.exports = app => {
    const Visiter = require("../controllers/visiter.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();
    const multer = require('multer');
    //for file store
    const storage = multer.diskStorage({
        destination: 'public/uploads/guard',
        filename: (request, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
    const upload = multer({ storage: storage });
    /**
   * @swagger
   * /api/visitor/:
   *   post:
   *     summary: Visitor add.
   *     tags:
   *       - Visitor
   *     parameters:
   *       - in: body
   *         description: Visitor add.
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - houseNumber
   *             - phoneNumber
   *             - countryCode
   *             - image
   *             - reasone
   *           properties:
   *             name:
   *               type: string
   *             houseNumber:
   *               type: string
   *             phoneNumber:
   *               type: string
   *             countryCode:
   *               type: string
   *             image:
   *               type: date
   *             reasone:
   *               type: string
   *     responses:
   *       200:
   *         description: Visitor add successfully.
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
   *                         example: Raj
   *                       reasone:
   *                         type: string
   *                         example: delivery
   *                       inTime:
   *                         type: string
   *                         example: 02.30 Am
   *                       outTime:
   *                         type: string
   *                         example: 06.30 Pm
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       countryCode:
   *                         type: date
   *                         example: +91
   *                       houseNumber:
   *                         type: string
   *                         example: 491
   *                       date:
   *                         type: string
   *                         example: 2023-05-20 
    */
    router.post("/", validateTokenMiddleware.validateToken, upload.single('image'), Visiter.add);

    /**
   * @swagger
   * /api/visitor/:
   *   get:
   *     summary: Visitor fetch with pagination for admin (visitor listing for admin with date filter).
   *     tags:
   *       - Visitor
   *     parameters:
   *     responses:
   *       200:
   *         description: Visitor fetch with pagination for admin successfully.
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
   *                         example: Raj
   *                       reasone:
   *                         type: string
   *                         example: delivery
   *                       inTime:
   *                         type: string
   *                         example: 02.30 Am
   *                       outTime:
   *                         type: string
   *                         example: 06.30 Pm
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       countryCode:
   *                         type: date
   *                         example: +91
   *                       houseNumber:
   *                         type: string
   *                         example: 491
   *                       date:
   *                         type: string
   *                         example: 2023-05-20 
    */
    router.get("/", validateTokenMiddleware.validateToken, Visiter.get);

    /**
   * @swagger
   * /api/visitor/guard/all:
   *   get:
   *     summary: Visitor fetch for user (visitor listing for guard with date filter).
   *     tags:
   *       - Visitor
   *     parameters:
   *     responses:
   *       200:
   *         description: Visitor fetch for guard successfully.
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
   *                         example: Raj
   *                       reasone:
   *                         type: string
   *                         example: delivery
   *                       inTime:
   *                         type: string
   *                         example: 02.30 Am
   *                       outTime:
   *                         type: string
   *                         example: 06.30 Pm
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       countryCode:
   *                         type: date
   *                         example: +91
   *                       houseNumber:
   *                         type: string
   *                         example: 491
   *                       date:
   *                         type: string
   *                         example: 2023-05-20 
    */
    router.get("/guard/all", validateTokenMiddleware.validateToken, Visiter.getAllVisiter);

    /**
 * @swagger
 * /api/visitor/app/all:
 *   get:
 *     summary: Visitor fetch for user App.
 *     tags:
 *       - Visitor
 *     parameters:
 *     responses:
 *       200:
 *         description: Visitor fetch for user App successfully.
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
 *                         example: Raj
 *                       reasone:
 *                         type: string
 *                         example: delivery
 *                       inTime:
 *                         type: string
 *                         example: 02.30 Am
 *                       outTime:
 *                         type: string
 *                         example: 06.30 Pm
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       countryCode:
 *                         type: date
 *                         example: +91
 *                       houseNumber:
 *                         type: string
 *                         example: 491
 *                       date:
 *                         type: string
 *                         example: 2023-05-20 
  */
    router.get("/app/all", validateTokenMiddleware.validateToken, Visiter.getAllVisiterforuser);

    /**
* @swagger
* /api/visitor/:phone:
*   get:
*     summary: Visitor fetch by phone number (for guard).
*     tags:
*       - Visitor
*     parameters:
*     responses:
*       200:
*         description: Visitor fetch by phone number (for guard).
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
*                         example: Raj
*                       reasone:
*                         type: string
*                         example: delivery
*                       inTime:
*                         type: string
*                         example: 02.30 Am
*                       outTime:
*                         type: string
*                         example: 06.30 Pm
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       countryCode:
*                         type: date
*                         example: +91
*                       houseNumber:
*                         type: string
*                         example: 491
*                       date:
*                         type: string
*                         example: 2023-05-20 
*/
    router.get("/:phone", validateTokenMiddleware.validateToken, Visiter.getbyphone);

    /**
   * @swagger
   * /api/visitor/out:
   *   put:
   *     summary: Visitor out time added.
   *     tags:
   *       - Visitor
   *     parameters:
   *       - in: body
   *         description: Visitor add.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string
   *     responses:
   *       200:
   *         description: Visitor out time added successfully.
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
   *                         example: Raj
   *                       reasone:
   *                         type: string
   *                         example: delivery
   *                       inTime:
   *                         type: string
   *                         example: 02.30 Pm
   *                       phoneNumber:
   *                         type: string
   *                         example: 1234567891
   *                       countryCode:
   *                         type: date
   *                         example: +91
   *                       houseNumber:
   *                         type: string
   *                         example: 491
   *                       date:
   *                         type: string
   *                         example: 2023-05-20 
   *                       outTime:
   *                         type: string
   *                         example: 06.30 Pm
    */
    router.put("/out", validateTokenMiddleware.validateToken, Visiter.updateOut);
    app.use("/api/visitor", router);
};