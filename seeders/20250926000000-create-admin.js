"use strict";

const {v4: uuidv4} =require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
	up: async(queryInterface, Sequelize)=> {
		const hashedPassword = await bcrypt.hash('admin123', 12);
		return queryInterface.bulkInsert("personas", [{
			id: uuidv4(),
			usuario: "admin",
			contrasena: hashedPassword,
			rol: "admin",
			correo: "admin@gmail.com",
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}],{});
	},

	down: async(queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("personas", { usuario: "admin" }, {});
	},
}; 