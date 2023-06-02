import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { get, post } from "../lib/utils";
import ProblemDescription from "../components/ProblemDescription";
import TabButton from "../components/TabButton";
import ProblemSubmission from "../components/ProblemSubmission";

const Problem = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [showDescription, setShowDescription] = useState(true);
  const [submissions, setSubmissions] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getProblems = async () => {
    const response = await get(`/questions/${problemId}`);
    const responseJson = await response.json();
    setProblem(responseJson.data);
  };

  const getSumbissions = async () => {
    const response = await get(`/submissions/${problemId}`);
    const responseJson = await response.json();
    setSubmissions(responseJson.data);
  };

  const init = () => {
    getProblems();
    getSumbissions();
  };

  const onChangeCode = (e) => {
    setCode(e.target.value);
  };

  const onChangeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const onSubmit = async () => {
    const response = await post(`/submissions/${problemId}`, {
      problemId,
      code,
      language,
    });
    const responseJson = await response.json();
    if (response.status === 401) {
      alert("Please login to view submissions");
      setSubmissions([]);
      return;
    }
    alert(responseJson.data.status);
    getSumbissions();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 m-6 flex-grow overflow-y-auto">
      <div className="bg-white rounded-lg pt-2 flex flex-col overflow-y-auto">
        <div className="flex mb-2">
          <TabButton
            text="Description"
            onClick={() => setShowDescription(true)}
            selected={showDescription}
          />
          <TabButton
            text="Submissions"
            onClick={() => setShowDescription(false)}
            selected={!showDescription}
          />
        </div>

        <div className="px-4 pb-4 flex-grow overflow-y-auto">
          {showDescription && problem && (
            <ProblemDescription problem={problem} />
          )}
          {!showDescription && submissions && (
            <ProblemSubmission
              setSelectedSubmission={setSelectedSubmission}
              setCode={setCode}
              submissions={submissions}
            />
          )}
        </div>

        {selectedSubmission && (
          <div className="bg-black text-white p-4 rounded-md max-h-40 overflow-auto">
            <h1 className="font-bold text-xs">OUTPUT : </h1>
            <p style={{ whiteSpace: "pre-wrap" }} className="text-xs">
              {selectedSubmission.output}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-md bg-white col-span-2 p-4 flex flex-col gap-4">
        <h1 className="text-xl">Code Here</h1>
        <textarea
          value={code}
          onChange={onChangeCode}
          className="w-full flex-grow resize-none outline rounded-md outline-slate-400 focus:outline-slate-800 p-4"
          placeholder="Code Here"
        />
        <div className="w-full flex gap-4 flex">
          <select
            onChange={onChangeLanguage}
            className="rounded-md mr-auto outline-slate-400 focus:outline-slate-800 p-2"
          >
            <option value="cpp">C++</option>
            {/* <option value="java">Java</option>
            <option value="python">Python</option> */}
          </select>
          <Button onClick={onSubmit} text="Submit" />
        </div>
      </div>
    </div>
  );
};

export default Problem;
