const express = require("express");
const router = express.Router();
const registroClinicosController = require("../controllers/registros-clinicos");

/**
 * @swagger
 * tags:
 *   name: RegistrosClinicos
 *   description: Endpoints para gestionar registros clínicos
 */

/**
 * @swagger
 * /registros-clinicos:
 *   post:
 *     summary: Crear un registro clínico
 *     tags: [RegistrosClinicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroClinico'
 *     responses:
 *       201:
 *         description: Registro clínico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroClinico'
 *       500:
 *         description: Error interno del servidor
 */
// CRUD de Registros Clínicos
router.post("/",async (req,res) => {
    try{
        const registro = await registroClinicosController.createRegistroClinico(req.body);    
        res.status(201).json(registro);
    } catch(error) {
        res.status(500).json({message: "Error al crear el registro", error: error.message});
    }
});

/**
 * @swagger
 * /registros-clinicos:
 *   get:
 *     summary: Listar todos los registros clínicos
 *     tags: [RegistrosClinicos]
 *     responses:
 *       200:
 *         description: Lista de registros clínicos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroClinico'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", async (req, res) => {
    try {
        const registros = await registroClinicosController.getRegistrosClinicos();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo registros clínicos", error: error.message });
    }
});

/**
 * @swagger
 * /registros-clinicos/{id}:
 *   get:
 *     summary: Obtener un registro clínico por ID
 *     tags: [RegistrosClinicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del registro clínico
 *     responses:
 *       200:
 *         description: Registro clínico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroClinico'
 *       404:
 *         description: Registro clínico no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", async (req, res) => {
    try {
        const registro = await registroClinicosController.getRegistroClinicoById(req.params.id);
        if (!registro) {
            return res.status(404).json({ message: "Registro clínico no encontrado" });
        }
        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el registro clínico", error: error.message });
    }
});

/**
 * @swagger
 * /registros-clinicos/{id}:
 *   put:
 *     summary: Actualizar un registro clínico
 *     tags: [RegistrosClinicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del registro clínico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroClinico'
 *     responses:
 *       200:
 *         description: Registro clínico actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroClinico'
 *       404:
 *         description: Registro clínico no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", async (req, res) => {
    try {
        const actualizado = await registroClinicosController.updateRegistroClinico(req.params.id, req.body);
        if (!actualizado) {
            return res.status(404).json({ message: "Registro clínico no encontrado" });
        }
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando registro clínico", error: error.message });
    }
});

/**
 * @swagger
 * /registros-clinicos/{id}:
 *   delete:
 *     summary: Eliminar un registro clínico
 *     tags: [RegistrosClinicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del registro clínico
 *     responses:
 *       200:
 *         description: Registro clínico eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registro clínico eliminado correctamente"
 *       404:
 *         description: Registro clínico no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", async (req, res) => {
    try {
        const eliminado = await registroClinicosController.deleteRegistroClinico(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ message: "Registro clínico no encontrado" });
        }
        res.json({ message: "Registro clínico eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando registro clínico", error: error.message });
    }
});

module.exports = router;