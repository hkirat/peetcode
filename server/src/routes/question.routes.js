const express = require("express");
const {
  getQuestions,
  addQuestion,
  getQuestionsList,
  getQuestion,
} = require("../controllers/question.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require('../middlewares/isAdmin.middleware');

const router = express.Router();

router.get("/", getQuestionsList);
router.get('/:id', getQuestion)
router.post("/", authMiddleware, isAdmin, addQuestion);

module.exports = router;
