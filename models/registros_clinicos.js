const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const HistoriClinica = require ("./historias_clinicas");
const Especialistas = require("./especialistas");

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

RegistroClinico.belongsTo(HistoriClinica, {
    foreignKey: "historiaClinicaId",
    onDelete: "CASCADE"
});
HistoriClinica.hasMany(RegistroClinico, {
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
