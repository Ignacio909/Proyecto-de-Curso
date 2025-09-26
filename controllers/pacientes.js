const sequelize = require("../helpers/database");
const Pacientes = require("../models/pacientes");
const Personas = require("../models/personas");

// Crear paciente (crea persona + paciente en una transacción)
const createPaciente = async (data) => {
	const {
		usuario,
		contrasena,
		correo,
		// rol se fuerza a "paciente"
		nombre,
		apellidos,
		telefono,
		carnetIdentidad,
	} = data;

	return await sequelize.transaction(async (t) => {
		const persona = await Personas.create(
			{ usuario, contrasena, correo, rol: "paciente" },
			{ transaction: t }
		);

		const paciente = await Pacientes.create(
			{
				nombre,
				apellidos,
				telefono,
				carnetIdentidad,
				personaId: persona.id,
			},
			{ transaction: t }
		);

		return paciente;
	});
};

// Listar pacientes
const getPacientes = async () => {
	return await Pacientes.findAll({ include: [{ model: Personas, as: "persona" }] });
};

// Obtener paciente por ID
const getPacienteById = async (id) => {
	return await Pacientes.findByPk(id, { include: [{ model: Personas, as: "persona" }] });
};

// Actualizar paciente (opcionalmente datos de persona)
const updatePaciente = async (id, data) => {
	const paciente = await Pacientes.findByPk(id, { include: [{ model: Personas, as: "persona" }] });
	if (!paciente) return null;

	const { nombre, apellidos, telefono, carnetIdentidad, usuario, contrasena, correo } = data;

	return await sequelize.transaction(async (t) => {
		await paciente.update({ nombre, apellidos, telefono, carnetIdentidad }, { transaction: t });
		if (usuario || contrasena || correo) {
			await paciente.persona.update(
				{ usuario, contrasena, correo },
				{ transaction: t }
			);
		}
		return paciente;
	});
};

// Eliminar paciente (cascada eliminará persona si así se desea; aquí eliminamos paciente y persona manualmente para asegurar limpieza)
const deletePaciente = async (id) => {
	const paciente = await Pacientes.findByPk(id);
	if (!paciente) return null;

	return await sequelize.transaction(async (t) => {
		const personaId = paciente.personaId;
		await paciente.destroy({ transaction: t });
		// Si se desea conservar persona, comentar esta línea
		const persona = await Personas.findByPk(personaId, { transaction: t, lock: t.LOCK.UPDATE });
		if (persona) {
			await persona.destroy({ transaction: t });
		}
		return true;
	});
};

module.exports = {
	createPaciente,
	getPacientes,
	getPacienteById,
	updatePaciente,
	deletePaciente,
}; 