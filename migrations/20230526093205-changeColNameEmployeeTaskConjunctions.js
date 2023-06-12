"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn(
			"EmployeeTaskConjunctions",
			"initialDate",
			"workingDate"
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn(
			"EmployeeTaskConjunctions",
			"workingDate",
			"initialDate"
		);
	},
};
