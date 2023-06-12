const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const { Task, ToolConjunction, Item } = require("../models/index");

class CsvController {
	static async taskMasterExport(req, res, next) {
		try {
			const data = req.body
			console.log(data,'<<<<<<<< data di csv controller');
			// Add index to the data
			const indexedData = data.map((item, index) => ({ ...item, index: index + 1 }));

			console.log(data, '<<< DATA');
			console.log(indexedData, '<<< indexedData');

			const csvHeaders = Object.keys(indexedData[0])
			.filter((key) => key !== 'index' && key !== 'SeedId') // Remove 'index' property from csvHeaders
			.map((key, index) => {
				if (Array.isArray(indexedData[0][key])) {
					return null; // Exclude the key if the value is an array
				}
				

				const title = key
					.split(/(?=[A-Z])/)
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ");

				return {
					id: index === 0 ? 'index' : key,
					title: index === 0 ? 'number' : title,
				};
			})
			.filter((header) => header !== null); // Filter out excluded headers


			console.log(csvHeaders, "<<<< csvHeaders");
			const csvWriter = createObjectCsvWriter({
				path: "csvData/file.csv",
				header: csvHeaders,
			});
			await csvWriter.writeRecords(indexedData);

			// Stream the CSV file as a response
			const filePath = path.join(__dirname, "../csvData/file.csv");
			console.log(filePath, "<<< filePath");

			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=exported_data.csv"
			);

			// creates a readable stream from the specified file path, allowing to efficiently read the file's contents in chunks or streams.
			const fileStream = fs.createReadStream(filePath);

			fileStream.pipe(res);
			fileStream.on('end', () => {
				res.end(); // End the response after piping the file stream
			});
			// res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CsvController;
