import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(""); // Track animation
  const [tempIndex, setTempIndex] = useState(currentIndex); // Temporary index for animation

  const users = [
    { status: "Offline", name: "Daughter" },
    { status: "Offline", name: "Mom" },
    { status: "Offline", name: "Dad" },
    { status: "Offline", name: "Brother" },
    { status: "Offline", name: "Sister" },
    { status: "Offline", name: "Grandpa" },
    { status: "Offline", name: "Grandma" },
  ];

  const prevItems = () => {
    if (currentIndex === 0) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(currentIndex - 3); // Update temp index for display
  };

  const nextItems = () => {
    if (currentIndex + 3 >= users.length) return; // Prevent unnecessary actions
    setAnimationClass("animate-slide-in-next");
    setTempIndex(currentIndex + 3); // Update temp index for display
  };

  const handleAnimationEnd = () => {
    setAnimationClass(""); // Reset animation class
    setCurrentIndex(tempIndex); // Update actual index after animation ends
  };

  const totalPages = Math.ceil(users.length / 3);
  const currentPage = Math.floor(currentIndex / 3);

  return (
    <div className="rounded-lg p-4 mb-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Users Section */}
        <div className="rounded-lg p-4 baseGreen mb-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Users</h2>
          </div>

          <div className="transition-all duration-500 ease-in-out">
            <div
              className={`grid sm:grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
              onAnimationEnd={handleAnimationEnd}
            >
              {users.slice(tempIndex, tempIndex + 3).map((user, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white p-3 rounded-lg"
                >
                  <Link to={`/user/${user.name}`}>
                    <div className="text-center bg-white p-3 rounded-lg w-full sm:w-auto">
                      <div className="text-xl sm:text-2xl teal-text">
                        {user.name}
                      </div>
                      <span className="bg-red-500 text-xs rounded-full text-white px-2 inline-block">
                        {user.status}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
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

          {/* Navigation Buttons */}
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
              disabled={currentIndex + 3 >= users.length}
              className="bg-white text-gray-800 p-2 rounded-full"
            >
              <i className={"fas fa-chevron-right"}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
