import React from "react";
import { SiLeetcode } from "react-icons/si";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="py-4 px-8 bg-white shadow-sm">
      <ul className="flex justify-between">
        <div>
          <Link to="/">
            <span className="flex items-center gap-1 font-mono">
              <SiLeetcode className="text-xl" /> Neetcode
            </span>
          </Link>
        </div>
        <div className='gap-8 flex'>
          <Link to="/problems">Problems</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
