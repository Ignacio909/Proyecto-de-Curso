const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citas");
const Citas = require("../models/citas");
const Pacientes = require("../models/pacientes");
const Especialistas = require("../models/especialistas");

// Validadores simples
const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTime = (value) => /^\d{2}:[0-5]\d(:[0-5]\d)?$/.test(value);
const isValidEstado = (value) => ["pendiente", "completada", "cancelada"].includes(value);

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Endpoints para gestionar citas
 */

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       201:
 *         description: Cita creada
 *       400:
 *         description: Validación fallida
 *       404:
 *         description: Paciente o Especialista no encontrado
 *       409:
 *         description: Conflicto de agenda
 */
// Crear cita
router.post("/", async (req, res) => {
    try {
        const { fecha, hora, estado = "pendiente", pacienteId, especialistaId } = req.body;

        if (!fecha || !isValidDate(fecha)) {
            return res.status(400).json({ message: "'fecha' es requerida en formato YYYY-MM-DD" });
        }
        if (!hora || !isValidTime(hora)) {
            return res.status(400).json({ message: "'hora' es requerida en formato HH:mm o HH:mm:ss" });
        }
        if (estado && !isValidEstado(estado)) {
            return res.status(400).json({ message: "'estado' inválido" });
        }
        if (!pacienteId) {
            return res.status(400).json({ message: "'pacienteId' es requerido" });
        }
        if (!especialistaId) {
            return res.status(400).json({ message: "'especialistaId' es requerido" });
        }

        const paciente = await Pacientes.findByPk(pacienteId);
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        const especialista = await Especialistas.findByPk(especialistaId);
        if (!especialista) {
            return res.status(404).json({ message: "Especialista no encontrado" });
        }

        // Verificar conflicto de agenda: misma fecha/hora con el mismo especialista
        const conflicto = await Citas.findOne({ where: { fecha, hora, especialistaId } });
        if (conflicto) {
            return res.status(409).json({ message: "Conflicto de agenda: el especialista ya tiene una cita en ese horario" });
        }

        const cita = await citasController.createCita({ fecha, hora, estado, pacienteId, especialistaId });
        res.status(201).json(cita);
    } catch (error) {
        res.status(500).json({ message: "Error creando la cita", error: error.message });
    }
});

/**
 * @swagger
 * /citas:
 *   get:
 *     summary: Listar citas
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas
 */
// Listar citas
router.get("/", async (req, res) => {
    try {
        const citas = await citasController.getCitas();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo citas", error: error.message });
    }
});

/**
 * @swagger
 * /citas/{id}:
 *   get:
 *     summary: Obtener una cita por ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cita encontrada
 *       404:
 *         description: Cita no encontrada
 */
// Obtener cita por ID
router.get("/:id", async (req, res) => {
    try {
        const cita = await citasController.getCitaById(req.params.id);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        res.json(cita);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo la cita", error: error.message });
    }
});

/**
 * @swagger
 * /citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
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
 *             $ref: '#/components/schemas/Cita'
 *     responses:
 *       200:
 *         description: Cita actualizada
 *       404:
 *         description: Cita no encontrada
 */
// Actualizar cita
router.put("/:id", async (req, res) => {
    try {
        const { fecha, hora, estado, pacienteId, especialistaId } = req.body;

        if (fecha && !isValidDate(fecha)) {
            return res.status(400).json({ message: "'fecha' inválida (YYYY-MM-DD)" });
        }
        if (hora && !isValidTime(hora)) {
            return res.status(400).json({ message: "'hora' inválida (HH:mm o HH:mm:ss)" });
        }
        if (estado && !isValidEstado(estado)) {
            return res.status(400).json({ message: "'estado' inválido" });
        }

        if (pacienteId) {
            const paciente = await Pacientes.findByPk(pacienteId);
            if (!paciente) {
                return res.status(404).json({ message: "Paciente no encontrado" });
            }
        }
        if (especialistaId) {
            const especialista = await Especialistas.findByPk(especialistaId);
            if (!especialista) {
                return res.status(404).json({ message: "Especialista no encontrado" });
            }
        }

        // Si se actualiza fecha/hora/especialista, verificar conflicto
        const citaActual = await citasController.getCitaById(req.params.id);
        if (!citaActual) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        const nuevaFecha = fecha ?? citaActual.fecha;
        const nuevaHora = hora ?? citaActual.hora;
        const nuevoEspecialistaId = especialistaId ?? citaActual.especialistaId;
        const conflicto = await Citas.findOne({ where: { fecha: nuevaFecha, hora: nuevaHora, especialistaId: nuevoEspecialistaId } });
        if (conflicto && conflicto.id !== citaActual.id) {
            return res.status(409).json({ message: "Conflicto de agenda: el especialista ya tiene una cita en ese horario" });
        }

        const cita = await citasController.updateCita(req.params.id, { fecha, hora, estado, pacienteId, especialistaId });
        res.json(cita);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando la cita", error: error.message });
    }
});

/**
 * @swagger
 * /citas/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cita eliminada
 *       404:
 *         description: Cita no encontrada
 */
// Eliminar cita
router.delete("/:id", async (req, res) => {
    try {
        const eliminado = await citasController.deleteCita(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando la cita", error: error.message });
    }
});

module.exports = router; 