import React from "react";

import "./Login.css";
import { useState } from "react";
import { backendUrl } from "../../constants.js";
import axios from "axios";
const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div id="login" className="flex-col">
			<h1>Login</h1>
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
						type="text"
						name="password"
						placeholder="Your Password"
					/>
				</div>

				<button
					type="submit"
					id="test"
					onClick={async (e) => {
						axios
							.post(`${backendUrl}/login`, {
								email: email,
								password: password,
							})
							.then(function (response) {
								localStorage.setItem(
									"token",
									response.data.token
								);
							})
							.catch(function (error) {
								console.log(error);
							});
					}}
				>
					Login
				</button>
			</div>
		</div>
	);
};

export default Login;
