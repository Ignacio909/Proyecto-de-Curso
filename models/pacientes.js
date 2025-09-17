const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Personas = requiere("./personas");

const Pacientes = sequelize.define("pacientes", {
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
    timestamps: true,
});

Pacientes.belongsTo(Personas, {
    foreignKey:"personaId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Personas.hasOne(Pacientes, {
    foreignKey: "personaId"
});
module.exports = Pacientes;