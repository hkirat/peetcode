const User = require('../models/user.model');
const { FindUser, GenerateUserToken } = require('../utils/user.utility');
const { GenereteSalt, GeneretePassword, GenerateSignature } = require('../utils/password.utility');

/**
 *
 * ! Add user
 */

exports.signup = async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;

	if (!firstName || !lastName || !email || !password || !role) {
		return res.status(400).json({ message: 'You are missing some fields, all fields are required' });
	}
	const UserExist = await FindUser('', email);

	if (UserExist) {
		return res.status(409).json({ message: 'User already exists' });
	}
	// generate salts
	const salt = await GenereteSalt();
	const hash_password = await GeneretePassword(password, salt);
	const _createUser = await User.create({
		firstName,
		lastName,
		email,
		hash_password,
		role,
		userToken: GenerateUserToken(firstName, lastName, role),
	});
	return res.status(200).json({
		_createUser,
	});
};
