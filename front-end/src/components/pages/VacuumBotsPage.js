import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VacuumBotsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { name } = useParams();

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
          {/* Sidebar */}
          <div
            className={`sidebar ${isCollapsed ? "w-[0px]" : "w-[100px]"} ${
              isCollapsed ? "" : "baseGreen"
            } rounded-lg min-h-full flex flex-col overflow-y-auto`}
          >
            {/* Sidebar Logo */}
            <div className="h-[100px] flex items-center justify-center">
              <a href="/">
                <img
                  src="./image/NZHome.png"
                  alt="NZ Home Logo"
                  className={`${isCollapsed ? "hidden" : "block"}`}
                />
              </a>
            </div>
            {/* Sidebar Items */}
            <a href="/devices">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-layer-group text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Devices
                  </span>
                )}
              </div>
            </a>{" "}
            <a href="/electric">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-bolt text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Electrical Usage
                  </span>
                )}
              </div>
            </a>
            <a href="/internet">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-chart-pie text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Internet Usage
                  </span>
                )}
              </div>
            </a>
            <a href="/calendar">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-wind text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Calendar
                  </span>
                )}
              </div>
            </a>
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

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <div className="flex justify-between items-center relative">
              <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
                {/* Hamburger Button */}
                <div
                  className={`flex items-center ${
                    isCollapsed ? "block" : "hidden"
                  }`}
                >
                  <button
                    onClick={toggleSidebar}
                    className="text-white text-2xl bg-transparent border-0 mr-4"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>

                {/* Centered Text */}
                <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
                  NZ HOME
                </h1>

                {/* User Icon */}
                <a href="/profile" className="mr-8">
                  <i className="fas fa-user text-white text-3xl"></i>
                </a>

                {/* Bell Icon */}
                <a href="/notification" className="ml-auto">
                  <i className="fas fa-bell text-white text-3xl"></i>
                </a>
              </div>
            </div>

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              {/* Main Content */}
              <div
                className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
              >
                <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
                  {/* Main Content */}
                  <div className="flex flex-col flex-1">
                    {/* Setting Section */}
                    <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                      <a className="relative pl-4" href="/profile">
                        <i className="fa fa-2x fa-arrow-left"></i>
                      </a>
                      <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                        {name} Vacuum Bot
                      </h1>
                      <a href="/">
                        <i class="fas fa-plus text-2xl"></i>
                      </a>
                    </div>

                    {/* Main Content Section */}
                    <div className="grid grid-rows-2 md:grid-cols-1 lg:grid-cols-2 flex flex-col items-center justify-center">
                      <div className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]">
                        <img
                          src="https://raw.githubusercontent.com/Tasshack/dreame-vacuum/master/docs/media/map_mijia_light.png"
                          alt="eg"
                          className="w-[70%] md:w-[60%]"
                        ></img>
                      </div>
                      <div className="grid grid-rows-2">
                        <div className="grid grid-cols-1">
                          <div className="font-bold rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]">
                            Operation Time
                          </div>{" "}
                          <div className="rounded-lg border-[2px] border-gray-300 bg-white p-4 mt-4 flex items-center justify-center text-center w-[96%]">
                            <div className="grid grid-cols-[.4fr,1fr] sm:grid-cols-[.5fr,1fr] items-center gap-4">
                              <i className="fas fa-clock text-[3rem]" />
                              <div className="teal-text text-sm sm:text-base w-full mb-2 text-center mt-2">
                                <div className="text-[1.4rem] w-full mb-2">
                                  1 Hour 2 Minutes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-green-500 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            Resume
                          </button>{" "}
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-red-500 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            Stop
                          </button>
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            Go Home
                          </button>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VacuumBotsPage;
