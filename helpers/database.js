const Sequelize= require("sequelize");
const dotenv = require("dotenv").config();

const databaseName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dialect = process.env.DB_DIALECT;
const host = process.env.HOST;
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

//Conexion con la BD
const sequelize = new Sequelize(databaseName, user, password, {
	host: host,
	dialect: dialect,
	port: port,
	logging: false,
});

//Funcion para comprobar que salio bien
sequelize
	.authenticate()
	.then(()=>{
		console.log("Conexion establecida correctamente")})
	.catch((err)=>{
		console.log("Error al conectarse con la Base de Datos ")})
module.exports = sequelize;    