import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

import "./ProblemsPage.css"
import {backendUrl} from "../../constants.js";


const ProblemsPage = () => {
  const [CodeSeg, setCodeSeg] = useState("") ;
  const { pid } = useParams() ;
  const cleanId = pid.substring(1) ;
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [submissions,setSubmissions]= useState([]);

  const handlesubmissions = async ()=>{
    const response = await fetch(`${backendUrl}/submissions/`+cleanId,{
      method:"GET",
      headers: {
        "authorization": localStorage.getItem("token"),
      },
    })
    const json = await response.json();
    // let ans = [];
    const ans = json.submissions.filter((x)=> {
      console.log(x.status)
    })
    setSubmissions(json.submissions);
  }
    const init = async () => {
      const response = await fetch(`${backendUrl}/problem/` + cleanId, {
        method: "GET",
      });

      const json = await response.json();
      setProblem(json.problem);

    }

  useEffect(() => {
    init();
    handlesubmissions();
  }, [])
  // console.log(cleanId) ;


  const handleKey = (event) => {
    if (event.key == "Tab"){
      event.preventDefault() ;
      const { selectionStart , selectionEnd , value } = event.target ;
      const val = value.substring(0,selectionStart) + "\t" + value.substring(selectionStart) ;
      event.target.value = val;
      event.target.selectionStart = event.target.selectionEnd = selectionStart+1;
    }
    setCodeSeg(event.value) ;
  }

  return (
      <>
    <div>
      {
        problem? (
          <div id="problempage" className='flex-row'>
            <div className="ques">
              <h1>{problem.title}</h1>
              <h5>Description</h5>
              <p>{problem.description}</p>
              <code>Input : {problem.exampleIn}</code>
              <code>Output : {problem.exampleOut}</code>
              <div id="submissions">
                <h3>Submissions</h3>
                <div id="sub-content">
                  {
                    submissions.map((x,index)=>{
                      return(
                          <div id="internal" key ={index} >
                          <div >Submission: {index}</div>

                          <div className={x.status} >Status: {x.status}</div></div>
                    )
                    })
                  }
                </div>
              </div>
            </div>
            <div className="code">
              <h1>Code Here</h1>
              <div className='code-form'>
                <textarea onChange={(e) => setSubmission(e.target.value)} name="SolvedCode" onKeyDown={ (event) => handleKey(event) }></textarea>
                <button type="submit" id="submit" onClick={async () => {
                  const response = await fetch(`${backendUrl}/submission`, {
                    method: "POST",
                    headers: {
                      "authorization": localStorage.getItem("token"),
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                      problemId: cleanId,
                      submission: submission
                    })
                  });

                  const json = await response.json();
                  console.log(json);
                  handlesubmissions();
                }}>SubmitCode</button>
              </div>
            </div>
          </div>
        ) :
        (<div>The searched Question Doesn't exist</div>)
      }

    </div>
      </>
  )
}

export default ProblemsPage