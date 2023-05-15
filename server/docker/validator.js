import express from "express";

const app = express();

app.use(express.json());

var answers = { 1: 100, 2: 200, 3: 300 };

// DISCLAIMER: Assuming that we use only integers for now.
// The answers are only integers, and the C++ files written are also integers
app.post("/validate", (req, res) => {
  const question = req.body.question;
  const solution = answers[question];
  res.send(solution == req.body.solution);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
