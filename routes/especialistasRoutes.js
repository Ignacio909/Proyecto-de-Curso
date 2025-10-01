const express = require("express");
const router = express.Router();
const especialistasController = require("../controllers/especialistas");

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
// Crear especialista (crea persona + especialista)
router.post("/", async (req, res) => {
	try {
		const { usuario, contrasena, correo, especialidad } = req.body;
		if (!usuario || !contrasena || !correo || !especialidad) {
			return res.status(400).json({ message: "Campos requeridos faltantes" });
		}
		const especialista = await especialistasController.createEspecialista({ usuario, contrasena, correo, especialidad });
		res.status(201).json(especialista);
	} catch (error) {
		res.status(500).json({ message: "Error creando especialista", error: error.message });
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
// Listar
router.get("/", async (req, res) => {
	try {
		const especialistas = await especialistasController.getEspecialistas();
		res.json(especialistas);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo especialistas", error: error.message });
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
// Obtener por ID
router.get("/:id", async (req, res) => {
	try {
		const especialista = await especialistasController.getEspecialistaById(req.params.id);
		if (!especialista) return res.status(404).json({ message: "Especialista no encontrado" });
		res.json(especialista);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo especialista", error: error.message });
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

// Actualizar
router.put("/:id", async (req, res) => {
	try {
		const actualizado = await especialistasController.updateEspecialista(req.params.id, req.body);
		if (!actualizado) return res.status(404).json({ message: "Especialista no encontrado" });
		res.json(actualizado);
	} catch (error) {
		res.status(500).json({ message: "Error actualizando especialista", error: error.message });
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
// Eliminar
router.delete("/:id", async (req, res) => {
	try {
		const eliminado = await especialistasController.deleteEspecialista(req.params.id);
		if (!eliminado) return res.status(404).json({ message: "Especialista no encontrado" });
		res.json({ message: "Especialista eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ message: "Error eliminando especialista", error: error.message });
	}
});

module.exports = router; 