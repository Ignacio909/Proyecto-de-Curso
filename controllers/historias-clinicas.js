const HistoriaClinica = require("../models/historias_clinicas");
const RegistroClinico = require ("../models/registros_clinicos");
const Paciente = require ("../models/pacientes");

// Crear historia clínica
const createHistoriaClinica = async (req, res) => {
    try {
        const { pacienteId, edad, sexo, raza, direccion, enfermedades, antecedentes } = req.body;

    // Validar que el paciente exista
        const paciente = await Paciente.findByPk(pacienteId);
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

    // Validar que no tenga ya una historia clínica
        const existe = await HistoriaClinica.findOne({ where: { pacienteId } });
        if (existe) {
            return res.status(400).json({ message: "El paciente ya tiene una historia clínica" });
        }

        const historia = await HistoriaClinica.create({
            pacienteId,
            edad,
            sexo,
            raza,
            direccion,
            enfermedades,
            antecedentes,
        });

        res.status(201).json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error creando historia clínica", error: error.message });
    }
};

// Obtener todas las historias clínicas
const getHistoriasClinicas = async (req, res) => {
    try {
        const historias = await HistoriaClinica.findAll({
        include: [
            { model: Paciente, as: "paciente" },
            { model: RegistroClinico, as: "registrosClinicos" },
        ],
        });

        res.json(historias);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo historias clínicas", error: error.message });
    }
};

// Obtener historia clínica por ID
const getHistoriaClinicaById = async (req, res) => {
    try {
        const historia = await HistoriaClinica.findByPk(req.params.id, {
        include: [
            { model: Paciente, as: "paciente" },
            { model: RegistroClinico, as: "registrosClinicos" },
        ],
        });

        if (!historia) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }

        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo historia clínica", error: error.message });
    } 
};

// Actualizar historia clínica
const updateHistoriaClinica = async (req, res) => {
    try {
        const { edad, sexo, raza, direccion, enfermedades, antecedentes } = req.body;

        const historia = await HistoriaClinica.findByPk(req.params.id);
        if (!historia) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }

        await historia.update({ edad, sexo, raza, direccion, enfermedades, antecedentes });

        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando historia clínica", error: error.message });
    }
};

// Eliminar historia clínica
const deleteHistoriaClinica = async (req, res) => {
    try {
        const historia = await HistoriaClinica.findByPk(req.params.id);
        if (!historia) {
            return res.status(404).json({ message: "Historia clínica no encontrada" });
        }

        await historia.destroy();
        res.json({ message: "Historia clínica eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando historia clínica", error: error.message });
    }
};

// Buscar historia clínica por id del paciente
const getHistoriaClinicaByPaciente = async (req, res) => {
    try {
        const historia = await HistoriaClinica.findOne({
            where: { pacienteId: req.params.pacienteId },
            include: [
                { model: Paciente, as: "paciente" },
                { model: RegistroClinico, as: "registrosClinicos" },
            ],
        });

        if (!historia) {
            return res.status(404).json({ message: "Este paciente no tiene historia clínica" });
        }

        res.json(historia);
    } catch (error) {
        res.status(500).json({ message: "Error buscando historia clínica", error: error.message });
    }
};

module.exports = {
    createHistoriaClinica,
    getHistoriasClinicas,
    getHistoriaClinicaById,
    updateHistoriaClinica,
    deleteHistoriaClinica,
    getHistoriaClinicaByPaciente,
}; 