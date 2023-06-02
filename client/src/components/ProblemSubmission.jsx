import React from "react";
import { getStatusColor } from '../lib/utils';

const ProblemSubmission = ({ submissions, setCode, setSelectedSubmission }) => {
  const onClick = (submission) => () => {
    setCode(submission.code);
    setSelectedSubmission(submission);
  };

  return (
    <>
      {submissions.map((submission, index) => (
        <div
          key={index}
          onClick={onClick(submission)}
          className="p-4 odd:bg-white even:bg-slate-50 hover:bg-slate-100 cursor-pointer flex gap-16 items-center"
        >
          <div>
            <h1
              className={`font-bold text-sm ${getStatusColor(
                submission.status
              )}`}
            >
              {submission.status}
            </h1>
            <div className="text-xs">
              {new Date(submission.submittedAt).toLocaleString("en-us", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="py-1 px-3 bg-slate-600 rounded-full text-sm text-white">
            {submission.language}
          </div>
        </div>
      ))}
    </>
  );
};

export default ProblemSubmission;
