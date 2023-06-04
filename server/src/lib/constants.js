const path = require("path");

const JWT_SECRET_KEY = "my-secret-key";
const JWT_OPTIONS = {};

const RABBIT_MQ_PORT = "amqp://localhost";
const RABBIT_MQ_QUEUE = "submissions";

const parentDir = path.resolve(__dirname, "../..");
const submissionDir = path.join(parentDir, "submissions");

module.exports = {
  JWT_SECRET_KEY,
  JWT_OPTIONS,
  RABBIT_MQ_PORT,
  RABBIT_MQ_QUEUE,
  submissionDir,
};
