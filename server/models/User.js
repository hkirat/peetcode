const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	userId: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password") || user.isNew) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(user.password, salt);
			user.password = hash;
			return next();
		} catch (err) {
			return next(err);
		}
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
