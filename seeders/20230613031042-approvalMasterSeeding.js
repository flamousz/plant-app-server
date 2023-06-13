"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const data = require("../data/approvalMaster.json");

		data.forEach((el) => {
			el.createdAt = el.updatedAt = new Date();
		});

		await queryInterface.bulkInsert("ApprovalMasters", data, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("ApprovalMasters", null, {});
	},
};
