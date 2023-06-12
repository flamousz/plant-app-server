"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Add a new temporary column to hold the converted boolean values
		await queryInterface.addColumn("EmployeeTaskConjunctions", "tempOffDay", {
			type: Sequelize.BOOLEAN,
		});

		// Update the temporary column with the converted values
		await queryInterface.sequelize.query(`
      UPDATE "EmployeeTaskConjunctions"
      SET "tempOffDay" = CASE 
        WHEN "offDay" = 'true' THEN true
        WHEN "offDay" = 'false' THEN false
        ELSE NULL
      END
    `);

		// Remove the old offDay column
		await queryInterface.removeColumn("EmployeeTaskConjunctions", "offDay");

		// Rename the temporary column to offDay
		await queryInterface.renameColumn(
			"EmployeeTaskConjunctions",
			"tempOffDay",
			"offDay"
		);
	},

	async down(queryInterface, Sequelize) {
		// Add a new temporary column to hold the converted string values
		await queryInterface.addColumn("EmployeeTaskConjunctions", "tempOffDay", {
			type: Sequelize.STRING,
		});

		// Update the temporary column with the converted values
		await queryInterface.sequelize.query(`
      UPDATE "EmployeeTaskConjunctions"
      SET "tempOffDay" = CASE 
        WHEN "offDay" = true THEN 'true'
        WHEN "offDay" = false THEN 'false'
        ELSE NULL
      END
    `);

		// Remove the old offDay column
		await queryInterface.removeColumn("EmployeeTaskConjunctions", "offDay");

		// Rename the temporary column to offDay
		await queryInterface.renameColumn(
			"EmployeeTaskConjunctions",
			"tempOffDay",
			"offDay"
		);
	},
};
