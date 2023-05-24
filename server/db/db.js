const mongoose = require('mongoose');
require('dotenv').config();

const ConnectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB Atlas Connected');
	} catch (error) {
		console.error(`Error is ${error}`);
		process.exit(1);
	}
};

module.exports = ConnectDb;
