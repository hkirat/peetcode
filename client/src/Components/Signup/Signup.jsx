import React, { useState } from "react";

import "./Signup.css";
import { backendUrl } from "../../constants.js";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [UserMsg, setUserMsg] = useState("") ;

  return (
    <div id='signup' className='flex-col'>
      <h1>Signup</h1>
      <p>{UserMsg}</p>
      <div className='signup-form'>
        <div className='subform'>
          <label htmlFor='email'>Email: </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type='text'
            name='email'
            placeholder='Your Email'
          />
        </div>

        <div className='subform'>
          <label htmlFor='password'>Password: </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            name='password'
            placeholder='Your Password'
          />
        </div>

        <button
          type='submit'
          id='test'
          onClick={async (e) => {
            // change backendUrl to localhost:3000 for development
            const response = await fetch(`${backendUrl}/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            });

            const json = await response.json();
            setUserMsg(json.msg) ;
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
