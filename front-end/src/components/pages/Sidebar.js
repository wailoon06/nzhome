import React from "react";
import { Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import NZHome2 from "../../image/NZHome2.png";

function Sidebar({ isCollapsed, toggleSidebar, language }) {
  const translations = translationsMap[language] || translationsMap["en"];


  return (
      <div>
      {/* Sidebar */}
      <div
        className={`sidebar ${isCollapsed ? "w-[0px]" : "w-[100px]"} ${
          isCollapsed ? "" : "baseGreen"
        } rounded-lg min-h-full flex flex-col overflow-y-auto`}
      >
        {/* Sidebar Logo */}
        <div className="h-[100px] flex items-center justify-center pt-10">
          <a href="/">
            <img
              src={NZHome2}
              alt="NZ Home Logo"
              className={`${isCollapsed ? "hidden" : "block"}`}
            />
          </a>
        </div>

        {/* Sidebar Items */}
        <Link to="/devices">
          <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
            <i
              className={`fas fa-layer-group text-white text-2xl ${
                isCollapsed ? "hidden" : "block"
              }`}
            ></i>
            {!isCollapsed && (
              <span className="text-white text-center text-sm mt-2">
                {translations.devices}
              </span>
            )}
          </div>
        </Link>

        <Link to="/electric">
          <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
            <i
              className={`fas fa-bolt text-white text-2xl ${
                isCollapsed ? "hidden" : "block"
              }`}
            ></i>
            {!isCollapsed && (
              <span className="text-white text-center text-sm mt-2">
                {translations.electricalUsage}
              </span>
            )}
          </div>
        </Link>
        <Link to="/internet">
              <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                <i
                  className={`fas fa-chart-pie text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    {translations.internetUsage}
                  </span>
                )}
              </div>
            </Link>
            <Link to="/calendar">
              <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                <i
                  className={`fas fa-wind text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    {translations.calendar}
                  </span>
                )}
              </div>
            </Link>
      </div>

      {/* Collapse Button */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
          isCollapsed ? "left-[0px]" : "left-[80px]"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className={`text-white text-2xl baseGreen p-2 rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
            isCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <i
            className={`fas ${
              isCollapsed ? "fa-chevron-left" : "fa-chevron-left"
            }`}
          ></i>
        </button>
      </div>
      </div>
  );
}

export default Sidebar;
