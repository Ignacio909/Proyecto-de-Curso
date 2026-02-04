const Personas = require("../models/personas");

// Actualizar datos básicos de una persona (útil para Admins)
const updatePersona = async (id, data) => {
    const persona = await Personas.findByPk(id);
    if (!persona) return null;

    const { usuario, contrasena, correo, imagen } = data;

    // El hook beforeUpdate en el modelo Personas se encargará de hashear la contraseña si cambia
    await persona.update({ 
        usuario, 
        contrasena, 
        correo, 
        imagen 
    });

    return persona;
};

module.exports = {
    updatePersona,
};