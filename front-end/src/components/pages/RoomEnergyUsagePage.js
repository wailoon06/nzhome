import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function RoomEnergyUsagePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { roomTitle } = useParams();

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
                  src="\image\NZHome.png"
                  alt="NZ Home Logo"
                  className={`${isCollapsed ? "hidden" : "block"}`}
                />
              </a>
            </div>
            {/* Sidebar Items */}
            <a href="/">
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
            <a href="#">
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
                <a href="#" className="mr-8">
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
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/rooms">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {roomTitle}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="grid grid-rows-[auto,1fr] mt-2 gap-4 rounded-lg bg-white">
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="text-2xl w-full mb-2 rounded-full text-white inline-block bg-red-500">
                              Offline
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        <img
                          alt="eg"
                          src="https://www.excel-easy.com/examples/images/line-chart/line-chart.png"
                        ></img>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-2 p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">Today </div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>{" "}
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">Today </div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">Today </div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <Link
                    key={roomTitle}
                    to={`/rooms/summary/${roomTitle}/setAction`}
                  >
                    <div className="p-4 gap-4 flex justify-center items-center">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-black items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                        <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="text-2xl text-white">Set Action </div>
                        </div>
                      </div>
                    </div>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomEnergyUsagePage;
