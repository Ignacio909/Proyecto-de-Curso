const express = require("express");
const AppError = require("../errors/AppError");
const authenticate = require("../middlewares/auntenticationJwt");
const router = express.Router();
const persona = require("../controllers/autenticacionController");
const logger = require("../loggers/loggerWinston");

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
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       '400':
 *         description: Error en la solicitud. El cliente ha emitido una solicitud incorrecta o no se encontró un usuario con ese correo y contraseña.
 *       '500':
 *         description: Error interno del servidor. Un error ha ocurrido en el servidor mientras procesaba la solicitud.
 */

//Loguearse
//Loguearse
router.post("/login", async (req, res, next) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return next(new AppError("El correo y la contraseña son obligatorios", 400));
  }
  try {
    const { correo, contrasena, twoFactorToken } = req.body;

    const tokens = await persona.login(correo, contrasena, twoFactorToken);

    logger.info(`Login exitoso - Usuario: ${correo} - IP: ${req.ip}`);
    res.status(200).json(tokens);
  } catch (error) {
    logger.error(`Error en login - Usuario: ${correo} - Error: ${error.message} - IP: ${req.ip}`);
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
    logger.info(`Logout exitoso - IP: ${req.ip}`);
    res.status(200).send("Usted a cerrado sesión");
  } catch (error) {
    logger.error(`Error en logout - Error: ${error.message} - IP: ${req.ip}`);
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
//
router.get(
  "/user/profile",
  authenticate(["admin", "especialista", "paciente"]),
  async (req, res, next) => {
    try {
      // 1. Extraemos de req.user (que definimos en el middleware)
      const { userId, rol } = req.user;

      // 2. Buscamos en la base de datos
      const user = await persona.getUserById(userId);

      // 3. Log corregido para usar req.user
      logger.info(`Sesión validada - ID: ${userId} - Rol: ${rol}`);

      res.status(200).json(user);
    } catch (error) {
      // 4. Evitamos que el log falle si req.user es undefined
      logger.error(`Error al recuperar perfil: ${error.message}`);
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
    logger.info(`Token refrescado exitosamente - IP: ${req.ip}`);
    res.status(200).json({
      token,
    });
  } catch (error) {
    logger.error(`Error al refrescar token - Error: ${error.message} - IP: ${req.ip}`);
    next(error);
  }
});

// Ruta para INICIAR la configuración (Generar QR)
// Requiere estar logueado (authenticate)
router.post("/2fa/generate", authenticate(["admin", "especialista", "paciente"]), async (req, res, next) => {
  try {
    const { userId } = req.user; // Obtenemos el ID del token JWT actual
    const { qrCodeUrl, secret } = await persona.generate2FA(userId);

    res.status(200).json({
      status: "success",
      qrCodeUrl, // Esto va al <img src> del frontend
      secret
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para CONFIRMAR y ACTIVAR el 2FA
router.post("/2fa/verify", authenticate(["admin", "especialista", "paciente"]), async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { token } = req.body; // El código de 6 dígitos

    const isVerified = await persona.verifyAndEnable2FA(userId, token);

    if (isVerified) {
      res.status(200).json({ message: "2FA activado correctamente" });
    } else {
      // Usamos 400 para indicar error de validación
      next(new AppError("El código ingresado es incorrecto", 400));
    }
  } catch (error) {
    next(error);
  }
});

// Ruta para DESACTIVAR el 2FA
router.post("/2fa/disable", authenticate(["admin", "especialista", "paciente"]), async (req, res, next) => {
  try {
    const { userId } = req.user;
    await persona.disable2FA(userId);

    logger.info(`2FA desactivado - UsuarioID: ${userId} - IP: ${req.ip}`);
    res.status(200).json({ message: "2FA desactivado correctamente" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
