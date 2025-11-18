/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       required:         
 *         - telefono
 *         - carnetIdentidad
 *         - personaId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid 
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
const { DataTypes } = require ("sequelize");
const sequelize = require("../helpers/database");
const Personas = require("./personas");
const bcrypt = require('bcryptjs');

const Pacientes = sequelize.define("pacientes", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
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
		unique: true,
		references: {
			model: Personas,
			key: "id",
		},
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	},
}, { timestamps: true,
	paranoid:true,
	  hooks: {
    beforeCreate: async (persona) => {
      if (persona.contrasena) {
        const saltRounds = 12;
        persona.contrasena = await bcrypt.hash(persona.contrasena, saltRounds);
      }
    },
    beforeUpdate: async (persona) => {
      if (persona.changed('contrasena') && persona.contrasena) {
        const saltRounds = 12;
        persona.contrasena = await bcrypt.hash(persona.contrasena, saltRounds);
      }
    }
  }
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