const express = require("express");
const router = express.Router();
const especialistasController = require("../controllers/especialistas");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const upload = require("../middlewares/multerConfig");
const authenticate = require("../middlewares/auntenticationJwt");

/**
 * @swagger
 * tags:
 *   name: Especialistas
 *   description: Endpoints para gestionar especialistas
 */

/**
 * @swagger
 * /especialistas:
 *   post:
 *     summary: Crear un especialista
 *     tags: [Especialistas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasena
 *               - correo
 *               - especialidad
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario único
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               especialidad:
 *                 type: string
 *                 description: Especialidad médica
 *     responses:
 *       201:
 *         description: Especialista creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialista'
 *       400:
 *         description: Campos requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authenticate(["admin"]), upload.single('imagen'), async (req, res, next) => {
	try {
		const { usuario, contrasena, correo, especialidad } = req.body;

		if (!usuario || !contrasena || !correo || !especialidad) {
			return next(new AppError("Campos requeridos faltantes", 400));
		}

		const imagen = req.file ? `/images/profile/${req.file.filename}` : null;
		const especialista = await especialistasController.createEspecialista({ usuario, contrasena, correo, especialidad, imagen });

		// Log de éxito
		logger.info(`POST/ Especialista creado - ID: ${especialista.id} - Usuario: ${usuario} - IP: ${req.ip}`);

		res.status(201).json(especialista);
	} catch (error) {
		next(new AppError("Error creando especialista: " + error.message, 500));
	}
});

/**
 * @swagger
 * /especialistas:
 *   get:
 *     summary: Listar todos los especialistas
 *     tags: [Especialistas]
 *     responses:
 *       200:
 *         description: Lista de especialistas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Especialista'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authenticate(["admin", "paciente", "especialista"]), async (req, res, next) => {
	try {
		const especialistas = await especialistasController.getEspecialistas();

		// Log de éxito
		logger.info(`GET/ Lista de especialistas obtenida - Total: ${especialistas.length} - IP: ${req.ip}`);

		res.json(especialistas);
	} catch (error) {
		next(new AppError("Error obteniendo especialistas: " + error.message, 500));
	}
});

/**
 * @swagger
 * /especialistas/{id}:
 *   get:
 *     summary: Obtener un especialista por ID
 *     tags: [Especialistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del especialista
 *     responses:
 *       200:
 *         description: Especialista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialista'
 *       404:
 *         description: Especialista no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", authenticate(["admin", "especialista"]), async (req, res, next) => {
	try {
		const especialista = await especialistasController.getEspecialistaById(req.params.id);

		if (!especialista) {
			return next(new AppError("Especialista no encontrado", 404));
		}

		// Log de éxito
		logger.info(` GET/ Especialista obtenido - ID: ${req.params.id} - IP: ${req.ip}`);

		res.json(especialista);
	} catch (error) {
		next(new AppError("Error obteniendo especialista: " + error.message, 500));
	}
});

/**
 * @swagger
 * /especialistas/{id}:
 *   put:
 *     summary: Actualizar un especialista
 *     tags: [Especialistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del especialista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               especialidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Especialista actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialista'
 *       404:
 *         description: Especialista no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", authenticate(["admin", "especialista"]), upload.single('imagen'), async (req, res, next) => {
	try {
		// Obtener la ruta de la imagen si se subió
		const imagen = req.file ? `/images/profile/${req.file.filename}` : undefined;

		const datosActualizados = { ...req.body };
		if (imagen) {
			datosActualizados.imagen = imagen;
		}

		const actualizado = await especialistasController.updateEspecialista(req.params.id, datosActualizados);

		if (!actualizado) {
			return next(new AppError("Especialista no encontrado", 404));
		}

		// Log de éxito
		logger.info(`PUT/ Especialista actualizado - ID: ${req.params.id} - IP: ${req.ip}`);

		res.json(actualizado);
	} catch (error) {
		next(new AppError("Error actualizando especialista: " + error.message, 500));
	}
});

/**
 * @swagger
 * /especialistas/{id}:
 *   delete:
 *     summary: Eliminar un especialista
 *     tags: [Especialistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del especialista
 *     responses:
 *       200:
 *         description: Especialista eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Especialista eliminado correctamente"
 *       404:
 *         description: Especialista no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", authenticate(["admin"]), async (req, res, next) => {
	try {
		const eliminado = await especialistasController.deleteEspecialista(req.params.id);

		if (!eliminado) {
			return next(new AppError("Especialista no encontrado", 404));
		}

		// Log de éxito
		logger.info(`DELETE/ Especialista eliminado - ID: ${req.params.id} - IP: ${req.ip}`);

		res.json({ message: "Especialista eliminado correctamente" });
	} catch (error) {
		next(new AppError("Error eliminando especialista: " + error.message, 500));
	}
});

module.exports = router;