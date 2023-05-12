const mongoose = require("mongoose");

const SubmissionsSchema = new mongoose.Schema({
	submission: {
		type: String,
		required: true,
	},
	problemId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const SubmissionsModel = mongoose.model("submissions", SubmissionsSchema);

module.exports = SubmissionsModel;
