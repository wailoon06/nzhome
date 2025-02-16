import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function NewDeviceDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [temperature, setTemperature] = useState(""); // Initialize temperature state

  const toggleSwitch = () => {
    setIsSwitchOn((prevState) => !prevState);
  };

  const { name, type } = useParams();

  // Handle temperature change (for the dropdown)
  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (e.g., sending data to DB)
    console.log("Form submitted with data:", {
      temperature,
      isSwitchOn,
    });

    navigate(`/devices/new/${name}/test`);
  };

  // Handle the check validity button click
  const handleCheckValidity = (e) => {
    e.preventDefault();
    // Your custom validity check logic here
    console.log("Check validity action triggered");
    // No navigation occurs here
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
                  <a className="relative pl-4" href="/devices/new">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {name}
                  </h1>
                </div>

                {/* ==================== */}
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-rows-[auto,1fr] p-4 mt-2 gap-4 rounded-lg bg-white"
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-between">
                    {/* Label */}
                    <span className="text-lg font-medium text-gray-700">
                      Enter Device Unique Serial Code
                    </span>

                    {/* Input */}
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Serial Code"
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-between">
                    {/* Label */}
                    <span className="text-lg font-medium text-gray-700">
                      Select which space to add to
                    </span>

                    {/* Dropdown */}
                    <select
                      className="ml-5 border border-gray-300 rounded-lg p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={temperature}
                      onChange={handleTemperatureChange}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {[
                        "Living Room",
                        "Kitchen",
                        "Bedroom",
                        "Bathroom",
                        "Garage",
                      ].map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-center items-center h-full w-full">
                    <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 w-[40%] flex items-center justify-between">
                      {/* Label */}
                      <button
                        onClick={handleCheckValidity}
                        className="text-lg font-medium text-gray-700"
                      >
                        Check Validity
                      </button>

                      {/* Switch */}
                      <div className="text-green-700 w-full h-full flex items-center justify-center">
                        Valid
                      </div>
                    </div>
                  </div>

                  <div className="p-4 gap-4 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-black text-sm sm:text-base w-full mb-2 text-center sm:w-[15%] md:w-[15%] h-[3rem] flex justify-center items-center"
                    >
                      <div className="text-1xl text-white">Done</div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDeviceDetailsPage;
