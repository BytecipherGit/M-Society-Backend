module.exports = app => {
    const Profession = require("../controllers/profession.controller");
    const validateTokenMiddleware = require("../middleware/validateToken");
    let router = require("express").Router();

    /**
     * @swagger
     * /api/Profession/:
     *   post:
     *     summary: Profession add.
     *     tags:
     *       - Profession
     *     parameters:
     *       - in: body
     *         description: Profession add.
     *         schema:
     *           type: object
     *           required:
     *             - name
     *           properties:
     *             name:
     *               type: string
     *     responses:
     *       200:
     *         description: Profession add successfully.
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
    router.post("/", validateTokenMiddleware.validateToken, Profession.add);

    /**
  * @swagger
  * /api/Profession/:
  *   get:
  *     summary: Profession fetch with pagination all (Profession listing for super admin).
  *     tags:
  *       - Profession
  *     responses:
  *       200:
  *         description: Profession fetch with pagination successfully.
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
  *                         example: admin
  *                       status:
  *                         type: string
  *                         example: active/Inactive
  */
    router.get("/", validateTokenMiddleware.validateToken, Profession.getpagination);

    /**
     * @swagger
     * /api/Profession/:id:
     *   get:
     *     summary: Profession fetch by id.
     *     tags:
     *       - Profession
     *     responses:
     *       200:
     *         description: Profession fetch successfully.
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
     *                         example: admin
     *                       status:
     *                         type: string
     *                         example: active/Inactive
   */
    router.get("/:id", validateTokenMiddleware.validateToken, Profession.get);

    /**
   * @swagger
   * /api/Profession/:
   *   delete:
   *     summary: Profession delete.
   *     tags:
   *       - Profession
   *     parameters:
   *       - in: body
   *         description: Profession delete.
   *         schema:
   *           type: object
   *           required:
   *             - id
   *           properties:
   *             id:
   *               type: string 
   *     responses:
   *       200:
   *         description: Profession delete successfully.
  */
    router.delete("/", validateTokenMiddleware.validateToken, Profession.delete);

    /**
     * @swagger
     * /api/Profession/:
     *   put:
     *     summary: Profession update.
     *     tags:
     *       - Profession
     *     parameters:
     *       - in: body
     *         description: Profession update.
     *         schema:
     *           type: object
     *           required:
     *             - id
     *           properties:
     *             name:
     *               type: string
     *             id:
     *               type: string 
     *             status:
     *               type: string 
     *     responses:
     *       200:
     *         description: Profession update successfully.
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
     *                         example: admin
     *                       status:
     *                         type: string
     *                         example: active/Inactive
   */
    router.put("/", validateTokenMiddleware.validateToken, Profession.updateProfession);

    app.use("/api/profession", router);
};