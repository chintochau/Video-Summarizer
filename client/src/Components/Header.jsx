import React from "react";
import { Link } from "react-router-dom";
import GeneralButton from "./GeneralButton";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <div className=" bg-white w-full flex justify-center sticky top-0 z-50">
      <div className="w-[1280px] flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] ">
        <div className="flex align-middle content-center items-center">
          <Link to="/">
            <img className=" w-11 h-11" src={logo} />
          </Link>
          <Link to="/" className=" text-blue-800 text-2xl">
            Fusion AI Video Assistant
          </Link>
        </div>
        <Link to="/summarizer">
          <GeneralButton>Summarize</GeneralButton>
        </Link>
      </div>
    </div>
  );
};

export default Header;
