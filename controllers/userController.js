const { compareHash } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User, ApprovalMaster } = require("../models/index");


class UserController{
    static async login(req, res, next) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				throw { name: "EmailorPasswordRequired" };
			}
			const opt = {
				include: {
					model: ApprovalMaster,
					attributes: ['sequenceLevel']
				},
				where: {email},
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				}
			}
			const user = await User.findOne(opt);
			if (!user) {
				throw { name: "InvalidEmailorPassword" };
			}
			const comparePassword = compareHash(password, user.password);
			if (!comparePassword) {
				throw { name: "InvalidEmailorPassword" };
			}
			const id = user.id
			const payload = {
				id: user.id,
			};
			const role = user.role;
			const access_token = createToken(payload);
			const approvalLevel = user.ApprovalMaster.sequenceLevel
			res.status(200).json({ access_token, email, role, id,  approvalLevel});
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

    static async register(req, res, next) {
		try {
			const { name, role, email, password } = req.body;
			const userRegister = await User.create({
				name,
				role,
				email,
				password,
			});
			res.status(201).json({
				message: `new account with ${userRegister.email} has been created`,
			});
		} catch (err) {
			next(err);
		}
	}
	
	static async getUsers(req, res, next) {
		try {
			const opt = {
				attributes: ['id', 'name', 'email'],
				order: [['id', 'ASC']]
			}
			const data = await User.findAll(opt)
			if (!data) {
				throw{name: 'NotFound'}
			}
			res.status(200).json(data)
		} catch (error) {
			next(error)
		}
	}
}

module.exports= UserController