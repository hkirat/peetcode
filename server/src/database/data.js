const USERS = [];
const QUESTIONS = [
  {
    id: 1,
    title: "Two States",
    description: "Given an array, return the maximum value in the array.",
    difficulty: "Easy",
    acceptance: "87%",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "5",
      },
    ],
  },
  {
    id: 2,
    title: "String Reversal",
    description: "Write a function that reverses a given string.",
    difficulty: "Easy",
    acceptance: "92%",
    testCases: [
      {
        input: "'hello'",
        output: "'olleh'",
      },
    ],
  },
  {
    id: 3,
    title: "Palindrome Check",
    description:
      "Write a function that checks if a given string is a palindrome.",
    difficulty: "Easy",
    acceptance: "81%",
    testCases: [
      {
        input: "'radar'",
        output: "true",
      },
      {
        input: "'openai'",
        output: "false",
      },
    ],
  },
  {
    id: 4,
    title: "FizzBuzz",
    description:
      "Write a program that prints the numbers from 1 to 100. But for multiples of three, print 'Fizz' instead of the number, and for the multiples of five, print 'Buzz'. For numbers which are multiples of both three and five, print 'FizzBuzz'.",
    difficulty: "Easy",
    acceptance: "97%",
    testCases: [
      {
        input: "15",
        output: "'FizzBuzz'",
      },
      {
        input: "5",
        output: "'Buzz'",
      },
      {
        input: "3",
        output: "'Fizz'",
      },
    ],
  },
  {
    id: 5,
    title: "Array Sum",
    description:
      "Write a function that takes an array of numbers and returns the sum of all the numbers.",
    difficulty: "Easy",
    acceptance: "89%",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "15",
      },
      {
        input: "[10, 20, 30, 40, 50]",
        output: "150",
      },
    ],
  },
  {
    id: 6,
    title: "Factorial",
    description:
      "Write a function that calculates the factorial of a given number.",
    difficulty: "Medium",
    acceptance: "75%",
    testCases: [
      {
        input: "5",
        output: "120",
      },
      {
        input: "6",
        output: "720",
      },
    ],
  },
  {
    id: 7,
    title: "Anagram Check",
    description:
      "Write a function that checks if two given strings are anagrams of each other.",
    difficulty: "Medium",
    acceptance: "82%",
    testCases: [
      {
        input: "'listen', 'silent'",
        output: "true",
      },
      {
        input: "'openai', 'aiopen'",
        output: "false",
      },
    ],
  },
  {
    id: 8,
    title: "Prime Number Check",
    description: "Write a function that checks if a given number is prime.",
    difficulty: "Medium",
    acceptance: "68%",
    testCases: [
      {
        input: "7",
        output: "true",
      },
      {
        input: "12",
        output: "false",
      },
    ],
  },
  {
    id: 9,
    title: "Matrix Transpose",
    description:
      "Write a function that takes a matrix (2D array) and returns its transpose.",
    difficulty: "Medium",
    acceptance: "71%",
    testCases: [
      {
        input: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
        output: "[[1, 4, 7], [2, 5, 8], [3, 6, 9]]",
      },
      {
        input: "[[1, 2], [3, 4], [5, 6]]",
        output: "[[1, 3, 5], [2, 4, 6]]",
      },
    ],
  },
  {
    id: 10,
    title: "Linked List Cycle Detection",
    description:
      "Write a function that determines if a linked list contains a cycle.",
    difficulty: "Hard",
    acceptance: "48%",
    testCases: [
      {
        input: "LinkedList with a cycle",
        output: "true",
      },
      {
        input: "LinkedList without a cycle",
        output: "false",
      },
    ],
  },
  {
    id: 11,
    title: "Binary Search Tree Check",
    description:
      "Write a function that determines if a given binary tree is a valid binary search tree.",
    difficulty: "Hard",
    acceptance: "52%",
    testCases: [
      {
        input: "Binary Tree that is a valid BST",
        output: "true",
      },
      {
        input: "Binary Tree that is not a valid BST",
        output: "false",
      },
    ],
  },
  // Add two more questions here
  {
    id: 12,
    title: "Array Average",
    description:
      "Write a function that takes an array of numbers and returns the average value.",
    difficulty: "Easy",
    acceptance: "83%",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "3",
      },
      {
        input: "[10, 20, 30, 40, 50]",
        output: "30",
      },
    ],
  },
  {
    id: 13,
    title: "Reverse Words",
    description:
      "Write a function that reverses the order of words in a given string.",
    difficulty: "Medium",
    acceptance: "77%",
    testCases: [
      {
        input: "'Hello World'",
        output: "'World Hello'",
      },
      {
        input: "'OpenAI is awesome'",
        output: "'awesome is OpenAI'",
      },
    ],
  },
];

const SUBMISSION = [];

module.exports = { USERS, QUESTIONS, SUBMISSION };
