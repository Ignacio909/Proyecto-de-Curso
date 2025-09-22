const express = require("express");
const router = express.Router();
const historiaClinicaControllers = require("../controllers/historias-clinicas");

/**
 * @swagger
 * tags:
 *   name: HistoriasClinicas
 *   description: Endpoints para historias clínicas
 */

/**
 * @swagger
 * /historias-clinicas:
 *   post:
 *     summary: Crear historia clínica
 *     tags: [HistoriasClinicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoriaClinica'
 *     responses:
 *       201:
 *         description: Creada
 *       400:
 *         description: Error de validación
 */
// CRUD de Historias Clínicas
router.post("/", async (req, res) => {
    try {
        const historia = await historiaClinicaControllers.createHistoriaClinica(req.body);
        res.status(201).json(historia);
    } catch (error) {
        res.status(400).json({ message: "Error creando historia clínica", error: error.message });
    }
});

/**
 * @swagger
 * /historias-clinicas:
 *   get:
 *     summary: Listar historias clínicas
 *     tags: [HistoriasClinicas]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", async (req, res) => {
    try {
        const historias = await historiaClinicaControllers.getHistoriasClinicas();
        res.json(historias);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo historias clínicas", error: error.message });
    }
});

/**
 * @swagger
 * /historias-clinicas/{id}:
 *   get:
 *     summary: Obtener historia clínica por ID
 *     tags: [HistoriasClinicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrada
 */
router.get("/:id",async (req, res) => {
    try {
        const historia = await historiaClinicaControllers.getHistoriaClinicaById(req.params.id);
        if (!historia) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }

        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo historia clínica", error: error.message });
    } 
});

/**
 * @swagger
 * /historias-clinicas/{id}:
 *   put:
 *     summary: Actualizar historia clínica
 *     tags: [HistoriasClinicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoriaClinica'
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrada
 */
router.put("/:id", async (req, res) => {
    try {
        const historia = await historiaClinicaControllers.updateHistoriaClinica(req.params.id, req.body);
        if (!historia) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }
        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando historia clínica", error: error.message });
    }
});

/**
 * @swagger
 * /historias-clinicas/{id}:
 *   delete:
 *     summary: Eliminar historia clínica
 *     tags: [HistoriasClinicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Eliminada
 *       404:
 *         description: No encontrada
 */
router.delete("/:id", async (req, res) => {
    try {
        const eliminando = await historiaClinicaControllers.deleteHistoriaClinica(req.params.id);
        if (!eliminando) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }
        res.json({ message: "Historia clínica eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando historia clínica", error: error.message });
    }
});

/**
 * @swagger
 * /historias-clinicas/paciente/{pacienteId}:
 *   get:
 *     summary: Obtener historia clínica por pacienteId
 *     tags: [HistoriasClinicas]
 *     parameters:
 *       - in: path
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrada
 */
// Buscar historia clínica por pacienteId
router.get("/paciente/:pacienteId", async (req, res) => {
    try {
        const historia = await historiaClinicaControllers.findHistoriaClinicaByPacienteId(req.params.pacienteId);
        if (!historia) {
            return res.status(404).json({ message: "Este paciente no tiene historia clínica" });
        }
        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error buscando historia clínica", error: error.message });
    }
});

module.exports = router;