const HistoriaClinica = require("../models/historias_clinicas");
const RegistroClinico = require ("../models/registros_clinicos");
const Paciente = require ("../models/pacientes");

// Crear historia clínica
const createHistoriaClinica = async (data) => {
    const { pacienteId, edad, sexo, raza, direccion, enfermedades, antecedentes } = data;

    // Validar que el paciente exista
    const paciente = await Paciente.findByPk(pacienteId);
        if (!paciente) {
            throw new Error( "Paciente no encontrado" );
        }

    // Validar que no tenga ya una historia clínica
    const existe = await HistoriaClinica.findOne({ where: { pacienteId } });
        if (existe) {
            throw new Error ("El paciente ya tiene una historia clínica" );
        }

    return await HistoriaClinica.create({
            pacienteId,
            edad,
            sexo,
            raza,
            direccion,
            enfermedades,
            antecedentes,
    });
};

// Obtener todas las historias clínicas
const getHistoriasClinicas = async () => {
    return await HistoriaClinica.findAll({
        include:[
            {model: Paciente, as: "paciente"},
            {model: RegistroClinico, as: "registrosClinicos"},
        ],
    });
};

// Obtener historia clínica por ID
const getHistoriaClinicaById = async (id) => {
    return await HistoriaClinica.findByPk(id , {
        include: [
            {model: Paciente, as: "paciente"},
            {model: RegistroClinico, as: "registrosClinicos"},
        ],
    }); 
};

// Actualizar historia clínica
const updateHistoriaClinica = async (id, data) => {
    const historia = await HistoriaClinica.findByPk(id);
    if(!historia) {
        return null;
    }
    await historia.update(data);
    return historia;
};

// Eliminar historia clínica
const deleteHistoriaClinica = async (id) => {
    const historia = await HistoriaClinica.findByPk(id);
    if (!historia) {
        return null;
    }
    await historia.destroy();
    return true;
};

// Buscar historia clínica por id del paciente (lógica pura)
const findHistoriaClinicaByPacienteId = async (pacienteId) => {
    return await HistoriaClinica.findOne({
        where: { pacienteId },
        include: [
            { model: Paciente, as: "paciente" },
            { model: RegistroClinico, as: "registrosClinicos" },
        ],
    });
};

module.exports = {
    createHistoriaClinica,
    getHistoriasClinicas,
    getHistoriaClinicaById,
    updateHistoriaClinica,
    deleteHistoriaClinica,
    findHistoriaClinicaByPacienteId,
}; 