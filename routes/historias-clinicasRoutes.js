const express = require("express");
const router = express.Router();
const historiaClinicaControllers = require("../controllers/historias-clinicas");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const authenticate = require("../middlewares/auntenticationJwt");

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
 *         description: Historia clínica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoriaClinica'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
// CRUD de Historias Clínicas
router.post("/",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const historia = await historiaClinicaControllers.createHistoriaClinica(req.body);
        
        // Log de éxito
        logger.info(`Historia clínica creada - ID: ${historia.id} - IP: ${req.ip}`);
        
        res.status(201).json(historia);
    } catch (error) {
        next(new AppError("Error creando historia clínica: " + error.message, 400));
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
router.get("/",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const historias = await historiaClinicaControllers.getHistoriasClinicas();
        
        // Log de éxito
        logger.info(`GET/ Lista de historias clínicas obtenida - Total: ${historias.length} - IP: ${req.ip}`);
        
        res.json(historias);
    } catch (error) {
        next(new AppError("Error obteniendo historias clínicas: " + error.message, 500));
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
 *         description: ID único de la historia clínica
 *     responses:
 *       200:
 *         description: Historia clínica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoriaClinica'
 *       404:
 *         description: Historia clínica no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id",authenticate(["especialista"]),async (req, res, next) => {
    try {
        const historia = await historiaClinicaControllers.getHistoriaClinicaById(req.params.id);
        
        if (!historia) {
            return next(new AppError("Historia clínica no encontrada", 404));
        }
        
        // Log de éxito
        logger.info(`GET/ Historia clínica obtenida - ID: ${req.params.id} - IP: ${req.ip}`);

        res.json(historia);
    } catch (error) {
        next(new AppError("Error obteniendo historia clínica: " + error.message, 500));
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
 *         description: ID único de la historia clínica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoriaClinica'
 *     responses:
 *       200:
 *         description: Historia clínica actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoriaClinica'
 *       404:
 *         description: Historia clínica no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const historia = await historiaClinicaControllers.updateHistoriaClinica(req.params.id, req.body);
        
        if (!historia) {
            return next(new AppError("Historia clínica no encontrada", 404));
        }
        
        // Log de éxito
        logger.info(`PUT/ Historia clínica actualizada - ID: ${req.params.id} - IP: ${req.ip}`);
        
        res.json(historia);
    } catch (error) {
        next(new AppError("Error actualizando historia clínica: " + error.message, 500));
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
 *         description: ID único de la historia clínica
 *     responses:
 *       200:
 *         description: Historia clínica eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historia clínica eliminada correctamente"
 *       404:
 *         description: Historia clínica no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const eliminando = await historiaClinicaControllers.deleteHistoriaClinica(req.params.id);
        
        if (!eliminando) {
            return next(new AppError("Historia clínica no encontrada", 404));
        }
        
        // Log de éxito
        logger.info(`DELETE/ Historia clínica eliminada - ID: ${req.params.id} - IP: ${req.ip}`);
        
        res.json({ message: "Historia clínica eliminada correctamente" });
    } catch (error) {
        next(new AppError("Error eliminando historia clínica: " + error.message, 500));
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
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Historia clínica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoriaClinica'
 *       404:
 *         description: Este paciente no tiene historia clínica
 *       500:
 *         description: Error interno del servidor
 */
// Buscar historia clínica por pacienteId
router.get("/paciente/:pacienteId",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const historia = await historiaClinicaControllers.findHistoriaClinicaByPacienteId(req.params.pacienteId);
        
        if (!historia) {
            return next(new AppError("Este paciente no tiene historia clínica", 404));
        }
        
        // Log de éxito
        logger.info(`GET/ Historia clínica obtenida por pacienteId - PacienteID: ${req.params.pacienteId} - IP: ${req.ip}`);
        
        res.json(historia);
    } catch (error) {
        next(new AppError("Error buscando historia clínica: " + error.message, 500));
    }
});

module.exports = router;