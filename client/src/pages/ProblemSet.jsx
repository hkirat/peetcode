import React, { useEffect, useState } from "react";
import Tag from "../components/Tag.jsx";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { get } from "../lib/utils.js";
import ProblemRow from "../components/ProblemRow.jsx";

const ProblemSet = () => {
  const [problems, setProblems] = useState([]);

  const init = async () => {
    const response = await get("/questions");
    const responseJson = await response.json();
    setProblems(responseJson.data);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="bg-white m-12 flex-grow rounded-md overflow-y-scroll">
      <table className="w-full flex flex-col">
        <thead className="sticky top-0 bg-white">
          <tr className="grid grid-cols-4 px-6 py-2 border-b">
            <th className="col-span-2 text-start">Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
          </tr>
        </thead>
        <tbody>
          {problems.length === 0 && (
            <tr className="flex items-center justify-center text-slate-500 py-4">
              <td>No Problems Available</td>
            </tr>
          )}
          {problems.map((problem, index) => (
            <ProblemRow key={index} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemSet;
