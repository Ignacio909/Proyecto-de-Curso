const express = require("express");
const AppError = require("../errors/AppError");
const authenticate = require("../middlewares/auntenticationJwt");
const router = express.Router();
const persona = require ("../controllers/autenticacionController");

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Inicia sesión un usuario
 *     description: Esta ruta inicia sesión un usuario. No requiere autenticación.
 *     operationId: iniciarSesion
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Operación exitosa. Retorna los tokens de autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       '400':
 *         description: Error en la solicitud. El cliente ha emitido una solicitud incorrecta o no se encontró un usuario con ese correo y contraseña.
 *       '500':
 *         description: Error interno del servidor. Un error ha ocurrido en el servidor mientras procesaba la solicitud.
 */

//Loguearse
router.post("/login", async (req, res, next) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    throw new AppError("El correo y la contraseña son obligatorios", 400);
  }
  try {
    const tokens = await persona.login(correo, contrasena);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Cierra la sesión del usuario
 *     description: Esta ruta cierra la sesión del usuario. No requiere autenticación.
 *     operationId: cerrarSesion
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       '200':
 *         description: Operación exitosa. Retorna un mensaje indicando que la sesión ha sido cerrada.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Usted a cerrado sesión"
 *       '400':
 *         description: Error en la solicitud. El cliente ha emitido una solicitud incorrecta.
 *       '500':
 *         description: Error interno del servidor. Un error ha ocurrido en el servidor mientras procesaba la solicitud.
 */

//Cerrar sesión
router.post("/logout", async (req, res, next) => {
  const { token } = req.body;
  try {
    res.status(200).send("Usted a cerrado sesión");
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtiene la información del usuario autenticado
 *     description: Esta ruta obtiene la información del usuario autenticado. Requiere roles de 'admin', 'investigador' o 'superadmin'.
 *     operationId: obtenerPerfilUsuario
 *     security:
 *       - bearerAuth: ["admin", "investigador", "superadmin"]
 *     responses:
 *       '200':
 *         description: Operación exitosa. Retorna la información del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Error en la solicitud. El cliente ha emitido una solicitud incorrecta.
 *       '401':
 *         description: No autorizado. El usuario no tiene los permisos necesarios.
 *       '500':
 *         description: Error interno del servidor. Un error ha ocurrido en el servidor mientras procesaba la solicitud.
 */

//Obtener informacion del usuario
router.get(
  "/user/profile",
  authenticate(["admin", "especialista", "paciente"]),
  async (req, res, next) => {
    const { userId } = req.userData;
    try {
      const user = await persona.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /user/refreshtoken:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Refresca el token de autenticación del usuario
 *     description: Esta ruta refresca el token de autenticación del usuario. No requiere autenticación.
 *     operationId: refrescarToken
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '200':
 *         description: Operación exitosa. Retorna el nuevo token de autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Error en la solicitud. El cliente ha emitido una solicitud incorrecta.
 *       '401':
 *         description: No autorizado. La autenticación ha fallado.
 *       '500':
 *         description: Error interno del servidor. Un error ha ocurrido en el servidor mientras procesaba la solicitud.
 */

//Refrescar token
router.post("/user/refreshtoken", async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError("Authentication failed", 401));
  }
  try {
    const token = await persona.refreshAuthToken(refreshToken);
    res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
