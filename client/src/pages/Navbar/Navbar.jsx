import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [login, setLogin] = useState(false);
  const init = async () => {
    const response = await fetch("http://localhost:3000/me", {
      method: "GET",
      headers: {
        "authorization": localStorage.getItem('token'),
      },
    });

    const json = await response.json();
    const msg = json.msg;

    if (msg === "logged in") setLogin(true);
    else console.log(msg);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="container">
      <div className="logo">
        <h4>LeetCode</h4>
      </div>
      <div className="nav-items">
        <ul>
          <Link to={"/problemset/all"} className="link">
            <li>problems </li>
          </Link>
          {login ? <Logout /> : <Logger />}
          {/* <Logger /> */}
          {/* <Link to="/problemset/1"><li >signup </li></a> */}
        </ul>
      </div>
    </div>
  );
};

const Logout = () => {
  return (
    <>
      <Link className="link" onClick={() => {
        localStorage.clear();
        init()
      }}>
        <li>Logout </li>
      </Link>
    </>
  );
};

const Logger = () => {
  return (
    <>
      <Link to={"/login"} className="link">
        <li>login </li>
      </Link>
      <Link to={"/signup"} className="link">
        <li>signup </li>
      </Link>
    </>
  );
};

export default Navbar;
