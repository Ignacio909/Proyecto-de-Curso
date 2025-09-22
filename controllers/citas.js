const Citas = require("../models/citas");
const Pacientes = require("../models/pacientes");
const Especialistas = require("../models/especialistas");

// Crear cita
const createCita = async (data) => {
    const { fecha, hora, estado, pacienteId, especialistaId } = data;

    return await Citas.create({
        fecha,
        hora,
        estado,
        pacienteId,
        especialistaId,
    });
};

// Obtener todas las citas
const getCitas = async () => {
    return await Citas.findAll({
        include: [
            { model: Pacientes, as: "paciente" },
            { model: Especialistas, as: "especialista" },
        ],
    });
};

// Obtener una cita por ID
const getCitaById = async (id) => {
    return await Citas.findByPk(id, {
        include: [
            { model: Pacientes, as: "paciente" },
            { model: Especialistas, as: "especialista" },
        ],
    });
};

// Actualizar una cita
const updateCita = async (id, data) => {
    const cita = await Citas.findByPk(id);
    if (!cita) {
        return null;
    }

    const { fecha, hora, estado, pacienteId, especialistaId } = data;
    await cita.update({ fecha, hora, estado, pacienteId, especialistaId });
    return cita;
};

// Eliminar una cita
const deleteCita = async (id) => {
    const cita = await Citas.findByPk(id);
    if (!cita) {
        return null;
    }
    await cita.destroy();
    return true;
};

module.exports = {
    createCita,
    getCitas,
    getCitaById,
    updateCita,
    deleteCita,
}; 