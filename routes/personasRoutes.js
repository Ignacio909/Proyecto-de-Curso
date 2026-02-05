const express = require("express");
const router = express.Router();
const personasController = require("../controllers/personasController");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const upload = require("../middlewares/multerConfig");
const authenticate = require("../middlewares/auntenticationJwt");

/**
 * @swagger
 * /personas/{id}:
 * put:
 * summary: Actualizar datos básicos de una persona (Admin o perfil general)
 * tags: [Personas]
 */
router.put("/:id", authenticate(["admin", "paciente", "especialista"]), upload.single('imagen'), async (req, res, next) => {
    try {
        const imagen = req.file ? `/images/profile/${req.file.filename}` : undefined;
        const datosActualizados = { ...req.body };
        
        if (imagen) datosActualizados.imagen = imagen;

        const actualizado = await personasController.updatePersona(req.params.id, datosActualizados);

        if (!actualizado) {
            return next(new AppError("Usuario no encontrado", 404));
        }

        logger.info(`PUT/ Admin actualizado - ID: ${req.params.id} - IP: ${req.ip}`);

        res.json(actualizado);
    } catch (error) {
        next(new AppError("Error actualizando datos: " + error.message, 500));
    }
});

module.exports = router;