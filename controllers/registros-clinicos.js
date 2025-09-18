const {RegistroClinico, HistoriaClinica, Especialista} = require ("../models");

//Crear Registro Clinico
const createRegistroClinico= async (req,res) => {
    try{
        const {diagnostico, tratamiento, 
            observaciones, historiaClinicaId, especialistaId} = req.body;
        //Validamos que la historia exista
        const historia = await HistoriaClinica.findByPK(historiaClinicaId);
        if(!historia){
            return res.status(404).json({message: "Historia clinica no encontrada"});
        }
        //Validamos que el especialista exista
        const especialista = await Especialista.findByPK(especialistaId);
        if(!especialista) {
            return res.status(404).json({message: "Especialista no encontrado"});
        }

        const registro = await RegistroClinico.create({
            diagnostico,
            tratamiento,  
            observaciones,
            historiaClinicaId,
            especialistaId,
        });

        res.status(201).json(registro);
    } catch(error) {
        res.status(500).json({message: "Error al crear el registro", error: error.message});
    }
};

//Obtener todos los registros
const getRegistrosClinicos = async (req, res) => {
    try{
        const registros = await RegistroClinico.findAll({
            include: [
                {model: HistoriaClinica, as: "historiClinica"},
                {model: Especialista, as: "especialista"},
            ],
        });
        res.json(registros);
    } catch (error) {
        res.status(500).json({message: "Error al obtener los registros", error: error.message});
    }
};

// Obtener un registro clínico por ID
const getRegistroClinicoById = async (req, res) => {
    try {
        const registro = await RegistroClinico.findByPk(req.params.id, {
            include: [
                { model: HistoriaClinica, as: "historiaClinica" },
                { model: Especialista, as: "especialista" },
            ],
        });

        if (!registro) {
        return res.status(404).json({ message: "Registro clínico no encontrado" });
        }

        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el registro clínico", error: error.message });
    }
};

// Actualizar un registro clínico
const updateRegistroClinico = async (req, res) => {
    try {
        const { diagnostico, tratamiento, observaciones } = req.body;

        const registro = await RegistroClinico.findByPk(req.params.id);
        if (!registro) {
        return res.status(404).json({ message: "Registro clínico no encontrado" });
        }

        await registro.update({ diagnostico, tratamiento, observaciones });

        res.json(registro);
    } catch (error) {
        res.status(500).json({ message: "Error actualizando registro clínico", error: error.message });
    }
};

  // Eliminar un registro clínico
    const deleteRegistroClinico = async (req, res) => {
    try {
        const registro = await RegistroClinico.findByPk(req.params.id);
        if (!registro) {
        return res.status(404).json({ message: "Registro clínico no encontrado" });
        }
        await registro.destroy();
        res.json({ message: "Registro clínico eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando registro clínico", error: error.message });
    }
};

module.exports = {
    createRegistroClinico,
    getRegistrosClinicos,
    getRegistroClinicoById,
    updateRegistroClinico,
    deleteRegistroClinico,
};