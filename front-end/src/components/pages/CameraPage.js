import React, { useState } from "react";
import { Link } from "react-router-dom";

function CameraPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(""); // Track animation
  const [tempIndex, setTempIndex] = useState(currentIndex); // Temporary index for animation
  const rooms = [
    { img: "room1.jpg", name: "Living Room" },
    { img: "room2.jpg", name: "Kitchen" },
    { img: "room3.jpg", name: "Bathroom" },
    { img: "room4.jpg", name: "Master" },
    { img: "room5.jpg", name: "Guest Room" },
    { img: "room6.jpg", name: "Office" },
    { img: "room7.jpg", name: "Garage" },
    { img: "room8.jpg", name: "Patio" },
    { img: "room8.jpg", name: "Patio" },
    { img: "room8.jpg", name: "Patio" },
  ];

  const totalPages = Math.ceil(rooms.length / 1);
  const currentPage = Math.floor(currentIndex / 1);

  const prevItems = () => {
    if (currentIndex === 0) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(currentIndex - 1); // Update temp index for display
  };

  const nextItems = () => {
    if (currentIndex + 1 >= rooms.length) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-next");
    setTempIndex(currentIndex + 1); // Update temp index for display
  };

  const handleAnimationEnd = () => {
    setAnimationClass(""); // Reset animation class
    setCurrentIndex(tempIndex); // Update actual index after animation ends
  };

  // Directional Camera Movement
  const [intervalId, setIntervalId] = useState(null); // To track the interval for logging
  const [activeButton, setActiveButton] = useState(""); // Track the active button

  const handleMouseDown = (direction) => {
    setActiveButton(direction); // Set the active button state
    // Start logging the direction when button is held down
    const id = setInterval(() => {
      console.log(direction);
    }, 100); // Log every 100ms
    setIntervalId(id);
  };

  const handleMouseUp = () => {
    setActiveButton(""); // Reset the active button state
    // Stop logging when the button is released
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const buttonStyles = (direction) =>
    `px-6 py-3 rounded-lg font-bold text-lg shadow-md ${
      activeButton === direction ? "bg-gray-500" : "bg-gray-300"
    } transition-colors duration-150 ease-in-out`;

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
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    Cameras
                  </h1>
                </div>

                {/* ==================== */}

                <div className="rounded-lg p-4 mb-4 relative overflow-hidden">
                  <div className="transition-all duration-500 ease-in-out">
                    <div
                      className={`grid grid-cols-1 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
                      onAnimationEnd={handleAnimationEnd}
                    >
                      {rooms
                        .slice(tempIndex, tempIndex + 1)
                        .map((room, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg mb-4 p-4 flex flex-col justify-end h-full"
                          >
                            <div className="flex justify-center items-center mb-4 h-[23rem]">
                              <img
                                src={
                                  "https://wallpapers.com/images/featured/cute-anime-profile-pictures-k6h3uqxn6ei77kgl.jpg"
                                }
                                alt={""}
                                className="rounded-lg object-contain"
                                style={{ maxHeight: "100%" }}
                              />
                            </div>

                            <div className="relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center">
                              {room.name}
                            </div>

                            <div className="flex flex-col items-center space-y-4 mt-8">
                              {/* Up Button */}
                              <button
                                onMouseDown={() => handleMouseDown("Up")}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp} // Stop if the mouse leaves the button
                                className={buttonStyles("Up")}
                              >
                                Up
                              </button>

                              <div className="flex space-x-4">
                                {/* Left Button */}
                                <button
                                  onMouseDown={() => handleMouseDown("Left")}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  className={buttonStyles("Left")}
                                >
                                  Left
                                </button>

                                {/* Down Button */}
                                <button
                                  onMouseDown={() => handleMouseDown("Down")}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  className={buttonStyles("Down")}
                                >
                                  Down
                                </button>

                                {/* Right Button */}
                                <button
                                  onMouseDown={() => handleMouseDown("Right")}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  className={buttonStyles("Right")}
                                >
                                  Right
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

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
                  <div className="absolute inset-y-1/2 w-[95%] flex justify-between items-center">
                    <button
                      onClick={prevItems}
                      disabled={currentIndex === 0}
                      className="bg-white text-gray-800 p-2 rounded-full"
                    >
                      <i className={"fas fa-chevron-left"}></i>
                    </button>
                    <button
                      onClick={nextItems}
                      disabled={currentIndex + 1 >= rooms.length}
                      className="bg-white text-gray-800 p-2 rounded-full"
                    >
                      <i className={"fas fa-chevron-right"}></i>
                    </button>
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

export default CameraPage;
