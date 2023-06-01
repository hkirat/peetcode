const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;
const secretKey = "secret";

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Not logged in');
  }
  try {
    let decodedToken = jwt.verify(token, secretKey);
    if (decodedToken && decodedToken.id) {
      req.userId = decodedToken.id;
      next();
    }
  }
  catch (err) {
    return res.status(403).json({ message: err.message })
  }
}

const checkIfAdmin = function (req, res, next) {
  try {
    let id = req.userId;
    let found = false;
    USERS.forEach(user => {
      if (user.id === id && user.isAdmin) {
        found = true;
        next();
      }
    })
    if (!found) {
      return res.status(401).send("User not admin");
    }
  }
  catch (err) {
    return res.status(401).send("Unauthorized");
  }
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


class User {
  constructor(id, username, password, isAdmin) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

const USERS = [
  new User(1, "a", "a", true),
  new User(2, "b", "b", false)
];

const QUESTIONS = [{
  id: 1,
  title: "Two states",
  difficulty: "Easy",
  description: "Given an array , return the maximum of the array?",
  acceptance: "50%",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}, {
  id: 2,
  title: "Two",
  difficulty: "Hard",
  description: "Find a pair of a numbers in a list that sums up to a target",
  acceptance: "40%",
  testCases: [{
    input: "[1,2,3,4,5], 9",
    output: "[3, 4]"
  }]
}];

const SUBMISSION = [
  {
    userId: 1,
    questions: [
      {
        questionId: 1,
        submissions: [
          {
            userCode: "int main() {printf('hello world')}",
            language: "c",
            status: "Success",
          },
          {
            userCode: "int main() {printf('bruh world')}",
            language: "python",
            status: "Success",
          }
        ]
      },
    ]
  },
  {
    userId: 2,
    questions: [
      {
        questionId: 1,
        submissions: [
          {
            userCode: "int main() {printf('bruh world')}",
            language: "python",
            status: "Success",
          }
        ]
      }
    ]
  }
]

// app.get('/signup', function(req, res) {
//   return res.sendFile(__dirname + "/signup.html");
// })
app.post('/signup', function (req, res) {
  // body: 
  // {
  //  username,
  //  password
  // } 
  let username = req.body.username;
  let password = req.body.password;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  let userExists = false;
  USERS.forEach(user => {
    if (user.username === username) {
      userExists = true;
    }
  })

  if (userExists) {
    return res.status(403).json({ message: 'User already exists' });
  }
  else {
    let newUser = new User(USERS.length + 1, username, password, false);
    USERS.push(newUser);
    return res.status(200).send({ message: 'User added!' });
  }
  // return back 200 status code to the client
})

// app.get('/login', function(req, res) {
//   res.sendFile(__dirname + '/login.html');
// })

app.post('/login', function (req, res) {

  let username = req.body.username;
  let password = req.body.password;

  let userExists = false;

  USERS.forEach(user => {
    if (user.username === username) {
      userExists = true;
      if (user.password === password) {
        const token = jwt.sign({ id: user.id }, secretKey);
        return res.status(200).json({ token, message: "Logged in successfully" })
      }
      else {
        return res.status(403).json({ message: "Incorrect Password" });
      }
    }
  })
  if (!userExists) {
    res.status(404).json({ message: "User not found" });
  }

})

app.get('/problemsets', function (req, res) {
  // Fetch the questions from the database
  const questions = QUESTIONS;
  // Render the questions page with the username and questions
  res.status(200).json({ questions: questions });
  //return the user all the questions in the QUESTIONS array
})

app.get("/problems/:questionId", auth, function (req, res) {
  const questionId = req.params.questionId;
  const userId = req.userId;

  // Get user submissions for question
  let i;
  let submissions;
  let found = false;
  for (i = 0; i < SUBMISSION.length; i++) {
    if (SUBMISSION[i].userId == userId) {
      found = true;
      break;
    }
  }

  if (!found) {
    submissions = [];
  }
  else {
    let j;
    let userQuestions = SUBMISSION[i].questions;
    found = false;
    for (j = 0; j < userQuestions.length; j++) {
      if (userQuestions[j].questionId == questionId) {
        found = true;
        break;
      }
    }

    if (!found) {
      submissions = [];
    }
    else {
      submissions = userQuestions[j].submissions;
    }
  }

  // Get question data
  let questionData;
  for (i = 0; i < QUESTIONS.length; i++) {
    if (QUESTIONS[i].id == questionId) {
      questionData = QUESTIONS[i];
      break;
    }
  }
  if (questionData == undefined) return res.status(404).json({ message: "Question not found" })

  return res.status(200).json({ submissions, questionData });
});


app.post("/problems/:questionId", auth, function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const userId = req.userId;
  const questionId = Number(req.params.questionId);
  const userCode = req.body.usercode;
  const language = req.body.language;
  const status = Math.random() > 0.5 ? "Success" : "Fail";

  // Create submission
  const submission = {
    userCode,
    language,
    status
  }

  // Add submission to SUBMISSIONS
  let found = false;
  let i = 0;
  // Find the user
  SUBMISSION.forEach(user => {
    if (user.userId == userId) {
      found = true;
      return;
    }
    if (!found)
      i++;
  })
  if (!found) {
    const newUser = {
      userId,
      questions: []
    };
    SUBMISSION.push(newUser);
  }
  // Reset boolean
  found = false;
  // Find the question
  let j = 0;
  SUBMISSION[i].questions.forEach(question => {
    if (question.questionId == questionId) {
      found = true;
      return;
    }
    if (!found)
      j++;
  })
  if (!found) {
    const newQuestion = {
      questionId,
      submissions: []
    }
    SUBMISSION[i].questions.push(newQuestion);
  }
  SUBMISSION[i].questions[j].submissions.push(submission);
  return res.status(200).json({ message: "Submitted successfully", status })
});

app.get('/admin', auth, checkIfAdmin, (req, res) => {
  return res.send("You are admin");
})
// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
