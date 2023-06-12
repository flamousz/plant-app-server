const { decodedToken } = require("../helpers/jwt");
const { User } = require("../models/index");


async function authentication(req, res, next) {
	try {
		const { access_token } = req.headers;
		if (!access_token) {
			throw { name: "Unauthenticated" };
		}
		const payload = decodedToken(access_token);
		if (!payload) {
			throw { name: "JsonWebTokenError" };
		}

		const user = await User.findByPk(payload.id);
		if (!user) {
			throw { name: "Unauthenticated" };
		}

		req.user = {
			id: user.id,
			role: user.role,
			name: user.name,
		};
		next();
	} catch (err) {
		next(err);
	}
}

module.exports = { authentication };