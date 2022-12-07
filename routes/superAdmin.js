module.exports = app => {
  const admin = require("../controllers/superAdmin.controller");
  const validateTokenMiddleware = require("../middleware/validateToken");
  let router = require("express").Router();

  /**
    * @swagger
    * /api/superAdmin/login:
    *   post:
    *     summary: Super admin login.
    *     tags:
    *       - Super Admin
    *     parameters:
    *       - in: body
    *         description: Super admin login with email and password.
    *         schema:
    *           type: object
    *           required:
    *             - email
    *             - password
    *           properties:
    *             email:
    *               type: string
    *             password:
    *               type: string
    *     responses:
    *       200:
    *         description: Super admin login successfully.
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
 */
  router.post("/login", admin.login);

  /**
* @swagger
* /api/superAdmin/forgetPassword:
*   post:
*     summary: Super admin forget password.
*     tags:
*       - Super Admin
*     parameters:
*       - in: body
*         description: Super admin forget password.
*         schema:
*           type: object
*           required:
*             - email
*             - newPassword
*           properties:
*             email:
*               type: string
*             newPassword:
*               type: string
*     responses:
*       200:
*         description: Super admin forget password.
*/
  router.post("/forgetPassword", admin.ForgetPassword);

  /**
    * @swagger
    * /api/superAdmin/changePassword:
    *   post:
    *     summary: Super admin change password.
    *     tags:
    *       - Super Admin
    *     parameters:
    *       - in: body
    *         description: Super admin change password.
    *         schema:
    *           type: object
    *           required:
    *             - email
    *             - password
    *             - changePassword
    *           properties:
    *             email:
    *               type: string
    *             password:
    *               type: string
    *             changePassword :
    *               type: string
    *     responses:
    *       200:
    *         description: Super admin change password.
 */
  router.post("/changePassword", validateTokenMiddleware.validateToken, admin.passwordChange);

  app.use("/api/superAdmin", router);
};
