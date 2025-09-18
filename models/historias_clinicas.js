const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Pacientes = require("./pacientes");

const HistoriaClinica = sequelize.define("historias_clinicas", {
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sexo: {
        type: DataTypes.ENUM("masculino","femenino","otro"),
        allowNull: false,
    },
    raza: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    enfermedades: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    antecedentes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {timestamps: true,
});

HistoriaClinica.belongsTo(Pacientes, {
    foreignKey: "pacienteId",
    onDelete: "CASCADE"
});
Pacientes.hasOne(HistoriaClinica, {
    foreignKey: "pacienteId"
});

module.exports = HistoriaClinica;
