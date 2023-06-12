async function errHandler(err, req, res, next) {
	let status = 500;
	let message = "Internal server error";
	console.log(err);
	switch (err.name) {
		case "Unauthenticated":
			status = 401;
			message = "Unauthenticated";
			break;

		case "SequenceValueError":
			status = 500;
			message = "Sequence from Approve table is larger than Approve Master table"
			break;
		case "JsonWebTokenError":
			status = 401;
			message = "Invalid token";
			break;

		case "NotFound":
			status = 404;
			message = "Data Not Found";
			break;

		case "EmailorPasswordRequired":
			status = 400;
			message = "Email or Password Required";
			break;

		case "InvalidEmailorPassword":
			status = 401;
			message = "Invalid Email or Password";
			break;

		case "SequelizeUniqueConstraintError":
		case "SequelizeValidationError":
			status = 400;
			message = err.errors.map((el) => el.message);
			break;

		default:
			break;
	}

	res.status(status).json({ message });
}

module.exports = errHandler;
