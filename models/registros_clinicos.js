const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const HistoriaClinica = require ("./historias_clinicas");
const Especialistas = require("./especialistas");

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroClinico:
 *       type: object
 *       required:
 *         - diagnostico
 *         - historiaClinicaId
 *         - especialistaId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID autogenerado (UUID)
 *         diagnostico:
 *           type: string
 *           description: Diagnóstico realizado
 *         tratamiento:
 *           type: string
 *           description: Tratamiento indicado
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales
 *         historiaClinicaId:
 *           type: string
 *           format: uuid
 *           description: ID de la historia clínica asociada
 *         especialistaId:
 *           type: string
 *           format: uuid
 *           description: ID del especialista
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Última actualización
 *       example:
 *         id: "8b0a11a8-7e6d-4e03-a9c8-0b0bfb24b3ad"
 *         diagnostico: "Gripe común"
 *         tratamiento: "Reposo e hidratación"
 *         observaciones: "Paciente debe regresar en 7 días"
 *         historiaClinicaId: "3b2a1e22-1ad7-4c5b-9b61-d2d3f0b7f9b1"
 *         especialistaId: "2a3c4d55-6e7f-8890-ab12-cd34ef56ab78"
 *         createdAt: "2025-09-18T12:00:00Z"
 *         updatedAt: "2025-09-18T12:00:00Z"
 */

const RegistroClinico = sequelize.define("registros_clinicos", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	diagnostico: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	tratamiento: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	observaciones: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	historiaClinicaId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: { model: HistoriaClinica, key: "id" },
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
	especialistaId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: { model: Especialistas, key: "id" },
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
}, {  timestamps: true,
      paranoid:true,
});

RegistroClinico.belongsTo(HistoriaClinica, {
	foreignKey: "historiaClinicaId",
	as: "historiaClinica",
	onDelete: "CASCADE"
});
HistoriaClinica.hasMany(RegistroClinico, {
	foreignKey: "historiaClinicaId",
	as: "registrosClinicos"
});

RegistroClinico.belongsTo(Especialistas, {
	foreignKey: "especialistaId",
	as: "especialista",
	onDelete: "CASCADE"
});
Especialistas.hasMany(RegistroClinico, {
	foreignKey: "especialistaId",
	as: "registrosClinicos",
	onDelete: "CASCADE"
});

module.exports = RegistroClinico;
