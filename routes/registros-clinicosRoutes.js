const express = require("express");
const router = express.Router();
const registroClinicosController = require("../controllers/registros-clinicos");

// CRUD de Registros Clínicos
router.post("/",async (req,res) => {
    try{
        const registro = await registroClinicosController.createRegistroClinico(req.body);    
        res.status(201).json(registro);
    } catch(error) {
        res.status(500).json({message: "Error al crear el registro", error: error.message});
    }
});

router.get("/", async (req, res) => {
    try {
        const registros = await registroClinicosController.getRegistrosClinicos();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo registros clínicos", error: error.message });
    }
});

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