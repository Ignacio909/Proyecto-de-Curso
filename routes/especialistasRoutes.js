const express = require("express");
const router = express.Router();
const especialistasController = require("../controllers/especialistas");

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

// Listar
router.get("/", async (req, res) => {
	try {
		const especialistas = await especialistasController.getEspecialistas();
		res.json(especialistas);
	} catch (error) {
		res.status(500).json({ message: "Error obteniendo especialistas", error: error.message });
	}
});

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