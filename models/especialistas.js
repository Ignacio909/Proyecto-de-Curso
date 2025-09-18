const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");
const Personas = require("./personas");


const Especialistas = sequelize.define("especialistas",{
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: true,
});

Especialistas.belongsTo(Personas,{
    foreignKey: "personaId",
    onDelete: "CASCADE"
});
Personas.hasOne(Especialistas,{
    foreignKey: "personaId"
});
module.exports = Especialistas;