module.exports = class Submission {
  constructor(userId, questionId, solution) {
    this.userId = userId;
    this.questionId = questionId;
    this.solution = solution;
  }
};
