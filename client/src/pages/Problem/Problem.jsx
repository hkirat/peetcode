import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./problem.css";

const langs = {
  C: "C language boilerplate",
  Java: "Java language boilerplate",
  Python: "Python language boilerplate",
  "C++": "C++ langauge Boilerplate",
};

const Problem = () => {
  // parameter value
  const params = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [toggler, toggle] = useState("problem");
  const [problem, setProblem] = useState();
  const [loggedIn, logger] = useState(false);
  // const { problemId } = params;

  const getSubmissions = async () => {
    const response = await fetch(
      "http://localhost:3000/submissions/" + params.problem_slug,
      {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    const json = await response.json();
    console.log(json);
    setSubmissions(json.submissions.statuses);
    // console.log();
  };

  const init = async () => {
    const getProblem = await fetch(
      "http://localhost:3000/problem/" + params.problem_slug,
      {
        method: "GET",
      }
    );
    // console.log(response.json());
    const getProblemjson = await getProblem.json();
    setProblem(getProblemjson.problem);
    const getLogin = await fetch("http://localhost:3000/me", {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
    // console.log(response.json());
    const getLoginjson = await getLogin.json();
    const msg = getLoginjson.msg;
    // console.log(msg);
    if (msg === "logged in") logger(true);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    getSubmissions();
  }, []);

  if (!problem) {
    return <div>Problem not found</div>;
  }

  const performToggle = () => {
    document.getElementById("descriptionButton").classList.toggle("active");
    document.getElementById("submissionsButton").classList.toggle("active");

    if (toggler === "problem") toggle("submissions");
    else if (toggler === "submissions") toggle("problem");
  };

  const Submissions = (props) => {
    return (
      <>
        {props.loggedIn ? (
          <ShowSubmissions problemId={props.problemId} />
        ) : (
          <NoLogin />
        )}
      </>
    );
  };

  const NoLogin = () => {
    return <>Please login to see your submissions</>;
  };

  const ShowSubmissions = (props) => {
    // getSubmissions();
    return (
      <div>
        {submissions.length == 0 ? (
          <p className="status">No problems yet</p>
        ) : (
          submissions.map((status) => {
            return (
              <p className="status" id={status}>
                {status}
              </p>
            );
          })
        )}
      </div>
    );
  };

  const ProblemDescription = (props) => {
    const {
      problemId,
      title,
      difficulty,
      acceptance,
      description,
      exampleIn,
      exampleOut,
    } = props.problem;
    return (
      <>
        <div className="info">
          <h1>
            {problemId}. {title}
          </h1>
          <span id={difficulty} className="difficulty">
            {difficulty}
          </span>
          <p>{description}</p>
        </div>

        <div className="example">
          <div className="ex1">
            <h1>Example:</h1>
            <p id="exampleInOut">
              <b>Input: </b>
              {exampleIn} <br /> <b>Output: </b> {exampleOut}
            </p>
          </div>
        </div>
      </>
    );
  };

  function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState("C");
    const [textInputValue, setCodebox] = useState(langs[selectedLanguage]);

    const setLanguage = (e) => {
      setSelectedLanguage(e.target.value);
      setCodebox(langs[e.target.value]);
    };

    const setBoilerplate = (e) => {
      setCodebox(e.target.value);
    };

    const submitProblem = async () => {
      const response = await fetch(
        "http://localhost:3000/submission/" + params.problem_slug,
        {
          method: "POST",
          headers: {
            authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submittedSolution: textInputValue,
          }),
        }
      );
      getSubmissions();
      const json = await response.json();
      console.log(json);
    };

    return (
      <div className="inout_fields">
        <div className="input_fields">
          <select onChange={setLanguage} title="languageSelector">
            {Object.keys(langs).map((key) => (
              <option value={key} defaultValue={selectedLanguage === key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="start coding..."
          id="box"
          value={textInputValue}
          onChange={setBoilerplate}
          cols="40"
          rows="12"
        ></textarea>
        <button id="submit" onClick={submitProblem}>
          Submit
        </button>
      </div>
    );
  }

  return (
    <main id="singleProblemMain">
      <div className="left">
        <div className="buttons">
          <button
            onClick={performToggle}
            className="active"
            id="descriptionButton"
          >
            Description
          </button>
          <button onClick={performToggle} id="submissionsButton">
            Submissions
          </button>
        </div>

        {toggler === "problem" ? (
          <ProblemDescription problem={problem} />
        ) : (
          <Submissions loggedIn={loggedIn} problemId={problem.problemId} />
        )}
      </div>

      <div className="right">
        <LanguageSelector problemId={params.problem_slug} />
      </div>
    </main>
  );
};

export default Problem;
