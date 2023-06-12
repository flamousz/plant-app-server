const jwt = require('jsonwebtoken')

const secret = process.env.JWT_PASSWORD;

module.exports = {
	createToken: (payload) => {
		return jwt.sign(payload, secret);
	},
	decodedToken: (token) => {
		return jwt.verify(token, secret);
	},
};
