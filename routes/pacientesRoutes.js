const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientes");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");
const upload = require("../middlewares/multerConfig");
const authenticate = require("../middlewares/auntenticationJwt");

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
router.post("/", upload.single('imagen'), async (req, res, next) => {
	try {
		const { usuario, contrasena, correo, telefono, carnetIdentidad } = req.body;
		const imagen = req.file ? `/images/profile/${req.file.filename}` : undefined;
		
		// Validación de campos requeridos
		if (!usuario || !contrasena || !correo || !telefono || !carnetIdentidad) {
			return next(new AppError("Campos requeridos faltantes", 400));
		}

		// 2. Validar Carnet de Identidad  (11 dígitos)
        if (!/^\d{11}$/.test(carnetIdentidad)) {
            return next(new AppError("El Carnet de Identidad debe tener 11 dígitos exactos.", 400));
        }

        // 3. Validar Teléfono Cuba (+53 opcional + 8 dígitos)
        const phoneRegex = /^(\+53)?\d{8}$/;
        if (!phoneRegex.test(telefono)) {
            return next(new AppError("El teléfono debe ser un número válido de Cuba (8 dígitos).", 400));
        }

        // 4. Validar Contraseña Segura (Min 8 caracteres, letra, número y símbolo)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/
        if (!passwordRegex.test(contrasena)) {
            return next(new AppError("Contraseña insegura: requiere min. 8 caracteres, letras, números y un símbolo (@$!%*#&).", 400));
        }

        // 5. Validar formato de Correo
        if (!/^\S+@\S+\.\S+$/.test(correo)) {
            return next(new AppError("El formato del correo electrónico no es válido.", 400));
        }

        // --- SI PASA LAS VALIDACIONES, EJECUTAMOS EL CONTROLADOR ---
        
        // Limpiamos el teléfono para que siempre guarde con +53 antes de enviarlo al controlador
        const telefonoNormalizado = telefono.startsWith('+53') ? telefono : `+53${telefono}`;
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
router.get("/", authenticate(["admin", "especialista"]), async (req, res, next) => {
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
router.get("/:id", authenticate(["admin", "especialista", "paciente"]), async (req, res, next) => {
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
router.put("/:id", authenticate(["paciente"]), upload.single('imagen'), async (req, res, next) => {
	try {
		// 1. Preparamos la ruta de la imagen si existe
		// NOTA: No incluimos 'public' en la ruta string para que sea accesible vía URL
		const imagen = req.file ? `/images/profile/${req.file.filename}` : undefined;

		// 2. IMPORTANTE: Creamos un objeto único con los datos del body y la imagen
		const datosActualizados = {
			...req.body,
			...(imagen && { imagen }) // Solo agrega la propiedad imagen si existe una nueva
		};

		// 3. Pasamos ese ÚNICO objeto 'datosActualizados' como segundo argumento
		const actualizado = await pacientesController.updatePaciente(req.params.id, datosActualizados);

		if (!actualizado) {
			return next(new AppError("Paciente no encontrado", 404));
		}

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
router.delete("/:id", authenticate(["admin"]), async (req, res, next) => {
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