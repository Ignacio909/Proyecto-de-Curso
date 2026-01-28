const RegistroClinico = require ("../models/registros_clinicos");
const HistoriaClinica = require ("../models/historias_clinicas");
const Especialistas = require ("../models/especialistas");
const AppError = require ("../errors/AppError");

//Crear Registro Clinico
const createRegistroClinico= async (registro) => {

        const {diagnostico, tratamiento, 
            observaciones, historiaClinicaId, especialistaId} = registro;
            
        //Validamos que la historia exista
        const historia = await HistoriaClinica.findByPk(historiaClinicaId);
        if(!historia){
            throw new AppError("Historia clinica no encontrada", 404);
        }
        //Validamos que el especialista exista
        const especialista = await Especialistas.findByPk(especialistaId);
        if(!especialista) {
            throw new AppError("Especialista no encontrado", 404);
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

// Obtener registros clínicos por ID de Historia Clínica
const getRegistrosByHistoriaId = async (historiaClinicaId) => {
    return await RegistroClinico.findAll({
        where: { historiaClinicaId },
        include: [
            { model: Especialistas, as: "especialista" }
        ],
        order: [['createdAt', 'DESC']] // Para que salgan los más nuevos primero
    });
};

// Actualizar un registro clínico
const updateRegistroClinico = async (id, data, requesterId, userRole) => {
    const registro = await RegistroClinico.findByPk(id);
    if (!registro) {
        return null;
    }

    // VALIDACIÓN: Si no es admin y no es el dueño, error
    if (userRole !== 'especialista' && registro.especialistaId !== requesterId) {
        throw new AppError("No tienes permiso para editar este registro", 403);
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

    // VALIDACIÓN: Solo el dueño o el admin pueden borrar
    if (userRole !== 'especialista' && registro.especialistaId !== requesterId) {
        throw new AppError("No tienes permiso para eliminar este registro", 403);
    }

    await registro.destroy();
    return true;
};

module.exports = {
    createRegistroClinico,
    getRegistrosClinicos,
    getRegistroClinicoById,
    getRegistrosByHistoriaId,
    updateRegistroClinico,
    deleteRegistroClinico,
};