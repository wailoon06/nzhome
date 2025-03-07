import React, { useState } from "react";
import { Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function AllRoomPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(""); // Track animation
  const [tempIndex, setTempIndex] = useState(currentIndex); // Temporary index for animation
  const [rooms, setRooms] = useState([
    { img: "/image/living_room.jpg", name: "Living Room" },
    { img: "/image/kitchen.jpg", name: "Kitchen" },
    { img: "/image/bathroom.jpg", name: "Bathroom" },
    { img: "/image/master.jpg", name: "Master" },
    { img: "/image/guest.jpeg", name: "Guest Room" },
    { img: "/image/study.jpg", name: "Study" },
    { img: "/image/garage.jpg", name: "Garage" },
  ]);

  const totalPages = Math.ceil(rooms.length / 2);
  const currentPage = Math.floor(currentIndex / 2);

  const prevItems = () => {
    if (currentIndex === 0) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(currentIndex - 2); // Update temp index for display
  };

  const nextItems = () => {
    if (currentIndex + 2 >= rooms.length) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-next");
    setTempIndex(currentIndex + 2); // Update temp index for display
  };

  const handleAnimationEnd = () => {
    setAnimationClass(""); // Reset animation class
    setCurrentIndex(tempIndex); // Update actual index after animation ends
  };

  // translations
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
        <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
         </div>

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} translations={translations} />
            {/* <!-- Main Content --> */}
            <div className="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div className="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                    {translations.rooms}
                  </h1>
                  <a href="/rooms/new">
                    <i className="fas fa-plus text-2xl"></i>
                  </a>
                </div>

                {/* ==================== */}

                <div className="rounded-lg p-4 mb-4 relative overflow-hidden">
                  <div className="transition-all duration-500 ease-in-out">
                    <div
                      className={`grid grid-cols-2 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
                      onAnimationEnd={handleAnimationEnd}
                    >
                      {rooms
                        .slice(tempIndex, tempIndex + 2)
                        .map((room, index) => (
                          <div
                            key={index}
                            className="baseGreen rounded-lg mb-4 p-4 flex flex-col justify-end h-full"
                          >
                            <div className="flex justify-center items-center mb-4 h-[23rem]">
                              <img
                                src={room.img}
                                alt={""}
                                className="rounded-lg object-contain"
                                style={{ maxHeight: "100%" }}
                              />
                            </div>

                            <div className="relative bg-white text-gray-800 text-lg font-bold py-2 px-4 flex justify-center items-center">
                              {room.name}
                            </div>
                            <div className="py-1"></div>
                            <div className="grid grid-cols-2 relative baseGreen text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center gap-4">
                              <Link
                                key={room.name}
                                to={`/rooms/summary/${room.name}`}
                              >
                                <div className="border border-gray-400 relative bg-white font-bold text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center">
                                  {translations.summary}
                                </div>
                              </Link>
                              <Link to={`/rooms/devices/${room.name}`}>
                                <div className="border border-gray-400 relative bg-white font-bold text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center">
                                  {translations.devices}
                                </div>
                              </Link>
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
                      disabled={currentIndex + 2 >= rooms.length}
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
    </div>
  );
}

export default AllRoomPage;
