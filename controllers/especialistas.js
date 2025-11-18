const sequelize = require("../helpers/database");
const Especialistas = require("../models/especialistas");
const Personas = require("../models/personas");

// Crear especialista (crea persona + especialista en una transacción)
const createEspecialista = async (data) => {
	const { usuario, contrasena, correo, especialidad, imagen } = data;

	return await sequelize.transaction(async (t) => {
		const persona = await Personas.create(
			{ usuario, contrasena, correo, rol: "especialista", imagen },
			{ transaction: t }
		);

		const especialista = await Especialistas.create(
			{ especialidad, personaId: persona.id },
			{ transaction: t }
		);

		return especialista;
	});
};

// Listar especialistas
const getEspecialistas = async () => {
	return await Especialistas.findAll({ include: [{ model: Personas, as: "persona" }] });
};

// Obtener especialista por ID
const getEspecialistaById = async (id) => {
	return await Especialistas.findByPk(id, { include: [{ model: Personas, as: "persona" }] });
};

// Actualizar especialista (y opcionalmente persona)
const updateEspecialista = async (id, data) => {
	const especialista = await Especialistas.findByPk(id, { include: [{ model: Personas, as: "persona" }] });
	if (!especialista) return null;

	const { especialidad, usuario, contrasena, correo, imagen } = data;

	return await sequelize.transaction(async (t) => {
		await especialista.update({ especialidad }, { transaction: t });
		if (usuario || contrasena || correo || imagen) {
			await especialista.persona.update({ usuario, contrasena, correo, imagen }, { transaction: t });
		}
		await especialista.reload({ include: [{ model: Personas, as: "persona" }] });
		return especialista;
	});
};

// Eliminar especialista (y su persona asociada)
const deleteEspecialista = async (id) => {
	const especialista = await Especialistas.findByPk(id);
	if (!especialista) return null;

	return await sequelize.transaction(async (t) => {
		const personaId = especialista.personaId;
		await especialista.destroy({ transaction: t });
		const persona = await Personas.findByPk(personaId, { transaction: t, lock: t.LOCK.UPDATE });
		if (persona) {
			await persona.destroy({ transaction: t });
		}
		return true;
	});
};

// 🔍 Buscar especialistas incluyendo los eliminados
const getEspecialistasWithDeleted = async () => {
  return await Especialistas.findAll({ 
    paranoid: false, // ✅ Incluye registros eliminados
    include: [{ model: Personas, as: "persona", paranoid: false }] 
  });
};

module.exports = {
	createEspecialista,
	getEspecialistas,
	getEspecialistaById,
	updateEspecialista,
	deleteEspecialista,
	getEspecialistasWithDeleted,
}; 