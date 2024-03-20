import React from "react";
import { Link } from "react-router-dom";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import BoltIcon from "@mui/icons-material/Bolt";

const Header = () => {
  const { currentUser, credits } = useAuth();

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
          {currentUser ? (
            <div className="flex mr-2">
              <Link to="/profile" className="mr-1">
                {currentUser.email}
              </Link>
              <div className=" text-indigo-600 flex rounded-lg outline-1 outline pr-2 hover:text-indigo-400 cursor-pointer">
                <BoltIcon />
                <div className=""> {credits}</div>
              </div>
            </div>
          ) : (
            <Link
              to={"/login"}
              className="mr-3 text-blue-600 hover:text-blue-400"
            >
              Login
            </Link>
          )}

          <Link to="/summarizer">
            <GeneralButton>Summarize</GeneralButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
