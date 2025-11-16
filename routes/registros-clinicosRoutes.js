const express = require("express");
const router = express.Router();
const registroClinicosController = require("../controllers/registros-clinicos");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const authenticate = require ("../middlewares/auntenticationJwt");

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
router.post("/",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const registro = await registroClinicosController.createRegistroClinico(req.body);
        
        // Log de éxito
        logger.info(`Registro clínico creado - ID: ${registro.id} - IP: ${req.ip}`);
        
        res.status(201).json(registro);
    } catch (error) {
        next(new AppError("Error al crear el registro: " + error.message, 500));
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
router.get("/",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const registros = await registroClinicosController.getRegistrosClinicos();
        
        // Log de éxito
        logger.info(`Lista de registros clínicos obtenida - Total: ${registros.length} - IP: ${req.ip}`);
        
        res.json(registros);
    } catch (error) {
        next(new AppError("Error obteniendo registros clínicos: " + error.message, 500));
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
router.get("/:id",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const registro = await registroClinicosController.getRegistroClinicoById(req.params.id);
        
        if (!registro) {
            return next(new AppError("Registro clínico no encontrado", 404));
        }
        
        // Log de éxito
        logger.info(`Registro clínico obtenido - ID: ${req.params.id} - IP: ${req.ip}`);
        
        res.json(registro);
    } catch (error) {
        next(new AppError("Error obteniendo el registro clínico: " + error.message, 500));
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
router.put("/:id",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const actualizado = await registroClinicosController.updateRegistroClinico(req.params.id, req.body);
        
        if (!actualizado) {
            return next(new AppError("Registro clínico no encontrado", 404));
        }
        
        // Log de éxito
        logger.info(`Registro clínico actualizado - ID: ${req.params.id} - IP: ${req.ip}`);
        
        res.json(actualizado);
    } catch (error) {
        next(new AppError("Error actualizando registro clínico: " + error.message, 500));
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
router.delete("/:id",authenticate(["especialista"]), async (req, res, next) => {
    try {
        const eliminado = await registroClinicosController.deleteRegistroClinico(req.params.id);
        
        if (!eliminado) {
            return next(new AppError("Registro clínico no encontrado", 404));
        }
        
        // Log de éxito
        logger.info(`Registro clínico eliminado - ID: ${req.params.id} - IP: ${req.ip}`);
        
        res.json({ message: "Registro clínico eliminado correctamente" });
    } catch (error) {
        next(new AppError("Error eliminando registro clínico: " + error.message, 500));
    }
});

module.exports = router;