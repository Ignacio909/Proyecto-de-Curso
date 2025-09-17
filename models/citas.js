const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Pacientes = require("./pacientes");
const Especialistas = require ("./especialistas");
const { defaults } = require("pg");

const Citas = sequelize.define("citas", {
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
    timestamps: true,
});

Citas.belongsTo(Pacientes, {
    foreignKey: "pacienteId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Pacientes.hasMany(Citas, {
    foreignKey: "pacienteId"
});

Citas.belongsTo(Especialistas, {
    foreignKey: "especialistaId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Especialistas.hasMany(Citas, {
    foreignKey: "especialistaId"
});
module.exports = Citas;