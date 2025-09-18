const express = require("express");
const router = express.Router();
const historiaClinicaControllers = require("../controllers/historias-clinicas");

// CRUD de Historias Clínicas
router.post("/", historiaClinicaControllers.createHistoriaClinica);
router.get("/", historiaClinicaControllers.getHistoriasClinicas);
router.get("/:id", historiaClinicaControllers.getHistoriaClinicaById);
router.put("/:id", historiaClinicaControllers.updateHistoriaClinica);
router.delete("/:id", historiaClinicaControllers.deleteHistoriaClinica);
router.get("/paciente/:pacienteId", historiaClinicaControllers.getHistoriaClinicaByPaciente);

module.exports = router;