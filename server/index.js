const express = require("express");
const app = express();
const port = 3000;
var jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
let USER_ID_COUNTER = 1;
const USERS = [];
const JWT_SECRET = "secret";
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const mongodbURI = require("./constants");
const ProblemsModel = require("./models/Problems");
const UserModel = require("./models/User");
const SubmissionsModel = require("./models/Submissions");
app.use(cors());
app.use(jsonParser);

app.get("/", (req, res) => {
	res.json({
		msg: "hello world",
	});
});

app.get("/problems", async (req, res) => {
	const problems = await ProblemsModel.find();

	res.json({
		problems: problems,
	});
});

app.get("/problem/:id", async (req, res) => {
	const id = req.params.id;

	const problem = await ProblemsModel.findOne({ problemId: id });

	if (!problem) {
		return res.status(404).json({ error: "Problem Not Found" });
	}

	res.json({
		problem,
	});
});

app.get("/me", auth, async (req, res) => {
	const user = await UserModel.findOne({ userId: req.userId });
	res.json({ user });
});

app.get("/submissions/:problemId", auth, async (req, res) => {
	const problemId = req.params.problemId;
	const submissions = await SubmissionsModel.find({
		problemId: problemId,
		userId: req.userId,
	});
	res.json({
		submissions,
	});
});

app.post("/submission", auth, async (req, res) => {
	const isCorrect = Math.random() < 0.5;
	const { problemId, submission } = req.body;
	let status = isCorrect ? "AC" : "WA";

	const newSubmission = new SubmissionsModel({
		submission: submission,
		problemId: problemId,
		userId: req.userId,
		status: status,
	});

	await newSubmission.save();
	return res.json({
		status: status,
	});
});

app.post("/signup", async (req, res) => {
	console.log(req.body);
	try {
		const existingEmail = await UserModel.findOne({
			email: req.body.email,
		});
		if (existingEmail) {
			return res.status(409).json({ message: "Email already exists!" });
		}

		const newUser = new UserModel({
			email: req.body.email,
			password: req.body.password,
		});

		await newUser.save();

		console.log("User created!");
		console.log(newUser.toJSON());
		return res.json({
			msg: "Success",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
});

app.post("/login", async (req, res) => {
	console.log(req.body);
	try {
		const email = req.body.email;
		const password = req.body.password;
		const user = await UserModel.findOne({
			name: req.body.username,
		});
		if (!user) {
			return res.status(403).json({ msg: "User not found" });
		}

		const isMatch = await user.comparePassword(req.body.password);
		if (!isMatch) {
			return res.status(403).json({ msg: "Incorrect password" });
		}

		const token = jwt.sign(
			{
				id: user.userId,
			},
			JWT_SECRET
		);

		console.log("User logged in!");
		console.log(req.body.username);
		res.status(200).json({
			message: "Logged in successfully!",
			token: token,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
  
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

app.post("/submission", auth, (req, res) => {
  const isCorrect = Math.random() < 0.5;
  const problemId = req.body.problemId;
  const submission = req.body.submission;

  if (isCorrect) {
    SUBMISSIONS.push({
      submission,
      problemId,
      userId: req.userId,
      status: "AC",
    });
    return res.json({
      status: "AC",
    });
  } else {
    SUBMISSIONS.push({
      submission,
      problemId,
      userId: req.userId,
      status: "WA",
    });
    return res.json({
      status: "WA",
    });
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

mongoose
	.connect(mongodbURI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log("ERROR: " + err);
	});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
