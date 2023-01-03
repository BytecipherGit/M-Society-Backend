module.exports = app => {
  const Notice = require("../controllers/notice.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  /**
   * @swagger
   * /api/notice/:
   *   post:
   *     summary: Notice add.
   *     tags:
   *       - Notice
   *     parameters:
   *       - in: body
   *         description: Notice add.
   *         schema:
   *           type: object
   *           required:
   *             - name
   *           properties:
   *             title:
   *               type: string
   *             description:
   *               type: string
   *             status:
   *               type: string
   *     responses:
   *       200:
   *         description: Notice add successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: 
   *                   items:
   *                     properties:
   *                       title:
   *                         type: string
   *                         example: A blood donation camp to be held.
   *                       description:
   *                         type: string
   *                         example: Our society is organising a blood donation camp on Saturday, 5th May 2023.
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.post("/", validateTokenMiddleware.validateToken, Notice.add);

  /**
 * @swagger
 * /api/notice/all:
 *   get:
 *     summary: Notice fetch all with pegination (notice listing for society admin).
 *     tags:
 *       - Notice
 *     responses:
 *       200:
 *         description: Notice fetch with pegination successfully.
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
 *                       title:
 *                         type: string
 *                         example: A blood donation camp to be held.
 *                       description:
 *                         type: string
 *                         example: Our society is organising a blood donation camp on Saturday, 5th May 2023.
 *                       status:
 *                         type: string
 *                         example: active/Inactive
*/
  router.get("/all", validateTokenMiddleware.validateToken, Notice.all);

  /**
   * @swagger
   * /api/notice/:id:
   *   get:
   *     summary: Notice fetch by id.
   *     tags:
   *       - Notice
   *     responses:
   *       200:
   *         description: Notice fetch successfully.
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
   *                       title:
   *                         example: A blood donation camp to be held.
   *                       description:
   *                         type: string
   *                         example: Our society is organising a blood donation camp on Saturday, 5th May 2023.
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/:id", validateTokenMiddleware.validateToken, Notice.get);

  /**
   * @swagger
   * /api/notice/search/:title:
   *   get:
   *     summary: Notice search by title.
   *     tags:
   *       - Notice
   *     responses:
   *       200:
   *         description: Notice search by title.
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
   *                       title:
   *                         type: string
   *                         example: A blood donation camp to be held.
   *                       description:
   *                         type: string
   *                         example: Our society is organising a blood donation camp on Saturday, 5th May 2023.
   *                       status:
   *                         type: string
   *                         example: active/Inactive
 */
  router.get("/search/:title", validateTokenMiddleware.validateToken, Notice.search);

  /**
* @swagger
* /api/notice/resident/all:
*   post:
*     summary: Notice fetch for residentialUser (notice listing for residentialUser).
*     tags:
*       - Notice
*     parameters:
*       - in: body
*         description: Notice add.
*         schema:
*           type: object
*           required:
*             - societyId
*           properties:
*             title:
*               type: string
*             description:
*               type: string
*             status:
*               type: string
*     responses:
*       200:
*         description: Notice fetch successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: 
*                   items:
*                     properties:
*                       title:
*                         type: string
*                         example: A blood donation camp to be held.
*                       description:
*                         type: string
*                         example: Our society is organising a blood donation camp on Saturday, 5th May 2023.
*                       status:
*                         type: string
*                         example: active/Inactive
*/
  router.post("/resident/all", validateTokenMiddleware.validateToken, Notice.allnotice);

  /**
   * @swagger
   * /api/notice/:
   *   put:
   *     summary: Notice update.
   *     tags:
   *       - Notice
   *     parameters:
   *       - in: body
   *         description: Notice update.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string
   *             title:
   *               type: string 
   *             description:
   *               type: string 
   *             status:
   *               type: string    
   *     responses:
   *       200:
   *         description: Notice update successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   example: A blood donation camp to be held.
   *               description:
   *                   type: string
   *                   example: Our society is organising a blood donation camp on Saturday, 5th March 2023.
   *               status:
   *                   type: string
   *                   example: active/Inactive
 */
  router.put("/", validateTokenMiddleware.validateToken, Notice.update);

  /**
  * @swagger
  * /api/notice/:
  *   delete:
  *     summary: Notice delete.
  *     tags:
  *       - Notice
  *     parameters:
  *       - in: body
  *         description: Notice delete.
  *         schema:
  *           type: object
  *           required:
  *             - id
  *           properties:
  *             id:
  *               type: string 
  *     responses:
  *       200:
  *         description: Notice delete successfully.
    */
  router.delete("/", validateTokenMiddleware.validateToken, Notice.delete);

  app.use("/api/notice", router);
};