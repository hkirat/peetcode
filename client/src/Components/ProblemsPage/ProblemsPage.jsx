import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

import "./ProblemsPage.css"
import {backendUrl} from "../../constants.js";
import Loader from "../../Constants/Loader/Loader.jsx";


const ProblemsPage = () => {
    const [CodeSeg, setCodeSeg] = useState("");
    const {pid} = useParams();
    const cleanId = pid.substring(1);
    const [problem, setProblem] = useState(null);
    const [submission, setSubmission] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [submissions, setSubmissions] = useState([]);
    const [isSubmissionsLoaded, setIsSubmissionsLoaded] = useState(false)

    const init = async () => {
        const response = await fetch(`${backendUrl}/problem/` + cleanId, {
            method: "GET",
        });

        const json = await response.json();
        setProblem(json.problem);
    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        fetchProblemSubmissions()
    }, [activeTab])

    const fetchProblemSubmissions = async () => {
        const response = await fetch(`${backendUrl}/submissions/${cleanId}`, {
            method: "GET",
            headers: {
                "authorization": localStorage.getItem("token")
            }
        });

        await response.json()
            .then(json => {
                const submissions = json.submissions
                submissions.forEach(s => {
                    if (s.status === "AC") {
                        s.status = "Accepted"
                    } else if (s.status === "WA") {
                        s.status = "Wrong Answer"
                    }
                })

                setSubmissions(submissions)
                setIsSubmissionsLoaded(true)
            })
            .catch(error => {
                return error;
            });

    }

    const handleKey = (event) => {
        if (event.key == "Tab") {
            event.preventDefault();
            const {selectionStart, selectionEnd, value} = event.target;
            const val = value.substring(0, selectionStart) + "\t" + value.substring(selectionStart);
            event.target.value = val;
            event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
        }
        setCodeSeg(event.value);
    }

    function renderDescription() {
        if (activeTab !== "description") {
            setActiveTab("description")
            setIsSubmissionsLoaded(false)
        }
        return (
            <div className="description">
                <div className="flex-row">
                    <h5 className="tab active nav-options">Description</h5>
                    <h5 className="tab inactive nav-options" onClick={() => renderSubmissions()}>Submissions</h5>
                </div>
                <p>{problem.description}</p>
                <code>Input : {problem.exampleIn}</code>
                <code>Output : {problem.exampleOut}</code>
            </div>
        )
    }

    function renderSubmissions() {
        if (activeTab !== "submission") {
            setActiveTab("submission")
        }
        return (
            <div className="submissions">
                <div className="flex-row">
                    <h5 className="tab inactive nav-options" onClick={() => renderDescription()}>Description</h5>
                    <h5 className="tab active nav-options">Submissions</h5>
                </div>
                {
                    isSubmissionsLoaded ?
                        <table>
                            <tbody>
                            {
                                submissions.map((s, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td className={`submission ${s.status.toLowerCase()}`}>{s.status}</td>
                                            <td>{s.submission}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                    : <Loader/>
                }


            </div>
        );
    }

    return (
        <div>

            {
                problem ? (
                        <div id="problempage" className='flex-row'>
                            <div className="ques">
                                <h1>{problem.title}</h1>
                                {activeTab === "description" ? renderDescription() : renderSubmissions()}
                            </div>
                            <div className="code">
                                <h1>Code Here</h1>
                                <div className='code-form'>
                                    <textarea onChange={(e) => setSubmission(e.target.value)} name="SolvedCode"
                                              onKeyDown={(event) => handleKey(event)}></textarea>
                                    <button type="submit" id="submit" onClick={async () => {
                                        const response = await fetch(`${backendUrl}/submission`, {
                                            method: "POST",
                                            headers: {
                                                "authorization": localStorage.getItem("token")
                                            },
                                            body: JSON.stringify({
                                                problemId: cleanId,
                                                submission: submission
                                            })
                                        });

                                        const json = await response.json();
                                        console.log(json);

                                    }}>SubmitCode
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) :
                    (<div>The searched Question Doesn't exist</div>)
            }

        </div>

    )
}

export default ProblemsPage