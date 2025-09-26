/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - usuario
 *         - contrasena
 *         - rol
 *         - correo
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID autogenerado (UUID)
 *         usuario:
 *           type: string
 *         contrasena:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [paciente, especialista, admin]
 *         correo:
 *           type: string
 *           format: email
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require ("sequelize");
const sequelize = require("../helpers/database");

const Personas = sequelize.define("personas",{
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	usuario: {
		type: DataTypes.STRING,
		allowNull:false,
		unique: true,
	},
	contrasena: {
		type: DataTypes.STRING,
		allowNull:false,
	},
	rol: {
		type: DataTypes.ENUM("paciente","especialista","admin"),
		allowNull: false,
	},
	correo: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {isEmail: true},
	},
}, {
	timestamps: true,  
});
module.exports = Personas;