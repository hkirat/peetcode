const express = require('express')
const jwt = require('jsonwebtoken')
const { auth } = require("./middleware");
const app = express()
const port = 3000
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = "secret";

const USERS = [
    { email: "john@email", password: "password1"},
    // more objects here...
];

const SUBMISSIONS = [];

const PROBLEMS = [
  {
    problemId: "205",
    title: "Isomorphic Strings",
    difficulty: "Easy",
    acceptance: "41%",
    description:
      `Given two strings s and t, determine if they are isomorphic.

Two strings s and t are isomorphic if the characters in s can be replaced to get t.
      
All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.`,
    exampleIn: 's = "egg", t = "add"',
    exampleOut: "true",
  },
  {
    problemId: "202",
    title: "Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%",
    description: `Write an algorithm to determine if a number n is happy.

A happy number is a number defined by the following process:
    
- Starting with any positive integer, replace the number by the sum of the squares of its digits.
- Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
- Those numbers for which this process ends in 1 are happy.

Return true if n is a happy number, and false if not.`,
    exampleIn: "n = 19",
    exampleOut: "true",
  },
  {
    problemId: "203",
    title: "Remove Linked List Elements",
    difficulty: "Easy",
    acceptance: "42%",
    description: "Given the head of a linked list and an integer val, remove all the nodes of the linked list that has Node.val == val, and return the new head.",
    exampleIn: "head = [1,2,6,3,4,5,6], val = 6",
    exampleOut: "[1,2,3,4,5]",
  },
  {
    problemId: "546",
    title: "Remove Boxes",
    difficulty: "Hard",
    acceptance: "42%",
    description:
`You are given several boxes with different colors represented by different positive numbers.

You may experience several rounds to remove boxes until there is no box left. Each time you can choose some continuous boxes with the same color (i.e., composed of k boxes, k >= 1), remove them and get k * k points.

Return the maximum points you can get.`,
    exampleIn: "boxes = [1,3,2,2,2,3,4,3,1]",
    exampleOut: "23",
  },
  {
    problemId: "2487",
    title: "Remove Nodes from a Linked List",
    difficulty: "Medium",
    acceptance: "41%",
    description:
`You are given the head of a linked list.

Remove every node which has a node with a strictly greater value anywhere to the right side of it.

Return the head of the modified linked list.`,
    exampleIn: "head = [5,2,13,3,8]",
    exampleOut: "[13, 8]",
  },
  {
    problemId: "1171",
    title: "Remove Zero Sum Consequtive Nodes from Linked List",
    difficulty: "Medium",
    acceptance: "54.9%",
    description: 
`Given the head of a linked list, we repeatedly delete consecutive sequences of nodes that sum to 0 until there are no such sequences.

After doing so, return the head of the final linked list.  You may return any such answer.


(Note that in the examples below, all sequences are serializations of ListNode objects.)`,
    exampleIn: "head = [1,2,-3,3,1]",
    exampleOut: "[3, 1]",
  },
  {
    problemId: "301",
    title: "Remove Invalid Paranthesis",
    difficulty: "Hard",
    acceptance: "42%",
    description:
`Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.

Return a list of unique strings that are valid with the minimum number of removals. You may return the answer in any order.`,
    exampleIn: 's = "()())()"',
    exampleOut: '["(())()","()()()"]',
  },
];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/me', auth, (req, res) => {
  const user = USERS.find((x) => x.email === req.email);
  res.json({ email: user.email, msg: "logged in" });
})

app.get('/problems', (req, res) => {
  const filteredProblems = PROBLEMS.map((x) => ({
    problemId: x.problemId,
    difficulty: x.difficulty,
    acceptance: x.acceptance,
    title: x.title,
  }));

  return res.json({
    problems: filteredProblems
  })
})

app.get('/problem/:id', (req, res) => {
  const id = req.params.id;

  const problem = PROBLEMS.find(x => x.problemId === id)

  if(problem)
    return res.json({problem});
  return res.status(403).json({msg: "no such problem"})
})

app.get('/submissions/:problemId', auth, (req, res) => {
  const submissions = SUBMISSIONS.find(x => x.problemId === req.params.problemId && x.email === req.email);

  res.json({submissions})
})

app.post('/submission/:problemId', auth, (req, res) => {
  const isCorrect = Math.random() < 0.5
  const problemId = req.params.problemId
  const email = req.email

  let submissions = SUBMISSIONS.find(x => x.problemId === problemId && x.email === email);

  if(!submissions){
    submissions = {
      problemId, email, statuses: []
    }

    SUBMISSIONS.push(submissions)
  }
  if(isCorrect) submissions.statuses.unshift('AC');
  else submissions.statuses.unshift('WA');

  return res.json(submissions)
})

app.post('/signup/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPass = req.body.conf_pass;

    if(USERS.find(user => user.email === email)) return res.json({msg: "user already exists"});

    if(password != confirmPass) return res.json({msg: "Password does not match!"});

    USERS.push({email, password});

    return res.json({
        msg: "user added"
    });    
})

app.post('/login', (req, res) => {
  const {email, password} = req.body;

  const user = USERS.find(x => x.email === email)

  if(!user) return res.status(403).json({msg: "email does not exist"});
  if(user && user.password != password) return res.status(403).json({msg: "invalid password"});

  const token = jwt.sign(
    {
      email: user.email,
    },
    JWT_SECRET
  );

  return res.json({ token: token, msg: "logged in" });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})