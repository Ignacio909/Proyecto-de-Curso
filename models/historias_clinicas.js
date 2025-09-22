/**
 * @swagger
 * components:
 *   schemas:
 *     HistoriaClinica:
 *       type: object
 *       required:
 *         - edad
 *         - sexo
 *         - pacienteId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         edad:
 *           type: integer
 *         sexo:
 *           type: string
 *           enum: [masculino, femenino, otro]
 *         raza:
 *           type: string
 *         direccion:
 *           type: string
 *         enfermedades:
 *           type: string
 *         antecedentes:
 *           type: string
 *         pacienteId:
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
const Pacientes = require("./pacientes");

const HistoriaClinica = sequelize.define("historias_clinicas", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	edad: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	sexo: {
		type: DataTypes.ENUM("masculino","femenino","otro"),
		allowNull: false,
	},
	raza: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	direccion: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	enfermedades: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	antecedentes: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	pacienteId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: { model: Pacientes, key: "id" },
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
}, {timestamps: true,
});

HistoriaClinica.belongsTo(Pacientes, {
	foreignKey: "pacienteId",
	as: "paciente",
	onDelete: "CASCADE"
});
Pacientes.hasOne(HistoriaClinica, {
	foreignKey: "pacienteId",
	as: "historiaClinica"
});

module.exports = HistoriaClinica;
