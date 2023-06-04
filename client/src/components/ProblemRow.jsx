import React from "react";
import Tag from "./Tag";

const ProblemRow = ({ problem }) => {
  const onProblemClick = (problemId) => () => {
    window.location.href = `/problems/${problemId}`;
  };

  return (
    <tr
      onClick={onProblemClick(problem.id)}
      className="hover:bg-slate-100 text-slate-600 text-sm cursor-pointer grid grid-cols-4 px-6 py-4 text-center odd:bg-white even:bg-slate-50"
    >
      <td className="col-span-2 text-start">
        {`${problem.id}. ${problem.title}`}
      </td>
      <td>
        <Tag difficulty={problem.difficulty} />
      </td>
      <td>{problem.acceptance}</td>
    </tr>
  );
};

export default ProblemRow;
