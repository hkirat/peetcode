import React, { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async (e) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
    });

    const json = await response.json();

    if (json.token != null) {
      localStorage.setItem("token", json.token);
      console.log(json.msg);
      window.location.reload();
    }
    console.log(json.msg)
  };

  return (
    <div className="auth-form-container">
      <h2>LeetCode</h2>
      <div className="login-form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Username or E-mail"
          id="email"
          name="email"
        />
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="Password"
          id="password"
          name="password"
        />
        <button type="submit" value="Log in" onClick={handleLogin}>
          Log In{" "}
        </button>
      </div>
    </div>
  );
}

export default Login;
