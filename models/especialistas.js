const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Personas = require("./personas");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");

const Especialistas = sequelize.define("especialistas",{
    especilidad: {
        tyoe: DataTypes.STRING,
        allowNull: false,
    },
    timestamps: true,
});

Especialistas.belongsTo(Personas,{
    foreignKey: "personaId",onDelete: "CASCADE"
});
Personas.hasOne(Especialistas,{
    foreignKey: "personaId"
});
module.exports = Especialistas;