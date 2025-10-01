"use strict";

const {v4: uuidv4} =require('uuid');
module.exports = {
	up: async(queryInterface, Sequelize)=> {
		return queryInterface.bulkInsert("personas", [{
			id: uuidv4(),
			usuario: "admin",
			contrasena: "admin123",
			rol: "admin",
			correo: "admin@correo.com",
			createdAt: new Date(),
			updatedAt: new Date()
		}],{});
	},

	down: async(queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("personas", { usuario: "admin" }, {});
	},
}; 