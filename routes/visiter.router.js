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
   *     summary: Visitor fetch for user (visitor listing for user with date filter).
   *     tags:
   *       - Visitor
   *     parameters:
   *     responses:
   *       200:
   *         description: Visitor fetch for user successfully.
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

    router.get("/:phone", validateTokenMiddleware.validateToken, Visiter.get);
    app.use("/api/visitor", router);
};