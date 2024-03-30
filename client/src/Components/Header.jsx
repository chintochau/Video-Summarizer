import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GeneralButton from "./GeneralButton";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import BoltIcon from "@mui/icons-material/Bolt";

const Header = () => {
  const { currentUser, credits } = useAuth();
  const location = useLocation()
  const pathname = location.pathname.substring(1)
  // when user logged in
  const LoggedInMenu = () => {

    const menuItems = ["history", "profile"]

    

    return (
      <div className="flex mr-2">
        {menuItems.map((menuItem) => {
          return (
            <Link key={menuItem} to={`/${menuItem}`} className={`mr-1 capitalize hover:text-indigo-400 pr-4 ${pathname === menuItem ? " text-indigo-600 font-semibold" : ""}`}>
              {menuItem}
            </Link>)
        })}
        <Link to="/pricing" className="text-indigo-600 flex rounded-lg outline-1 outline hover:text-indigo-400 cursor-pointer pr-2 mr-2">
          <BoltIcon />
          <div className=""> {credits}</div>
        </Link>
      </div>)

  }


  const LoggedOutMenu = () => {
    return (
      <Link
        to={"/login"}
        className="mr-3 text-blue-600 hover:text-blue-400"
      >
        Login
      </Link>
    )
  }


  return (
    <div className=" bg-white w-full flex justify-center sticky top-0 z-20">
      <div className="w-[1280px] flex justify-between items-center bg-white sm:px-8 px-4 border-b border-b-[#e6ebf4] ">
        <div className="flex align-middle content-center items-center">
          <Link to="/">
            <img className="h-12" src={logo} />
          </Link>
        </div>

        <div className="flex items-center py-1">
          {/*user logged in or not*/}
          {currentUser ? (<LoggedInMenu />) : (<LoggedOutMenu />)}

          <Link to="/summarizer">
            <GeneralButton>Summarize</GeneralButton>
          </Link>
        </div>
      </div>
    </div >
  );
};

export default Header;
