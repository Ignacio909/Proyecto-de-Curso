const express = require("express");
const router = express.Router();
const registroClinicosController = require("../controllers/registros-clinicos");

// CRUD de Registros Clínicos
router.post("/", registroClinicosController.createRegistroClinico);
router.get("/", registroClinicosController.getRegistrosClinicos);
router.get("/:id",registroClinicosController.getRegistroClinicoById);
router.put("/:id", registroClinicosController.updateRegistroClinico);
router.delete("/:id", registroClinicosController.deleteRegistroClinico);

module.exports = router;