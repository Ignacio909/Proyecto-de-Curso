const express = require("express");
const router = express.Router();
const pacientesController = require ("../controllers/pacientes");
const AppError = require ("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const upload = require ("../middlewares/multerConfig");
/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Endpoints para gestionar pacientes
 */

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Crear un paciente
 *     tags: [Pacientes]
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
 *               - telefono
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
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Campos requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
router.post("/",upload.single('imagen'), async (req, res, next) => {
	try {
		const { usuario, contrasena, correo, telefono, carnetIdentidad } = req.body;
		const imagen = req.file ? `/images/profile/${req.file.filename}` : undefined;
		// Validación de campos requeridos
		if (!usuario || !contrasena || !correo || !telefono || !carnetIdentidad ) {
			return next(new AppError("Campos requeridos faltantes", 400));
		}
		
		const paciente = await pacientesController.createPaciente({ usuario, contrasena, correo, imagen, telefono, carnetIdentidad });
		
		// Log de éxito
		logger.info(`Paciente creado exitosamente - ID: ${paciente.id} - Usuario: ${usuario} - IP: ${req.ip}`);
		
		res.status(201).json(paciente);
	} catch (error) {
		next(new AppError("Error creando paciente: " + error.message, 500));
	}
});

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar todos los pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", async (req, res, next) => {
	try {
		const pacientes = await pacientesController.getPacientes();
		
		// Log de éxito
		logger.info(`Lista de pacientes obtenida - Total: ${pacientes.length} - IP: ${req.ip}`);
		
		res.json(pacientes);
	} catch (error) {
		next(new AppError("Error obteniendo pacientes: " + error.message, 500));
	}
});

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente por ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", async (req, res, next) => {
	try {
		const paciente = await pacientesController.getPacienteById(req.params.id);
		
		if (!paciente) {
			return next(new AppError("Paciente no encontrado", 404));
		}
		
		// Log de éxito
		logger.info(`Paciente obtenido - ID: ${req.params.id} - IP: ${req.ip}`);
		
		res.json(paciente);
	} catch (error) {
		next(new AppError("Error obteniendo paciente: " + error.message, 500));
	}
});

/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     summary: Actualizar un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del paciente
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
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               telefono:
 *                 type: string
 *               carnetIdentidad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paciente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id",upload.single('imagen'), async (req, res, next) => {
	try {

		const imagen = req.file ? `/images/perfiles/${req.file.filename}` : undefined;
		
		const actualizado = await pacientesController.updatePaciente(req.params.id, req.body, imagen);
		
		if (!actualizado) {
			return next(new AppError("Paciente no encontrado", 404));
		}
		
		// Log de éxito
		logger.info(`Paciente actualizado - ID: ${req.params.id} - IP: ${req.ip}`);
		
		res.json(actualizado);
	} catch (error) {
		next(new AppError("Error actualizando paciente: " + error.message, 500));
	}
});

/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     summary: Eliminar un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del paciente
 *     responses:
 *       200:
 *         description: Paciente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Paciente eliminado correctamente"
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", async (req, res, next) => {
	try {
		const eliminado = await pacientesController.deletePaciente(req.params.id);
		
		if (!eliminado) {
			return next(new AppError("Paciente no encontrado", 404));
		}
		
		// Log de éxito
		logger.info(`Paciente eliminado - ID: ${req.params.id} - IP: ${req.ip}`);
		
		res.json({ message: "Paciente eliminado correctamente" });
	} catch (error) {
		next(new AppError("Error eliminando paciente: " + error.message, 500));
	}
});

module.exports = router;