const User = require('../models/user.model');
const shortid = require('shortid');

/**
 * !Finduser
 */
const FindUser = async (id, email) => {
	if (email) {
		return await User.findOne({ email: email });
	} else {
		return await User.findById(id);
	}
};

/**
 * !GenerateUserToken
 */
const GenerateUserToken = (firstName, lastName, role) => {
	const first_elem = firstName[0].toUpperCase() + lastName[0].toUpperCase();
	const second_elem = role ? role.toUpperCase() : 'USER';
	const third_elem = shortid.generate().toUpperCase();

	return first_elem + '_' + second_elem + '_' + third_elem;
};
module.exports = { FindUser, GenerateUserToken, isUserTheOwner };
