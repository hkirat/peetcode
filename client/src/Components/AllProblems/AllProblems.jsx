import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import "./AllProblems.css"
import {backendUrl} from "../../constants.js";
import Loader from "../../Constants/Loader/Loader.jsx";

const AllProblemsPage = () => {
    const [problems, setProblems] = useState([]);
    const [problemsFetched, setProblemsFetched] = useState(false)

    const init = async () => {
        const response = await fetch(`${backendUrl}/problems`, {
            method: "GET",
        });

        await response
            .json()
            .then((json) => {
                setProblems(json.problems);
                setProblemsFetched(true)
            })
            .catch((e) => {
                console.log("error", e, response)
            });

    }

    useEffect(() => {
        init()
        console.log("initial load", problems)
    }, []);

    function renderProblemTable() {
        if (problemsFetched) {
            return (
                <tbody>
                <tr>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Acceptance</th>
                </tr>

                {problems.map((prob, index) => (
                    <tr key={index}>
                        <Link to={`/problems/:${prob.problemId}`}>
                            <td>{prob.title}</td>
                        </Link>
                        <td className={`${prob.difficulty}`}>{prob.difficulty}</td>
                        <td className={`${prob.difficulty}`}>{prob.acceptance}</td>
                    </tr>
                ))}

                </tbody>
            )
        }

        return (<Loader/>)
    }

    return (
        <div id="allproblems">
            <table>
                {renderProblemTable()}
            </table>
        </div>
    )
}

export default AllProblemsPage