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
 *         imagen:
 *           type: string
 *           description: Ruta de la imagen de perfil (opcional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const { DataTypes } = require ("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../helpers/database");
const AppError = require ("../errors/AppError")


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
		validate: {
            // Validación personalizada para contraseña fuerte
            isStrongPassword(value) {
                // Mínimo 8 caracteres, al menos una letra, un número y un símbolo
                const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/
                if (!regex.test(value)) {
                    throw new AppError("Contraseña insegura: requiere min. 8 caracteres, letras, números y un símbolo (@$!%*#&).", 400);
                }
            }
		}
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
	imagen: {
		type: DataTypes.STRING,
		allowNull: true, // Opcional como solicitaste
	},
}, {
	timestamps: true,
	paranoid: true,
	hooks: {
		beforeCreate: async (persona) => {
			if (persona.contrasena) {
				const saltRounds = 12;
				persona.contrasena = await bcrypt.hash(persona.contrasena, saltRounds);
			}
		},
		beforeUpdate: async (persona) => {
			if (persona.changed("contrasena") && persona.contrasena) {
				const saltRounds = 12;
				persona.contrasena = await bcrypt.hash(persona.contrasena, saltRounds);
			}
		}
	}
});
module.exports = Personas;