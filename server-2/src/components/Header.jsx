import React from "react";

const Header = () => {
  return (
    <nav className="w-full bg-gray-900">
      <div className="container ">
        <div className="flex py-2 items-center gap-2">
          <img
            src="https://fusionaivideo.io/assets/logo-CGPrzN3y.png"
            className="h-10"
          />
          <a href="https://fusionaivideo.io" className="text-white p-1 text-2xl font-semibold"> Fusion AI Video</a >
        </div>
      </div>
    </nav>
  );
};

export default Header;
