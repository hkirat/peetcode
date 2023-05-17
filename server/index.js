const express = require("express");
const app = express();
const port = 3000;
var jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
const axios = require("axios");
let USER_ID_COUNTER = 1;
const USERS = [];
const JWT_SECRET = "secret";
const bodyParser = require("body-parser");
const Submission = require("./models/submission.js");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require("cors");
// const addToQueue = require("./queue/send");
const RabbitMQClient = require("./rpc/client/client");
app.use(cors());
app.use(jsonParser);

const PROBLEMS = [
  {
    problemId: "1",
    title: "101",
    difficulty: "Easy",
    acceptance: "92%",
    description: "What is the first three digit number.",
    exampleIn: "NA",
    exampleOut: "NA",
  },
  {
    problemId: "2",
    title: "102",
    difficulty: "Easy",
    acceptance: "98%",
    description: "What is the number after 199.",
    exampleIn: "NA",
    exampleOut: "NA",
  },
];

const SUBMISSIONS = [];

app.get("/", (req, res) => {
  res.json({
    msg: "hello world",
  });
});

app.get("/problems", (req, res) => {
  const filteredProblems = PROBLEMS.map((x) => ({
    problemId: x.problemId,
    difficulty: x.difficulty,
    acceptance: x.acceptance,
    title: x.title,
  }));

  res.json({
    problems: filteredProblems,
  });
});

app.get("/problem/:id", (req, res) => {
  const id = req.params.id;

  const problem = PROBLEMS.find((x) => x.problemId === id);

  if (!problem) {
    return res.status(411).json({});
  }

  res.json({
    problem,
  });
});

app.get("/me", auth, (req, res) => {
  const user = USERS.find((x) => x.id === req.userId);
  res.json({ email: user.email, id: user.id });
});

app.get("/submissions/:problemId", auth, (req, res) => {
  const problemId = req.params.problemId;
  const submissions = SUBMISSIONS.filter(
    (x) => x.problemId === problemId && x.userId === req.userId
  );
  res.json({
    submissions,
  });
});

const rabbitMQClient = new RabbitMQClient();

app.post("/submission", auth, async (req, res) => {
  console.log(req.body);
  // res.send({ response });
  // const isCorrect = Math.random() < 0.5;
  const problemId = req.body.problemId;
  const submission = req.body.submission;
  // console.log("[Server] The body is: ", req.body);
  const newSubmission = new Submission(1, problemId, submission);
  console.log("Sending submission to sender");
  try {
    const reply = await rabbitMQClient.produce(req.body);
    console.log("Inside server: ", reply);
    if (reply.status) {
      SUBMISSIONS.push({
        submission,
        problemId,
        userId: req.userId,
        status: "AC",
      });
      res.json({
        status: "AC",
      });
    } else {
      SUBMISSIONS.push({
        submission,
        problemId,
        userId: req.userId,
        status: "WA",
        error: reply.error,
      });
      res.json({
        status: "WA",
        error: reply.error,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.send(JSON.parse(error));
  }
});

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (USERS.find((x) => x.email === email)) {
    return res.status(403).json({ msg: "Email already exists" });
  }

  USERS.push({
    email,
    password,
    id: USER_ID_COUNTER++,
  });

  return res.json({
    msg: "Success",
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = USERS.find((x) => x.email === email);

  if (!user) {
    return res.status(403).json({ msg: "User not found" });
  }

  if (user.password !== password) {
    return res.status(403).json({ msg: "Incorrect password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_SECRET
  );

  return res.json({ token });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  rabbitMQClient.initialise();
});
