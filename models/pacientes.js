/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       required:
 *         - nombre
 *         - apellidos
 *         - telefono
 *         - carnetIdentidad
 *         - personaId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nombre:
 *           type: string
 *         apellidos:
 *           type: string
 *         telefono:
 *           type: string
 *         carnetIdentidad:
 *           type: string
 *         personaId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Personas = require("./personas");

const Pacientes = sequelize.define("pacientes", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	apellidos: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	telefono: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	carnetIdentidad: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	personaId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: Personas,
			key: "id",
		},
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
}, { timestamps: true,
});

Pacientes.belongsTo(Personas, {
	foreignKey:"personaId",
	as: "persona",
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});
Personas.hasOne(Pacientes, {
	foreignKey: "personaId",
	as: "paciente"
});
module.exports = Pacientes;