import React, { useState } from "react";

import "./Signup.css";
import { backendUrl } from "../../constants.js";
import axios from "axios";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div id="signup" className="flex-col">
			<h1>Signup</h1>
			<div className="signup-form">
				<div className="subform">
					<label htmlFor="email">Email: </label>
					<input
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						type="text"
						name="email"
						placeholder="Your Email"
					/>
				</div>

				<div className="subform">
					<label htmlFor="password">Password: </label>
					<input
						onChange={(e) => setPassword(e.target.value)}
            type='password'
						name="password"
						placeholder="Your Password"
					/>
				</div>

				<button
					type="submit"
					id="test"
					onClick={async (e) => {
						axios
							.post(`${backendUrl}/signup`, {
								email: email,
								password: password,
							})
							.then(function (response) {
								console.log(response);
							})
							.catch(function (error) {
								console.log(error);
							});
					}}
				>
					SIGNUP
				</button>
			</div>
		</div>
	);
};

export default Signup;

// neetcode1@gmail.com
