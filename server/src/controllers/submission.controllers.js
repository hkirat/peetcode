const { SUBMISSION } = require("../database/data");
var amqp = require("amqplib/callback_api");
const { sendMessageToQueue } = require("../lib/utils");
const { RABBIT_MQ_QUEUE } = require("../lib/constants");

const getSubmissionsOfProblem = async (req, res) => {
  // return the users submissions for this problem
  const problemId = Number.parseInt(req.params.id);
  const submissions = SUBMISSION.filter(
    (submission) =>
      submission.problemId === problemId &&
      submission.submittedBy === req.user.id
  ).sort((a, b) => b.submittedAt - a.submittedAt);

  res.customJson(submissions, "Submissions fetched successfully", 200);
};

const addSubmissionToProblem = async (req, res, next) => {
  try {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const problemId = Number.parseInt(req.params.id);
    const { code, language } = req.body;
    if (!code) {
      const err = new Error("No code provided");
      err.statusCode = 400;
      throw err;
    }

    const submission = {
      id: SUBMISSION.length,
      problemId,
      code,
      status: "pending",
      language,
      submittedBy: req.user.id,
      submittedAt: new Date(),
    };
    SUBMISSION.push(submission);
    sendMessageToQueue(RABBIT_MQ_QUEUE, JSON.stringify(submission));
    res.customJson(submission, "Submission added successfully", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSubmissionsOfProblem, addSubmissionToProblem };
