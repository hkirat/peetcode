const { QUESTIONS } = require("../database/data");

const getQuestionsList = async (_req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.customJson(QUESTIONS, "Questions fetched successfully", 200);
};

const getQuestion = async (req, res, next) => {
  try {
    // Create a route that lets a user get a specific problem
    const { id } = req.params;
    const question = QUESTIONS.find((question) => question.id == id);
    if (!question) {
      const err = new Error("Question not found");
      err.statusCode = 404;
      throw err;
    }
    res.customJson(question, "Question fetched successfully", 200);
  } catch (error) {
    next(error);
  }
};

const addQuestion = async (req, res, next) => {
  try {
    // leaving as hard todos
    // Create a route that lets an admin add a new problem
    // ensure that only admins can do that.
    const { title, description, testCases } = req.body;
    if (!title || !description || !testCases) {
      const err = new Error("Please provide all the required fields");
      err.statusCode = 400;
      throw err;
    }

    const newQuestion = {
      title,
      description,
      testCases,
    };

    QUESTIONS.push(newQuestion);
    res.customJson(newQuestion, "Question added successfully", 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestionsList, addQuestion, getQuestion };
