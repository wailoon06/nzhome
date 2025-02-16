import React, { useState } from "react";
import "./App.css";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(""); // Track animation direction
  const rooms = [
    { img: "room1.jpg", name: "Living Room" },
    { img: "room2.jpg", name: "Kitchen" },
    { img: "room3.jpg", name: "Bathroom" },
    { img: "room4.jpg", name: "Master" },
    { img: "room5.jpg", name: "Guest Room" },
    { img: "room6.jpg", name: "Office" },
    { img: "room7.jpg", name: "Garage" },
    { img: "room8.jpg", name: "Patio" },
    // Add more rooms as needed
  ];

  const prevItems = () => {
    setDirection("prev");
    setCurrentIndex(Math.max(currentIndex - 4, 0)); // Avoid going negative
  };

  const nextItems = () => {
    setDirection("next");
    setCurrentIndex(Math.min(currentIndex + 4, rooms.length - 4)); // Prevent exceeding the length
  };

  // Calculate how many pages of items we have
  const totalPages = Math.ceil(rooms.length / 4);

  // Calculate the current page based on the current index
  const currentPage = Math.floor(currentIndex / 4);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-gray-800 font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        {/* Sidebar */}
        <div
          className={`sidebar ${isCollapsed ? "w-[0px]" : "w-[100px]"} ${
            isCollapsed ? "" : "bg-black"
          } rounded-lg min-h-full flex flex-col transition-all duration-300 overflow-y-auto`}
        >
          {/* Sidebar Logo */}
          <div className="h-[100px] flex items-center justify-center">
            <a href="index.html">
              <img
                src="./image/NZHome.png"
                alt=""
                className={`${isCollapsed ? "hidden" : "block"}`}
              />
            </a>
          </div>

          {/* Sidebar Items */}
          <a href="#">
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
          </a>
          <a href="#">
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

          {/* Collapse Button inside the Sidebar */}
          <div className="flex justify-center px-4 py-4 mt-auto">
            <button
              onClick={toggleSidebar}
              className={`text-white text-2xl bg-transparent border-0 ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              <i
                className={`fas ${
                  isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
                }`}
              ></i>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[6.2rem_1fr] flex-1">
            {/* Main Content Header */}
            <div className="flex justify-between items-center relative">
              <div className="bg-black rounded-lg relative w-[99%] flex items-center">
                <div
                  className={`absolute top-6 left-9 z-10 ${
                    isCollapsed ? "block" : "hidden"
                  }`}
                >
                  <button
                    onClick={toggleSidebar}
                    className="text-white text-2xl bg-transparent border-0"
                  >
                    <i className={`fas fa-bars`}></i>
                  </button>
                </div>
                <h1 className="text-4xl font-bold text-white mx-auto py-4 flex-1">
                  NZ HOME
                </h1>
                <i className="fas fa-bell text-white text-3xl absolute right-9"></i>
              </div>
            </div>

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              <div class="grid grid-cols-2 p-4 gap-4 mb-4">
                {/* <!-- Widgets --> */}
                <div>
                  <div class="bg-blue-300 rounded-lg mb-4 p-4 flex flex-col justify-center">
                    <img
                      src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                      alt=""
                      class="rounded-lg mb-4"
                      style={{ height: "170px;" }}
                    />
                    <a href="#">
                      <div class="relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center cursor-pointer">
                        Check Camera
                      </div>
                    </a>
                  </div>

                  <a href="#">
                    <div class="mt-12">
                      <div class="rounded-lg p-3 bg-blue-300 flex flex-wrap gap-2 mt-2">
                        <div class="bg-white rounded-lg p-2 teal-text flex-1">
                          <div>Weather Today</div>
                          <div class="text-4xl">Clear</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 teal-text flex-1">
                          <div>Temperature</div>
                          <div class="text-4xl">20 °C</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 teal-text flex-1">
                          <div>Device Status</div>
                          <div class="text-4xl">Stable</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 teal-text flex-1">
                          <div>Network</div>
                          <div class="text-4xl">500 mb/s</div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="bg-blue-300 rounded-lg mb-4 p-4 teal-text">
                  {/* <!-- Date Picker --> */}
                  <div class="flex justify-center items-center mb-6">
                    <div class="relative bg-white text-gray-800 rounded-full text-sm py-1 px-2 flex flex-wrap items-center cursor-pointer">
                      <i class="fas fa-calendar mr-2 text-gray-600"></i>
                      6/11/2024
                      <i class="fas fa-chevron-down ml-2 text-gray-600"></i>
                    </div>
                  </div>

                  {/* <!-- Energy Usage Section --> */}
                  <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl mb-4">Energy Usage</h2>
                    <a href="#">
                      <div class="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3">
                        <i class="fas fa-bolt text-lg mr-3"></i>
                        Today
                        <div class="ml-auto font-bold w-full sm:w-auto text-right sm:text-left">
                          <span class="block sm:inline">28.6 kWh</span>
                        </div>
                        <div class="ml-2">
                          <i class="fas fa-lock text-xs"></i>
                        </div>
                      </div>
                    </a>
                    <a href="#">
                      <div class="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3">
                        <i class="fas fa-sync-alt text-lg mr-3"></i>
                        This Month
                        <div class="ml-auto font-bold w-full sm:w-auto text-right sm:text-left">
                          <span class="block sm:inline">325.37 kWh</span>
                        </div>
                        <div class="ml-2">
                          <i class="fas fa-lock text-xs"></i>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* <!-- Energy Generation Section --> */}
                  <div class="bg-white p-4 rounded-lg shadow-md mt-6">
                    <h2 class="text-xl mb-4">Energy Generation</h2>
                    <a href="#">
                      <div class="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3">
                        <i class="fas fa-sun text-lg mr-3"></i>
                        This Month
                        <div class="ml-auto font-bold w-full sm:w-auto text-right sm:text-left">
                          <span class="block sm:inline">400 kWh</span>
                        </div>
                        <div class="ml-2">
                          <i class="fas fa-lock text-xs"></i>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 p-4 gap-4">
                {/* <!-- Rooms --> */}
                <div className="rounded-lg p-4 bg-blue-300 mb-4 relative overflow-hidden">
                  <h2 className="teal-text text-2xl font-bold mb-2">Rooms</h2>

                  {/* Container for the rooms */}
                  <div className="transition-all duration-500 ease-in-out">
                    {/* Grid that holds the rooms */}
                    <div
                      className={`grid sm:grid-cols-4 gap-4 transition-all duration-500 ease-in-out transform ${
                        direction === "next"
                          ? "animate-slide-in-next"
                          : "animate-slide-in-prev"
                      }`}
                    >
                      {/* Display the current set of 4 items */}
                      {rooms
                        .slice(currentIndex, currentIndex + 4)
                        .map((room, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg mb-4 p-4 flex flex-col justify-end"
                          >
                            <img
                              src={room.img}
                              alt={room.name}
                              className="rounded-lg mb-4"
                              style={{ height: "170px" }}
                            />
                            <a href="#">
                              <div className="relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center cursor-pointer">
                                {room.name}
                              </div>
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-2xl ${
                          index === currentPage ? "teal-text" : "text-white"
                        }`}
                      >
                        •
                      </span>
                    ))}
                  </div>

                  {/* Buttons for navigating between items */}
                  <div className="absolute inset-y-1/2 w-[95%] flex justify-between items-center">
                    {/* Left Button */}
                    <button
                      onClick={prevItems}
                      disabled={currentIndex === 0}
                      className="bg-white text-gray-800 p-2 rounded-full"
                    >
                      &lt;
                    </button>

                    {/* Right Button */}
                    <button
                      onClick={nextItems}
                      disabled={currentIndex + 4 >= rooms.length}
                      className="bg-white text-gray-800 p-2 rounded-full"
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                {/* <!-- Track Robot --> */}
                <div class="bg-blue-300 rounded-lg mb-4 p-4 flex flex-col justify-center">
                  <img
                    src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
                    alt=""
                    class="rounded-lg mb-4"
                    style={{ height: "100px;" }}
                  />
                  <a href="#">
                    <div class="relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center cursor-pointer">
                      Track Robot
                    </div>
                  </a>
                </div>
              </div>

              <div class="rounded-lg p-4 teal-text mb-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* <!-- More Devices Section --> */}
                  <div class="bg-blue-300 rounded-lg p-4 mb-4">
                    <h2 class="text-2xl font-bold mb-4">More Devices</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* <!-- Samsung TV --> */}
                      <div class="flex flex-col items-center bg-white p-3 rounded-lg">
                        <a
                          href="#"
                          class="teal-text text-sm sm:text-base w-full text-center mb-2"
                        >
                          Samsung TV
                        </a>
                        {/* <!-- Switch --> */}
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer" />
                          <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300"></div>
                          <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></span>
                        </label>
                      </div>

                      {/* <!-- Philips Hue --> */}
                      <div class="flex flex-col items-center bg-white p-3 rounded-lg">
                        <a
                          href="#"
                          class="teal-text text-sm sm:text-base w-full text-center mb-2"
                        >
                          Philips Hue
                        </a>
                        {/* <!-- Switch --> */}
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer" />
                          <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300"></div>
                          <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></span>
                        </label>
                      </div>

                      {/* <!-- Add --> */}
                      <div class="flex items-center justify-center bg-white p-3 rounded-lg h-full">
                        <a
                          href="#"
                          class="teal-text text-sm sm:text-base w-full text-center"
                        >
                          Add
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Users Section --> */}
                  <a href="##">
                    <div class="bg-blue-300 rounded-lg mb-4 p-4 teal-text">
                      <h2 class="text-2xl font-bold mb-4">Users</h2>
                      <div class="flex flex-wrap gap-4">
                        {/* <!-- User button 1 --> */}
                        <a
                          href="#"
                          class="text-center bg-white p-3 rounded-lg w-full sm:w-auto"
                        >
                          <div class="text-xl sm:text-2xl">Daughter</div>
                          <span class="bg-red-500 text-xs rounded-full text-white px-2 inline-block">
                            Offline
                          </span>
                        </a>

                        {/* <!-- User button 2 --> */}
                        <a
                          href="#"
                          class="text-center bg-white p-3 rounded-lg w-full sm:w-auto"
                        >
                          <div class="text-xl sm:text-2xl">Mom</div>
                          <span class="bg-green-500 text-xs rounded-full text-white px-2 inline-block">
                            Online
                          </span>
                        </a>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
