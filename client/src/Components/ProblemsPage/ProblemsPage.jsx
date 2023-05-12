import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ProblemsPage.css";
import { backendUrl } from "../../constants.js";
import axios from "axios";

const ProblemsPage = () => {
	const [CodeSeg, setCodeSeg] = useState("");
	const { pid } = useParams();
	const cleanId = pid.substring(1);
	const [problem, setProblem] = useState(null);
	const [allSubmission, setAllSubmission] = useState(null);
	const [submission, setSubmission] = useState("");

	const init = async () => {
		const response = await fetch(`${backendUrl}/problem/` + cleanId, {
			method: "GET",
		});

		const json = await response.json();
		setProblem(json.problem);

		getAllSubmissions();
	};

	const getAllSubmissions = async () => {
		const allSubmissionResponse = await fetch(
			`${backendUrl}/submissions/` + cleanId,
			{
				headers: { authorization: localStorage.getItem("token") },
				method: "GET",
			}
		);
		const allSubmissionJson = await allSubmissionResponse.json();
		setAllSubmission(allSubmissionJson.submissions);
	};
	useEffect(() => {
		init();
	}, []);
	// console.log(cleanId) ;

	const handleKey = (event) => {
		if (event.key == "Tab") {
			event.preventDefault();
			const { selectionStart, selectionEnd, value } = event.target;
			const val =
				value.substring(0, selectionStart) +
				"\t" +
				value.substring(selectionStart);
			event.target.value = val;
			event.target.selectionStart = event.target.selectionEnd =
				selectionStart + 1;
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
						<div className="submissions">
							<table>
								<tbody>
									<tr>
										<th>Submissions</th>
										<th>Status</th>
									</tr>

									{allSubmission.map((prob, index) => (
										<tr>
											<td>{prob.submission}</td>
											<td className={prob.status}>
												{prob.status}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="code">
						<h1>Code Here</h1>
						<div className="code-form">
							<textarea
								onChange={(e) => setSubmission(e.target.value)}
								name="SolvedCode"
								onKeyDown={(event) => handleKey(event)}
							></textarea>
							<button
								type="submit"
								id="submit"
								onClick={async () => {
									axios
										.post(
											`${backendUrl}/submission`,
											{
												problemId: cleanId,
												submission: submission,
											},
											{
												headers: {
													authorization:
														localStorage.getItem(
															"token"
														),
												},
											}
										)
										.then(function (response) {
											console.log(response);
											getAllSubmissions();
										})
										.catch(function (error) {
											console.log(error);
										});
								}}
							>
								SubmitCode
							</button>
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
