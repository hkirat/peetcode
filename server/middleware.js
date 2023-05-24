var jwt = require('jsonwebtoken');

module.exports = {
	auth: (req, res, next) => {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			return res.status(403).json({ msg: 'Missing auth header' });
		}
		const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
		if (decoded && decoded.id) {
			req.userId = decoded.id;
			next();
		} else {
			return res.status(403).json({ msg: 'Incorrect token' });
		}
	},
};

/**
 * !New auth middleware
 * !isSignedIn
 */
exports.isSignedIn = async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, SECRET);
			req.user = await User.findById(decoded._id).select('-password');
			next();
		} catch (err) {
			console.log(err);
			res.status(401).json({ Status: 'Not authorized' });
		}
	}
	if (!token) {
		res.status(401).json({ Status: 'No token is provided' });
	}
};
