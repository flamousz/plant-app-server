"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.sequelize.transaction(async (t) => {
			// Get all rows with null values in the `code` column
			const rows = await queryInterface.sequelize.query(
				"SELECT * FROM PlantSchedules",
				{ type: Sequelize.QueryTypes.SELECT, transaction: t }
			);

			// Update the rows with the new_column value
			for (let row of rows) {
				const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
				const newValue = `non-mush${uniqueNumber}`;
				await queryInterface.sequelize.query(
					`UPDATE PlantSchedules SET code = '${newValue}' WHERE id = ${row.id}`,
					{ transaction: t }
				);
			}
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
