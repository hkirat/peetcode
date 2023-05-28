import React from "react";

const ProblemDescription = ({problem}) => {
  return (
    <>
      <h1 className="text-xl font-bold">{problem.title}</h1>
      <p className="text-sm py-2">{problem.description}</p>
      <h1 className="font-semibold py-2">Examples</h1>
      {problem.testCases.map((testcase, index) => (
        <div key={index} className="p-4 my-2 bg-slate-100 rounded-md text-sm">
          <span className="font-bold py-2">Input : </span>
          <span>{testcase.input}</span>
          <br />
          <span className="font-bold py-2">Output : </span>
          <span>{testcase.output}</span>
        </div>
      ))}
    </>
  );
};

export default ProblemDescription;
