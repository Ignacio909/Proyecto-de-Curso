"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		const now = new Date();
		await queryInterface.bulkInsert("personas", [
			{
				usuario: "admin",
				contrasena: "admin123",
				rol: "admin",
				correo: "admin@correo.com",
				createdAt: now,
				updatedAt: now,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("personas", { usuario: "admin" }, {});
	},
}; 