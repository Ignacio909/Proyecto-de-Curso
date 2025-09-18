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
 *           type: integer
 *           description: ID autogenerado
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
 *           type: integer
 *           description: ID de la historia clínica asociada
 *         especialistaId:
 *           type: integer
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
 *         id: 1
 *         diagnostico: "Gripe común"
 *         tratamiento: "Reposo e hidratación"
 *         observaciones: "Paciente debe regresar en 7 días"
 *         historiaClinicaId: 3
 *         especialistaId: 2
 *         createdAt: "2025-09-18T12:00:00Z"
 *         updatedAt: "2025-09-18T12:00:00Z"
 */

const RegistroClinico = sequelize.define("registros_clinicos", {
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
}, {    timestamps: true,
});

RegistroClinico.belongsTo(HistoriaClinica, {
    foreignKey: "historiaClinicaId",
    onDelete: "CASCADE"
});
HistoriaClinica.hasMany(RegistroClinico, {
    foreignKey: "historiaClinicaId"
});

RegistroClinico.belongsTo(Especialistas, {
    foreignKey: "especialistaId",
    onDelete: "CASCADE"
});
Especialistas.hasMany(RegistroClinico, {
    foreignKey: "especialistaId",
    onDelete: "CASCADE"
});

module.exports = RegistroClinico;
