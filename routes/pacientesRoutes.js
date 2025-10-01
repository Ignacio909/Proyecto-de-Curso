const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientes");

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
 *               - carnetIdentidad
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
 *               carnetIdentidad:
 *                 type: string
 *                 description: Carnet de identidad
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
// Crear paciente (crea persona + paciente)
router.post("/", async (req, res) => {
	try {
		const { usuario, contrasena, correo, nombre, apellidos, telefono, carnetIdentidad } = req.body;
		if (!usuario || !contrasena || !correo || !telefono || !carnetIdentidad) {
			return res.status(400).json({ message: "Campos requeridos faltantes" });
		}
		const paciente = await pacientesController.createPaciente({ usuario, contrasena, correo, nombre, apellidos, telefono, carnetIdentidad });
		res.status(201).json(paciente);
	} catch (error) {
		res.status(500).json({ message: "Error creando paciente", error: error.message });
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
// Listar
router.get("/", async (req, res) => {
	try {
		const pacientes = await pacientesController.getPacientes();
		res.json(pacientes);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo pacientes", error: error.message });
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
// Obtener por ID
router.get("/:id", async (req, res) => {
	try {
		const paciente = await pacientesController.getPacienteById(req.params.id);
		if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
		res.json(paciente);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo paciente", error: error.message });
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
// Actualizar
router.put("/:id", async (req, res) => {
	try {
		const actualizado = await pacientesController.updatePaciente(req.params.id, req.body);
		if (!actualizado) return res.status(404).json({ message: "Paciente no encontrado" });
		res.json(actualizado);
	} catch (error) {
		res.status(500).json({ message: "Error actualizando paciente", error: error.message });
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
// Eliminar
router.delete("/:id", async (req, res) => {
	try {
		const eliminado = await pacientesController.deletePaciente(req.params.id);
		if (!eliminado) return res.status(404).json({ message: "Paciente no encontrado" });
		res.json({ message: "Paciente eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ message: "Error eliminando paciente", error: error.message });
	}
});

module.exports = router; 