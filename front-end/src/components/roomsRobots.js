import React, { useState } from "react";
import { Link } from "react-router-dom";
import translationsMap from "../components/locales/translationsMap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RoomsRobots() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch room list
  const [roomList, setRoomList] = useState([]);
  // Store user permissions for rooms
  const [roomPermissions, setRoomPermissions] = useState({});

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getUserDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Check if the role is OWNER
      setIsOwner(response.data.role === "Owner");
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsOwner(false);
    }
  };

  const fetchRoomList = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/getAllRooms",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Only add the "Add Room" option if user is an owner
      let updatedRoomList = [...response.data];
      if (isOwner) {
        updatedRoomList.push({ roomName: "Add Room", picture: "/image/plus.png" });
      }
      
      setRoomList(updatedRoomList);

      // Check permissions for each room
      const permissionsMap = {};
      
      // For each room (except "Add Room"), validate permission
      for (const room of response.data) {
        try {
          await axios.post(
            "http://localhost:8080/api/validatePermission",
            { roomid: room.roomid },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // If no error is thrown, user has permission
          permissionsMap[room.roomid] = true;
        } catch (error) {
          // If 403 Forbidden or any other error, user doesn't have permission
          permissionsMap[room.roomid] = false;
        }
      }
      
      setRoomPermissions(permissionsMap);

    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");//added
        
        setTimeout(() => {//added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          navigate("/login");
        }, 5000);
      } else {
        // setError("An unexpected error occurs");
        setError("An unexpected error occurred. Please try again.");//added
        setTimeout(() => {//added
          setErrorMessage("");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First check the user role
    checkUserRole();
  }, []);
  
  useEffect(() => {
    // After checking the role, fetch room list
    fetchRoomList();
  }, [isOwner]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(""); // Track animation
  const [tempIndex, setTempIndex] = useState(currentIndex); // Temporary index for animation

  const totalPages = Math.ceil(roomList.length / 4);
  const currentPage = Math.floor(currentIndex / 4);

  const prevItems = () => {
    if (currentIndex === 0) return;
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(currentIndex - 4);
  };

  const nextItems = () => {
    if (currentIndex + 4 >= roomList.length) return;
    setAnimationClass("animate-slide-in-next");
    setTempIndex(currentIndex + 4);
  };

  const handleAnimationEnd = () => {
    setAnimationClass("");
    setCurrentIndex(tempIndex);
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // Handle room click with permission check
  const handleRoomClick = (room, e) => {
    // Always allow "Add Room"
    if (room.roomName === "Add Room") {
      return;
    }
    
    // Check if user has permission
    if (!roomPermissions[room.roomid]) {
      e.preventDefault();
      // alert(translations.noPermission || "You don't have permission to access this room");
      // Show success message (added)
      // setSuccessMessage(translations.noPermission || "You don't have permission to access this room");
      setErrorMessage("You don't have permission to access this room");
      // Auto-clear success message after 3 seconds (added)
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const [robot, setRobot] = useState([]);
  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Filter only devices with categoryName === 'Robot'
      const robotDevices = response.data.filter(device => device.category.categoryName === "Vacuum");
  
      setRobot(robotDevices);
    } catch (err) {
      // setError("An unexpected error occurred");
      setError("An unexpected error occurred. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeviceDetails();
  }, []);

  return (

    <>
    {/* Error Message*/}
    {errorMessage && (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-[10000]">
        {errorMessage}
      </div>
    )}

    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[3fr,1.2fr] p-4 gap-4">
      {/* Rooms Section */}
      <div className="rounded-lg p-4 baseGreen2 mb-4 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-bold mb-2">
            {translations.rooms}
          </h2>
        </div>


        <div className="transition-all duration-500 ease-in-out">
          <div
            className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
            onAnimationEnd={handleAnimationEnd}
          >
            {roomList.slice(tempIndex, tempIndex + 4).map((room, index) => {
              const isAddRoom = room.roomName === "Add Room";
              const hasPermission = isAddRoom || roomPermissions[room.roomid];

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg mb-4 p-4 flex flex-col justify-end relative"
                >
                  <div className="flex justify-center items-center mb-4 h-[170px] relative">
                    <Link
                      to={
                        isAddRoom
                          ? "/rooms/new"
                          : `/${room.roomName}/${room.roomid}/devices`
                      }
                      onClick={(e) => handleRoomClick(room, e)}
                      className={
                        !hasPermission
                          ? "cursor-not-allowed w-full h-full flex justify-center items-center"
                          : "cursor-pointer w-full h-full flex justify-center items-center"
                      }
                    >
                      <img
                        src={
                          isAddRoom
                            ? room.picture
                            : `data:image/png;base64,${room.picture}`
                        }
                        alt={room.roomName}
                        className={`rounded-lg object-contain ${
                          !hasPermission ? "opacity-60" : ""
                        }`}
                        style={{ maxWidth: "100%", maxHeight: "170px" }}
                      />
                      {!hasPermission && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className="fas fa-lock text-gray-600 text-2xl"></i>
                        </div>
                      )}
                    </Link>
                  </div>
                  <Link
                    to={
                      isAddRoom
                        ? "/rooms/new"
                        : `/${room.roomName}/${room.roomid}/devices/`
                    }
                    onClick={(e) => handleRoomClick(room, e)}
                  >
                    <div
                      className={`relative bg-white text-gray-800 rounded-full text-sm py-2 px-4 flex justify-center items-center ${
                        !hasPermission ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {room.roomName}
                      {!hasPermission && !isAddRoom && (
                        <i className="fas fa-lock ml-2 text-gray-600"></i>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
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
        {roomList.length > 1 && (
          <div className="absolute inset-y-1/2 w-[99%] flex px-10 pe-6 items-center">
            {/* Left Button - Stays on the left when visible */}
            {currentIndex > 0 && (
              <div className="flex-1 flex justify-start">
                <button
                  onClick={prevItems}
                  disabled={currentIndex === 0}
                  className="bg-white border-4 text-gray-800 p-2 rounded-full"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              </div>
            )}

            {/* Right Button - Stays on the right when visible */}
            {currentIndex + 4 < roomList.length && (
              <div className="flex-1 flex justify-end">
                <button
                  onClick={nextItems}
                  disabled={currentIndex + 4 >= roomList.length}
                  className="bg-white border-4 text-gray-800 p-2 rounded-full"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Track Robot Section */}
      {robot && robot.length > 0 ? (
        <div className="baseGreen2 rounded-lg mb-4 p-4 flex flex-col justify-center">
          <img
            src="/image/robot.jpg"
            alt="Robot"
            className="rounded-lg mb-4"
            style={{ height: "300px" }}
          />
          <a href="/robots">
            <div className="relative bg-white text-gray-800 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center cursor-pointer">
              {translations.trackRobot}
            </div>
          </a>
        </div>
      ) : (
        <div className="baseGreen2 rounded-lg mb-4 p-4 flex flex-col justify-center opacity-50 cursor-not-allowed">
          <img
            src="/image/robot.jpg"
            alt="Robot"
            className="rounded-lg mb-4"
            style={{ height: "300px", filter: "grayscale(100%)" }}
          />
          <div className="relative bg-gray-400 text-gray-600 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center">
            {translations.trackRobot}
          </div>
        </div>
      )}
    </div>
    </>//added symbol
  );
}

export default RoomsRobots;