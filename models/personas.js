const { DataTypes, ENUM } = require ("sequelize");
const sequelize = require("../helpers/database");

const Personas = sequelize.define("personas",{
    usuario: {
        type: DataTypes.STRING,
        allowNull:null,
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