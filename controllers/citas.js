const Citas = require("../models/citas");
const Personas = require("../models/personas");
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
            {
                model: Especialistas, as: "especialista",
                include: [{ model: Personas, as: "persona" }]
            },
        ],
    });
};

// Obtener una cita por ID
const getCitaById = async (id) => {
    return await Citas.findByPk(id, {
        include: [
            { model: Pacientes, as: "paciente", include: [{ model: Personas, as: "persona" }] },
            {
                model: Especialistas, as: "especialista",
                include: [{ model: Personas, as: "persona" }]
            },
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

// En tu controlador de citas
const completarCita = async (id) => {
    const cita = await Citas.findByPk(id);
    if (!cita) throw new AppError("Cita no encontrada", 404);

    await cita.update({ estado: 'completada' });
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

// Obtener citas por ID de paciente
const getCitasByPaciente = async (pacienteId) => {
    return await Citas.findAll({
        where: { pacienteId },
        include: [
            { model: Pacientes, as: "paciente" },
            {
                model: Especialistas, as: "especialista",
                include: [{ model: Personas, as: "persona" }]
            },
        ],
    });
};

// Obtener citas por ID de especialista
const getCitasByEspecialista = async (especialistaId) => {
    return await Citas.findAll({
        where: { especialistaId },
        include: [
            {
                model: Pacientes, as: "paciente",
                include: [{ model: Personas, as: "persona" }]
            },
            { model: Especialistas, as: "especialista" },
        ],
    });
};

module.exports = {
    createCita,
    getCitas,
    getCitaById,
    updateCita,
    completarCita,
    deleteCita,
    getCitasByPaciente,
    getCitasByEspecialista,
};