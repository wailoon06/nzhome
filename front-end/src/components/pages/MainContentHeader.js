import React from "react";
import { Link } from "react-router-dom";

const MainContentHeader = ({ isCollapsed, toggleSidebar, translations }) => {
  return (
    <div className="sticky top-0 z-[9999]">
      <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
        {/* Hamburger Button */}
        <div className={`flex items-center ${isCollapsed ? "block" : "hidden"}`}>
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl bg-transparent border-0 mr-4"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* Centered Text */}
        <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
          {translations.title}
        </h1>

        {/* User Icon */}
        <Link to="/profile" className="mr-8">
          <i className="fas fa-user text-white text-3xl"></i>
        </Link>

        {/* Bell Icon */}
        <Link to="/notification" className="ml-auto">
          <i className="fas fa-bell text-white text-3xl"></i>
        </Link>
      </div>
    </div>
  );
};

export default MainContentHeader;
