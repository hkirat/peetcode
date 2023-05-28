import React, { useState } from "react";
import "../Login/login.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");

  const handleSubmit = async (e) => {
    const response = await fetch('http://localhost:3000/signup', {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: pass,
        conf_pass: cpass,
      }),
      headers: {"Content-Type": "application/json"}
    });

    const json = await response.json();
    console.log(json);
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
        <input
          value={cpass}
          onChange={(e) => setCPass(e.target.value)}
          type="password"
          placeholder="Retype Password"
          id="password"
          name="cpassword"
        />
        <button type="submit" value="Signup" onClick={handleSubmit} >Signup </button>
      </div>
    </div>
  );
}

export default Signup;
