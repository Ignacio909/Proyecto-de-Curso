const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citas");
const Citas = require("../models/citas");
const Pacientes = require("../models/pacientes");
const Especialistas = require("../models/especialistas");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const authenticate = require("../middlewares/auntenticationJwt");

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
router.post("/", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const { fecha, hora, estado = "pendiente", pacienteId, especialistaId } = req.body;

        if (!fecha || !isValidDate(fecha)) {
            return next(new AppError("'fecha' es requerida en formato YYYY-MM-DD", 400));
        }
        if (!hora || !isValidTime(hora)) {
            return next(new AppError("'hora' es requerida en formato HH:mm o HH:mm:ss", 400));
        }
        if (estado && !isValidEstado(estado)) {
            return next(new AppError("'estado' inválido", 400));
        }
        if (!pacienteId) {
            return next(new AppError("'pacienteId' es requerido", 400));
        }
        if (!especialistaId) {
            return next(new AppError("'especialistaId' es requerido", 400));
        }

        const paciente = await Pacientes.findByPk(pacienteId);
        if (!paciente) {
            return next(new AppError("Paciente no encontrado", 404));
        }
        const especialista = await Especialistas.findByPk(especialistaId);
        if (!especialista) {
            return next(new AppError("Especialista no encontrado", 404));
        }

        // Verificar conflicto de agenda: misma fecha/hora con el mismo especialista
        const conflicto = await Citas.findOne({ where: { fecha, hora, especialistaId } });
        if (conflicto) {
            return next(new AppError("Conflicto de agenda: el especialista ya tiene una cita en ese horario", 409));
        }

        const cita = await citasController.createCita({ fecha, hora, estado, pacienteId, especialistaId });

        // Log de éxito
        logger.info(`Cita creada - ID: ${cita.id} - Fecha: ${fecha} - Hora: ${hora} - IP: ${req.ip}`);

        res.status(201).json(cita);
    } catch (error) {
        next(new AppError("Error creando la cita: " + error.message, 500));
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
router.get("/", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const citas = await citasController.getCitas();

        // Log de éxito
        logger.info(`Lista de citas obtenida - Total: ${citas.length} - IP: ${req.ip}`);

        res.json(citas);
    } catch (error) {
        next(new AppError("Error obteniendo citas: " + error.message, 500));
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
 *         description: ID único de la cita
 *     responses:
 *       200:
 *         description: Cita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error interno del servidor
 */
// Obtener cita por ID
router.get("/:id", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const cita = await citasController.getCitaById(req.params.id);

        if (!cita) {
            return next(new AppError("Cita no encontrada", 404));
        }

        // Log de éxito
        logger.info(`Cita obtenida - ID: ${req.params.id} - IP: ${req.ip}`);

        res.json(cita);
    } catch (error) {
        next(new AppError("Error obteniendo la cita: " + error.message, 500));
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
 *         description: ID único de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita (YYYY-MM-DD)
 *               hora:
 *                 type: string
 *                 description: Hora de la cita (HH:mm)
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completada, cancelada]
 *               pacienteId:
 *                 type: string
 *                 format: uuid
 *               especialistaId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Cita actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Validación fallida
 *       404:
 *         description: Cita, Paciente o Especialista no encontrado
 *       409:
 *         description: Conflicto de agenda
 *       500:
 *         description: Error interno del servidor
 */
// Actualizar cita
router.put("/:id", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const { fecha, hora, estado, pacienteId, especialistaId } = req.body;

        if (fecha && !isValidDate(fecha)) {
            return next(new AppError("'fecha' inválida (YYYY-MM-DD)", 400));
        }
        if (hora && !isValidTime(hora)) {
            return next(new AppError("'hora' inválida (HH:mm o HH:mm:ss)", 400));
        }
        if (estado && !isValidEstado(estado)) {
            return next(new AppError("'estado' inválido", 400));
        }

        if (pacienteId) {
            const paciente = await Pacientes.findByPk(pacienteId);
            if (!paciente) {
                return next(new AppError("Paciente no encontrado", 404));
            }
        }
        if (especialistaId) {
            const especialista = await Especialistas.findByPk(especialistaId);
            if (!especialista) {
                return next(new AppError("Especialista no encontrado", 404));
            }
        }

        // Si se actualiza fecha/hora/especialista, verificar conflicto
        const citaActual = await citasController.getCitaById(req.params.id);
        if (!citaActual) {
            return next(new AppError("Cita no encontrada", 404));
        }
        const nuevaFecha = fecha ?? citaActual.fecha;
        const nuevaHora = hora ?? citaActual.hora;
        const nuevoEspecialistaId = especialistaId ?? citaActual.especialistaId;
        const conflicto = await Citas.findOne({ where: { fecha: nuevaFecha, hora: nuevaHora, especialistaId: nuevoEspecialistaId } });
        if (conflicto && conflicto.id !== citaActual.id) {
            return next(new AppError("Conflicto de agenda: el especialista ya tiene una cita en ese horario", 409));
        }

        const cita = await citasController.updateCita(req.params.id, { fecha, hora, estado, pacienteId, especialistaId });

        // Log de éxito
        logger.info(`Cita actualizada - ID: ${req.params.id} - IP: ${req.ip}`);

        res.json(cita);
    } catch (error) {
        next(new AppError("Error actualizando la cita: " + error.message, 500));
    }
});

/**
 * @swagger
 * /citas/{id}/completar:
 *   put:
 *     summary: Marcar una cita como completada
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita a completar
 *     responses:
 *       200:
 *         description: Cita completada con éxito
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id/completar", authenticate(["especialista"]), async (req, res, next) => {
    try {
        await citasController.completarCita(req.params.id);
        
        // Log de éxito (Consistente con tus otros endpoints)
        logger.info(`Cita marcada como completada - ID: ${req.params.id} - EspecialistaID: ${req.user.userId} - IP: ${req.ip}`);
        
        res.status(200).json({ message: "Cita completada con éxito" });
    } catch (error) {
        // Log de error
        logger.error(`Error al completar cita - ID: ${req.params.id} - Error: ${error.message} - IP: ${req.ip}`);
        next(error);
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
 *         description: ID único de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cita eliminada correctamente"
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error interno del servidor
 */
// Eliminar cita
router.delete("/:id", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const eliminado = await citasController.deleteCita(req.params.id);

        if (!eliminado) {
            return next(new AppError("Cita no encontrada", 404));
        }

        // Log de éxito
        logger.info(`Cita eliminada - ID: ${req.params.id} - IP: ${req.ip}`);

        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        next(new AppError("Error eliminando la cita: " + error.message, 500));
    }
});

/**
 * @swagger
 * /citas/paciente/{id}:
 *   get:
 *     summary: Obtener citas por ID de paciente
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Lista de citas del paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cita'
 *       500:
 *         description: Error interno del servidor
 */
// Obtener citas por paciente
router.get("/paciente/:id", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const citas = await citasController.getCitasByPaciente(req.params.id);
        logger.info(`Citas obtenidas para paciente - ID: ${req.params.id} - Total: ${citas.length} - IP: ${req.ip}`);
        res.json(citas);
    } catch (error) {
        next(new AppError("Error obteniendo citas del paciente: " + error.message, 500));
    }
});

/**
 * @swagger
 * /citas/especialista/{id}:
 *   get:
 *     summary: Obtener citas por ID de especialista
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del especialista
 *     responses:
 *       200:
 *         description: Lista de citas del especialista
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cita'
 *       500:
 *         description: Error interno del servidor
 */
// Obtener citas por especialista
router.get("/especialista/:id", authenticate(["especialista", "paciente"]), async (req, res, next) => {
    try {
        const citas = await citasController.getCitasByEspecialista(req.params.id);
        logger.info(`Citas obtenidas para especialista - ID: ${req.params.id} - Total: ${citas.length} - IP: ${req.ip}`);
        res.json(citas);
    } catch (error) {
        next(new AppError("Error obteniendo citas del especialista: " + error.message, 500));
    }
});

module.exports = router;