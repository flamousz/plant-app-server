"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.addColumn("ApprovalMasters", "UserId", {
			type: Sequelize.INTEGER,
			references: {
				model: "Users",
				key: "id",
			},
		});
	},

	async down(queryInterface, Sequelize) {
		queryInterface.removeColumn("ApprovalMasters", "UserId", {});
	},
};
