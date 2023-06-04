const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require("./src/routes/auth.routes");
const submissionRouter = require("./src/routes/submission.routes");
const questionRouter = require("./src/routes/question.routes");

const loggingMiddleware = require("./src/middlewares/logging.middleware.js");
const errorHandler = require("./src/middlewares/errorHandler.middleware");
const responseHandler = require("./src/middlewares/responseHandler.middleware");
const { RABBIT_MQ_QUEUE } = require("./src/lib/constants");
const {
  receiveMessageFromQueue,
  handleSubmissionFromQueue,
} = require("./src/lib/utils");
const authMiddleware = require("./src/middlewares/auth.middleware");
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
app.use(responseHandler);

app.use("/", authRouter);
app.use("/submissions", authMiddleware, submissionRouter);
app.use("/questions", questionRouter);

app.use(errorHandler);
receiveMessageFromQueue(RABBIT_MQ_QUEUE, handleSubmissionFromQueue);

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
