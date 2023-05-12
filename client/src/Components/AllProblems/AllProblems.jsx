import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

import "./AllProblems.css"
import { backendUrl } from "../../constants.js";

const AllProblemsPage = () => {
  const [problems, setProblems] = useState([]);

  const init = async () => {
    const response = await fetch(`${backendUrl}/problems`, {
      method: "GET",
    });

    const json = await response.json();
    setProblems(json.problems);
  }

  useEffect(() => {
    init()
  }, []);

  return (
    <div id="allproblems" className='py-9 md:px-8 pl-4'>
      <table>
        <tbody>

          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
          </tr>

          {problems.map((prob,index) => (
            <tr className='hover:bg-stone-100 hover:drop-shadow-md'>
              <Link to={`/problems/:${prob.problemId}`}>
                <td>{prob.title}</td>
              </Link>
              <td className={`${prob.difficulty}`} >{prob.difficulty}</td>
              <td className={`${prob.difficulty}`} >{prob.acceptance}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  )
}

export default AllProblemsPage