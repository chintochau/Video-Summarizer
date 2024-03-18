import React from "react";
import { Link } from "react-router-dom";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {

  const { currentUser } = useAuth()

  return (
    <div className=" bg-white w-full flex justify-center sticky top-0 z-50">
      <div className="w-[1280px] flex justify-between items-center bg-white sm:px-8 px-4 py-2 border-b border-b-[#e6ebf4] ">
        <div className="flex align-middle content-center items-center">
          <Link to="/">
            <img className=" w-8 h-8" src={logo} />
          </Link>
          <Link to="/" className=" text-blue-800 text-2xl">
            FusionAI Video Notes
          </Link>
        </div>

        <div className="flex items-center">

          {/*user logged in or not*/}
          {currentUser ?
            <Link to="/profile" className="mr-1">
              {currentUser.email}
            </Link> :
            <Link to={"/login"} className="mr-3 text-blue-600 hover:text-blue-400">
              Login
            </Link>}


          <Link to="/summarizer">
            <GeneralButton>Summarize</GeneralButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
