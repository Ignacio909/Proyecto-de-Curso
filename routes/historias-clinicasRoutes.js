const express = require("express");
const router = express.Router();
const {
    createHistoriaClinica,
    getHistoriasClinicas,
    getHistoriaClinicaById,
    updateHistoriaClinica,
    deleteHistoriaClinica,
} = require("../controllers/historias-clinicas");

// CRUD de Historias Clínicas
router.post("/", createHistoriaClinica);
router.get("/", getHistoriasClinicas);
router.get("/:id", getHistoriaClinicaById);
router.put("/:id", updateHistoriaClinica);
router.delete("/:id", deleteHistoriaClinica);

module.exports = router;