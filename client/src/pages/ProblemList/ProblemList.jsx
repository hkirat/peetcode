import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./problemList.css";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  const init = async () => {
    const response = await fetch('http://localhost:3000/problems', {
      method: "GET",
    });

    const json = await response.json();
    setProblems(json.problems);
  }

  useEffect(() => {
    init()
  }, []);
  return (
    <main id="problemList">
      <table id="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Acceptance</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => {
            return (
              <ProblemStatement
                problemId={problem.problemId}
                title={problem.title}
                acceptance={problem.acceptance}
                difficulty={problem.difficulty}
              />
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

function ProblemStatement(props) {
  const problemId = props.problemId;
  const title = props.title;
  const acceptance = props.acceptance;
  const difficulty = props.difficulty;

  return (
    <tr id="row">
      <td>
        <Link id="problemLink" to={"/problems/" + problemId}>
          {problemId}. {title}
        </Link>
      </td>
      <td>{acceptance}</td>
      <td id={difficulty}>{difficulty}</td>
    </tr>
  );
}

export default ProblemList;
