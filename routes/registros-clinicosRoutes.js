const express = require("express");
const router = express.Router();
const {
    createRegistroClinico,
    getRegistrosClinicos,
    getRegistroClinicoById,
    updateRegistroClinico,
    deleteRegistroClinico,
} = require("../controllers/registros-clinicos");

// CRUD de Registros Clínicos
router.post("/", createRegistroClinico);
router.get("/", getRegistrosClinicos);
router.get("/:id", getRegistroClinicoById);
router.put("/:id", updateRegistroClinico);
router.delete("/:id", deleteRegistroClinico);

module.exports = router;