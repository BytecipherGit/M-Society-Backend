module.exports = (app) => {
  let router = require("express").Router();
  const validateTokenMiddleware = require("../middleware/validateToken");
  const Support = require("../controllers/support.controller");
  const multer = require('multer');

  //for image store
  const storage = multer.diskStorage({
    destination: 'public/uploads/support',
    filename: (request, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  /**
    * @swagger
    * /api/support/:
    *   post:
    *     summary: Support request by society admin and service provider
    *     tags:
    *       - Support
    *     parameters:
    *       - in: body
    *         description: Support request by society admin and service provider
    *         schema:
    *           type: object
    *           required:
    *             - type
    *             - chat
    *             - userId
    *             - image
    *           properties:
    *             type:
    *               type: string
    *             chat:
    *               type: object
    *             userId:
    *               type: string
    *             image:
    *               type: string
    *     responses:
    *       200:
    *         description: Support request by society admin and service provider
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
    *                       type:
    *                         type: string
    *                         example: email/chat/contact
    *                       chat:
    *                         type: object
    *                         example: {'subject':"",'text':""}
    *                       status:
    *                         type: string
    *                         example: new/inProgess/resolved/close/open
    *                       image:
    *                         type: string
    *                         example: image.png
 */
  router.post('/', validateTokenMiddleware.validateToken, upload.single('chat[image]'), Support.add);

  /**
   * @swagger
   * /api/support/reply:
   *   post:
   *     summary: Support reply by society adimn , service provider and super admin
   *     tags:
   *       - Support
   *     parameters:
   *       - in: body
   *         description:  Support reply by society adimn , service provider and super admin
   *         schema:
   *           type: object
   *           required:
   *             - type 
   *             - chat
   *             - userId
   *             - status
   *           properties:
   *             type:
   *               type: string
   *             chat:
   *               type: object
   *             userId:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description:  Support reply by society adimn , service provider and super admin
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
   *                       type:
   *                         type: string
   *                         example: email/chat/contact
   *                       chat:
   *                         type: object
   *                         example: {'subject':"",'text':""}
   *                       status:
   *                         type: string
   *                         example: new/inProgess/resolved/close/open
   *                       image:
   *                         type: string
   *                         example: image.png
*/
  router.post('/reply', validateTokenMiddleware.validateToken, upload.single('chat[image]'), Support.reply);

  /**
 * @swagger
 * /api/support/:
 *   get:
 *     summary: Fetch all support request 
 *     tags:
 *       - Support
 *     parameters:
 *         description:  Fetch all support request 
 *     responses:
 *       200:
 *         description:  Fetch all support request 
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
 *                       type:
 *                         type: string
 *                         example: email/chat/contact
 *                       chat:
 *                         type: object
 *                         example: [{'subject':"",'text':"",'replyUserType':""}]
 *                       status:
 *                         type: string
 *                         example: new/inProgess/resolved/close/open
 *                       image:
 *                         type: string
 *                         example: image.png
*/
  router.get('/', validateTokenMiddleware.validateToken, Support.fetchAll);

  /**
   * @swagger
   * /api/support/user/:id:
   *   get:
   *     summary: Fetch all support request by user id
   *     tags:
   *       - Support
   *     parameters:
   *         description:  Fetch all support request by user id
   *     responses:
   *       200:
   *         description:  Fetch all support request by user id
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
   *                       type:
   *                         type: string
   *                         example: email/chat/contact
   *                       chat:
   *                         type: object
   *                         example: [{'subject':"",'text':"",'replyUserType':""}]
   *                       status:
   *                         type: string
   *                         example: new/inProgess/resolved/close/open
   *                       image:
   *                         type: string
   *                         example: image.png
  */
  router.get('/user/:id', validateTokenMiddleware.validateToken, Support.fetchAllByUser);

  /**
* @swagger
* /api/support/:id:
*   get:
*     summary: Fetch support request by id
*     tags:
*       - Support
*     parameters:
*         description:  Fetch support request by id
*     responses:
*       200:
*         description:  Fetch support request by id
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
*                       type:
*                         type: string
*                         example: email/chat/contact
*                       chat:
*                         type: array
*                         example: [{'subject':"",'text':"",'replyUserType':""}]
*                       status:
*                         type: string
*                         example: new/inProgess/resolved/close/open
*                       image:
*                         type: string
*                         example: image.png
*/
  router.get('/:id', validateTokenMiddleware.validateToken, Support.fetch);

 /**
* @swagger
* /api/support/:id:
*   delete:
*     summary: Delete support request by id
*     tags:
*       - Support
*     parameters:
*         description:  Delete support request by id
*     responses:
*       200:
*         description:  Delete support request by id
*/
  router.delete('/:id',validateTokenMiddleware.validateToken,Support.delete);

  app.use('/api/support', router);
}