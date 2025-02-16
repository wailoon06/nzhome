import React, { useState } from "react";
import { Link } from "react-router-dom";

function RoomsRobots() {
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

  const totalPages = Math.ceil(rooms.length / 4);
  const currentPage = Math.floor(currentIndex / 4);

  const prevItems = () => {
    if (currentIndex === 0) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(currentIndex - 4); // Update temp index for display
  };

  const nextItems = () => {
    if (currentIndex + 4 >= rooms.length) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-next");
    setTempIndex(currentIndex + 4); // Update temp index for display
  };

  const handleAnimationEnd = () => {
    setAnimationClass(""); // Reset animation class
    setCurrentIndex(tempIndex); // Update actual index after animation ends
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[3fr,1.2fr] p-4 gap-4">
      {/* Rooms */}
      <div className="rounded-lg p-4 baseGreen mb-4 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-bold mb-2">Rooms</h2>
          <div className="flex space-x-2">
            <Link to="/rooms">
              <div className="text-white font-bold">View All Rooms</div>
            </Link>
          </div>
        </div>
        <div className="transition-all duration-500 ease-in-out">
          <div
            className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
            onAnimationEnd={handleAnimationEnd}
          >
            {rooms.slice(tempIndex, tempIndex + 4).map((room, index) => (
              <div
                key={index}
                className="bg-white rounded-lg mb-4 p-4 flex flex-col justify-end"
              >
                <div className="flex justify-center items-center mb-4 h-[170px]">
                  <img
                    src={
                      "https://wallpapers.com/images/featured/cute-anime-profile-pictures-k6h3uqxn6ei77kgl.jpg"
                    }
                    alt={""}
                    className="rounded-lg object-contain"
                    style={{ maxHeight: "100%" }}
                  />
                </div>
                <Link to={`/rooms/devices/${room.name}`}>
                  <div className="relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center cursor-pointer">
                    {room.name}
                  </div>
                </Link>
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
            disabled={currentIndex + 4 >= rooms.length}
            className="bg-white text-gray-800 p-2 rounded-full"
          >
            <i className={"fas fa-chevron-right"}></i>
          </button>
        </div>
      </div>
      {/* Track Robot */}
      <div className="baseGreen rounded-lg mb-4 p-4 flex flex-col justify-center">
        <img
          src="https://wallpapers.com/images/featured/cute-anime-profile-pictures-k6h3uqxn6ei77kgl.jpg"
          alt=""
          className="rounded-lg mb-4"
          style={{ height: "300px" }}
        />
        <a href="/robots">
          <div className="relative bg-white text-gray-800 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center cursor-pointer">
            Track Robot
          </div>
        </a>
      </div>
    </div>
  );
}

export default RoomsRobots;
