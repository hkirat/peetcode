import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
	const [onLoggedIn, setOnLoggedIn] = useState("");
	const [onNewUser, setOnNewUser] = useState("");
	useEffect(() => {
		const token = localStorage.getItem("token");
		setOnLoggedIn(token ? "nav-options" : "nav-options hidden");
		setOnNewUser(token ? "nav-options hidden" : "nav-options");
	}, []);

	return (
		<div id="navbar-main" className="flex-row">
			<Link to={"/"}>
				<div className="logo-box flex-row">
					<img
						className="logo"
						src="https://user-images.githubusercontent.com/63964149/152531278-5e01909d-0c2e-412a-8acc-4a06863c244d.png"
						alt="logo"
					/>
					<p>PeetCode</p>
				</div>
			</Link>
			<div className={onLoggedIn}>
				<Link to={"/problemset/all/"}>Problems</Link>
			</div>
			<div className={onNewUser}>
				<Link to={"/signup"}>Signup</Link>
			</div>
			<div className={onNewUser}>
				<Link to={"/login"}>Login</Link>
			</div>
			<div className={onLoggedIn}>
				<button
					onClick={() => {
						localStorage.clear();
						window.location.href = "/";
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Navbar;
