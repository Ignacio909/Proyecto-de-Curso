/**
 * @swagger
 * components:
 *   schemas:
 *     Especialista:
 *       type: object
 *       required:
 *         - especialidad
 *         - personaId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         especialidad:
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


const Especialistas = sequelize.define("especialistas",{
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	especialidad: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	personaId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: { model: Personas, key: "id" },
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
}, {timestamps: true,
});

Especialistas.belongsTo(Personas,{
	foreignKey: "personaId",
	as: "persona",
	onDelete: "CASCADE"
});
Personas.hasOne(Especialistas,{
	foreignKey: "personaId",
	as: "especialista"
});
module.exports = Especialistas;