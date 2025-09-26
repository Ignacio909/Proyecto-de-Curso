const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientes");

// Crear paciente (crea persona + paciente)
router.post("/", async (req, res) => {
	try {
		const { usuario, contrasena, correo, nombre, apellidos, telefono, carnetIdentidad } = req.body;
		if (!usuario || !contrasena || !correo || !nombre || !apellidos || !telefono || !carnetIdentidad) {
			return res.status(400).json({ message: "Campos requeridos faltantes" });
		}
		const paciente = await pacientesController.createPaciente({ usuario, contrasena, correo, nombre, apellidos, telefono, carnetIdentidad });
		res.status(201).json(paciente);
	} catch (error) {
		res.status(500).json({ message: "Error creando paciente", error: error.message });
	}
});

// Listar
router.get("/", async (req, res) => {
	try {
		const pacientes = await pacientesController.getPacientes();
		res.json(pacientes);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo pacientes", error: error.message });
	}
});

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