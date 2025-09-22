const RegistroClinico = require ("../models/registros_clinicos");
const HistoriaClinica = require ("../models/historias_clinicas");
const Especialistas = require ("../models/especialistas");

//Crear Registro Clinico
const createRegistroClinico= async (registro) => {

        const {diagnostico, tratamiento, 
            observaciones, historiaClinicaId, especialistaId} = registro;

        //Validamos que la historia exista
        const historia = await HistoriaClinica.findByPk(historiaClinicaId);
        if(!historia){
            throw new Error ("Historia clinica no encontrada");
        }
        //Validamos que el especialista exista
        const especialista = await Especialistas.findByPk(especialistaId);
        if(!especialista) {
            throw new Error("Especialista no encontrado");
        }

        return await RegistroClinico.create({
            diagnostico,
            tratamiento,  
            observaciones,
            historiaClinicaId,
            especialistaId,
        });    
};

//Obtener todos los registros
const getRegistrosClinicos = async () => {
        return await RegistroClinico.findAll({
            include: [
                {model: HistoriaClinica, as: "historiaClinica"},
                {model: Especialistas, as: "especialista"},
            ],
        });
    
};

// Obtener un registro clínico por ID
const getRegistroClinicoById = async (id) => {
    return await RegistroClinico.findByPk(id, {
        include: [
            { model: HistoriaClinica, as: "historiaClinica" },
            { model: Especialistas, as: "especialista" },
        ],
    });
};

// Actualizar un registro clínico
const updateRegistroClinico = async (id, data) => {
    const registro = await RegistroClinico.findByPk(id);
    if (!registro) {
        return null;
    }
    const { diagnostico, tratamiento, observaciones } = data;
    await registro.update({ diagnostico, tratamiento, observaciones });
    return registro;
};

// Eliminar un registro clínico
const deleteRegistroClinico = async (id) => {
    const registro = await RegistroClinico.findByPk(id);
    if (!registro) {
        return null;
    }
    await registro.destroy();
    return true;
};

module.exports = {
    createRegistroClinico,
    getRegistrosClinicos,
    getRegistroClinicoById,
    updateRegistroClinico,
    deleteRegistroClinico,
};