import React, { useState } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { SiLeetcode } from "react-icons/si";
import { post, setTokenCookie } from "../lib/utils";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const confirmPasswordChange = (e) => {
    setConfirmPassowrd(e.target.value);
  };

  const onSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const response = await post("/signup", { email, password });
    const responseJson = await response.json();
    if (responseJson.success) {
      setTokenCookie(responseJson.data.token, 1);
    }
    alert(responseJson.message);
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <form className="p-8 rounded-xl w-[30rem] bg-white flex flex-col gap-6">
        <div className="text-slate-800 flex flex-col justify-center items-center gap-1">
          <SiLeetcode className="text-5xl" />
          <h1 className="font-mono text-2xl">Neetcode</h1>
        </div>
        <TextInput onChange={emailChange} placeholder={"Email"} type="email" />
        <TextInput
          onChange={passwordChange}
          placeholder={"Password"}
          type="password"
        />
        <TextInput
          onChange={confirmPasswordChange}
          placeholder={"Confirm Password"}
          type="password"
        />
        <Button text={"Sign Up"} onClick={onSignup} />
        <div className="flex justify-center text-sm gap-2">
          <p className="text-slate-500">Already have an account?</p>
          <Link className="text-slate-800 font-bold" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
