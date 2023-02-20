module.exports = app => {
  const Guard = require("../controllers/guard.controller");
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
 * /api/Guard/:
 *   post:
 *     summary: Guard add.
 *     tags:
 *       - Guard
 *     parameters:
 *       - in: body
 *         description: Guard add.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - age
 *             - phoneNumber
 *             - address
 *             - shift
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             profileImage:
 *               type: string
 *             age:
 *               type: number
 *             shift:
 *               type: string
 *     responses:
 *       200:
 *         description: Guard add successfully.
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
 *                         example: Raju
 *                       address:
 *                         type: string
 *                         example: Indore
 *                       shift:
 *                         type: string
 *                         example: day/night
 *                       phoneNumber:
 *                         type: string
 *                         example: 1234567891
 *                       age:
 *                         type: string
 *                         example: Almost anywhere you live, you're going to have to deal with neighbors
 *                       profileImage:
 *                         type: string
 *                         example: optional
 *                       status:
 *                         type: string
 *                         example: active/Inactive
  */
  router.post("/", validateTokenMiddleware.validateToken, upload.single('profileImage'), Guard.add);

 /**
* @swagger
* /api/Guard/all:
*   get:
*     summary: Guard fetch all with pagination (Guard listing for society admin).
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch with pagination successfully.
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
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       age:
*                         type: number
*                         example: 25
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
 */
  router.get("/", validateTokenMiddleware.validateToken, Guard.all);

 /**
* @swagger
* /api/Guard/:id:
*   get:
*     summary: Guard fetch by id.
*     tags:
*       - Guard
*     responses:
*       200:
*         description: Guard fetch successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   items:
*                     properties:
*                       name:
*                         type: string
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       age:
*                         type: string
*                         example: Almost anywhere you live, you're going to have to deal with neighbors
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Guard.get);

 /**
* @swagger
* /api/Guard/:
*   put:
*     summary: Guard update.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard update.
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
*             phoneNumber:
*               type: string
*             profileImage:
*               type: string
*             age:
*               type: number
*             shift:
*               type: string
*             status:
*                type: string
*     responses:
*       200:
*         description: Guard update successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       name:
*                         type: string
*                         example: Raju
*                       address:
*                         type: string
*                         example: Indore
*                       shift:
*                         type: string
*                         example: day/night
*                       phoneNumber:
*                         type: string
*                         example: 1234567891
*                       age:
*                         type: string
*                         example: Almost anywhere you live, you're going to have to deal with neighbors
*                       profileImage:
*                         type: string
*                         example: optional
*                       status:
*                         type: string
*                         example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, upload.single('profileImage'), Guard.update);

 /**
* @swagger
* /api/Guard/:
*   delete:
*     summary: Guard delete.
*     tags:
*       - Guard
*     parameters:
*       - in: body
*         description: Guard delete.
*         schema:
*           type: object
*           required:
*             - id
*           properties:
*             id:
*               type: string 
*     responses:
*       200:
*         description: Guard delete successfully.
  */
  router.delete("/", validateTokenMiddleware.validateToken, Guard.delete);

  app.use("/api/guard", router);
};