import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { ReactComponent as Loader } from "../../assets/loader.svg";

import "./ProblemsPage.css";
import { backendUrl } from "../../constants.js";

const ProblemsPage = () => {
  const [CodeSeg, setCodeSeg] = useState("");
  const { pid } = useParams();
  const cleanId = pid.substring(1);
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [error, setError] = useState("");
  const [isPassed, setIsPassed] = useState(null);
  const [syntaxError, setSyntaxError] = useState(null);
  const [disableSubmit, setdisableSubmit] = useState(false);

  const init = async () => {
    const response = await fetch(`${backendUrl}/problem/` + cleanId, {
      method: "GET",
    });

    const json = await response.json();
    setProblem(json.problem);
  };

  useEffect(() => {
    init();
  }, []);
  // console.log(cleanId) ;

  const handleKey = (event) => {
    if (event.key == "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = event.target;
      const val = value.substring(0, selectionStart) + "\t" + value.substring(selectionStart);
      event.target.value = val;
      event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
    }
    setCodeSeg(event.value);
  };

  return (
    <div>
      {problem ? (
        <div id="problempage" className="flex-row">
          <div className="ques">
            <h1>{problem.title}</h1>
            <h5>Description</h5>
            <p>{problem.description}</p>
            <code>Input : {problem.exampleIn}</code>
            <code>Output : {problem.exampleOut}</code>
            {isPassed != null && (
              <div className="status" style={{ backgroundColor: isPassed ? "green" : "red" }}>
                {syntaxError && <p>Error in exeuting the program: {syntaxError}</p>}
                {isPassed && <p>Test cases run successfully!</p>}
                {!isPassed && !syntaxError && isPassed != null && <p>Test cases have failed!</p>}
                {error}
              </div>
            )}
          </div>
          <div className="code">
            <h1>Code Here</h1>
            <div className="code-form">
              <textarea
                onChange={(e) => setSubmission(e.target.value)}
                name="SolvedCode"
                onKeyDown={(event) => handleKey(event)}
              ></textarea>
              {!disableSubmit && (
                <button
                  type="submit"
                  id="submit"
                  onClick={async () => {
                    setIsPassed(null);
                    setError(null);
                    setSyntaxError(null);
                    setdisableSubmit(true);
                    const response = await fetch(`${backendUrl}/submission`, {
                      method: "POST",
                      headers: {
                        authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        problemId: cleanId,
                        submission: submission,
                      }),
                    });

                    const json = await response.json();
                    console.log(json);
                    setdisableSubmit(false);
                    if (json.status === "AC") {
                      setIsPassed(true);
                    } else if (json.error) {
                      setIsPassed(false);
                      setError(json.error);
                      setSyntaxError(true);
                      console.log("Error in executing your code. Please check your code again");
                    } else {
                      setIsPassed(false);
                      console.log("Test cases failed!");
                    }
                  }}
                >
                  SubmitCode
                </button>
              )}

              {disableSubmit && (
                <button>
                  <svg
                    width="13"
                    height="14"
                    viewBox="0 0 13 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.38798 12.616C3.36313 12.2306 2.46328 11.5721 1.78592 10.7118C1.10856 9.85153 0.679515 8.82231 0.545268 7.73564C0.411022 6.64897 0.576691 5.54628 1.02433 4.54704C1.47197 3.54779 2.1845 2.69009 3.08475 2.06684C3.98499 1.4436 5.03862 1.07858 6.13148 1.01133C7.22435 0.944078 8.31478 1.17716 9.28464 1.68533C10.2545 2.19349 11.0668 2.95736 11.6336 3.89419C12.2004 4.83101 12.5 5.90507 12.5 7"
                      stroke="green"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>The searched Question Doesn't exist</div>
      )}
    </div>
  );
};

export default ProblemsPage;
