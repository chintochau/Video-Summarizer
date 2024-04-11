import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex align-middle content-center items-center">
      <Link to="/">
        <img className=" w-11 h-11" src={logo} />
      </Link>
      <Link to="/" className=" text-blue-800 text-2xl">Fusion AI Video Assistant</Link>
    </div>
  );
};

export default Logo;
