const mongoose = require("mongoose");

const ProblemsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	problemId: {
		type: String,
		required: true,
	},
	difficulty: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	exampleIn: {
		type: String,
		required: true,
	},
	exampleOut: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const ProblemsModel = mongoose.model("problems", ProblemsSchema);

module.exports = ProblemsModel;
