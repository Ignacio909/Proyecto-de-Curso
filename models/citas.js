/**
 * @swagger
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       required:
 *         - fecha
 *         - hora
 *         - pacienteId
 *         - especialistaId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fecha:
 *           type: string
 *           format: date
 *         hora:
 *           type: string
 *           example: "14:30:00"
 *         estado:
 *           type: string
 *           enum: [pendiente, completada, cancelada]
 *         pacienteId:
 *           type: string
 *           format: uuid
 *         especialistaId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require ("sequelize");
const sequelize = require("../helpers/database");
const Pacientes = require("./pacientes");
const Especialistas = require ("./especialistas");


const Citas = sequelize.define("citas", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	fecha: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	hora: {
		type: DataTypes.TIME,
		allowNull: false,
	},
	estado: {
		type: DataTypes.ENUM("pendiente", "completada", "cancelada"),
		defaultValue: "pendiente",
	},
	pacienteId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: { model: Pacientes, key: "id" },
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
}, {timestamps: true,
	paranoid:true,
});

Citas.belongsTo(Pacientes, {
	foreignKey: "pacienteId",
	as: "paciente",
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});
Pacientes.hasMany(Citas, {
	foreignKey: "pacienteId",
	as: "citasPaciente"
});

Citas.belongsTo(Especialistas, {
	foreignKey: "especialistaId",
	as: "especialista",
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});
Especialistas.hasMany(Citas, {
	foreignKey: "especialistaId",
	as: "citasEspecialista"
});

// Relación many-to-many a través de Citas
Pacientes.belongsToMany(Especialistas, {
	through: Citas,
	foreignKey: "pacienteId",
	otherKey: "especialistaId",
	as: "especialistas"
});
Especialistas.belongsToMany(Pacientes, {
	through: Citas,
	foreignKey: "especialistaId",
	otherKey: "pacienteId",
	as: "pacientes"
});
module.exports = Citas;