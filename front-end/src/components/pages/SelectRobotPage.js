import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function SelectRobotPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const navigate = useNavigate();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [devicesByRoom, setDevicesByRoom] = useState({});
  const [roomNames, setRoomNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");     //added
  
  // Get device
  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Get all devices
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const allDevices= response.data.filter(device => device.category?.categoryName === "Vacuum");
      const authorisedDevices = [];
  
      for (const device of allDevices) {
        try {
          // Validate device permission
          await axios.post(
            "http://localhost:8080/api/validateDevicePermission",
            { deviceid: device.deviceid },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          // If device is authorized, add it to the list and skip room permission check
          authorisedDevices.push(device);
        } catch (err) {
          console.log(`No permission for device ${device.deviceid}`);
        }
      }
  
      setDeviceDetails(authorisedDevices);
  
      // Step 2: Organize authorized devices by room
      const deviceRooms = {};
      const rooms = [];
  
      authorisedDevices.forEach(device => {
        const roomName = device.room.roomName;
  
        if (!deviceRooms[roomName]) {
          deviceRooms[roomName] = [];
          rooms.push(roomName);
        }
  
        deviceRooms[roomName].push(device);
      });
  
      // Sort room names alphabetically
      rooms.sort((a, b) => a.localeCompare(b));
  
      setRoomNames(rooms);
      setDevicesByRoom(deviceRooms);
  
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeviceDetails();
  }, []);

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
         <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
         </div>

         {/* Error Message Display (added)*/}
         {errorMessage && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
              {errorMessage}
            </div>
          )}

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} translations={translations} />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Setting Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-4%]">
                  {translations.selectRobot}
                </h1>
              </div>

              {/* Main Content Section */}
              <div className="p-3">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading devices...</p>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : (
                  roomNames.length === 0 ? (
                    <div className="text-center">{translations.noRobotsFound}</div>
                  ) : (
                    roomNames.map((roomName, roomIndex) => (
                      <div key={roomIndex} className="mb-6">
                        <h2 className="text-xl font-bold mb-3 pl-2 border-l-4 border-teal-500">{roomName}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {devicesByRoom[roomName].map((robot, deviceIndex) => (
                            <Link 
                              key={deviceIndex} 
                              to={`/robots/${robot.category.categoryName}/${robot.deviceid}/${robot.deviceName}`}
                              className="rounded-lg border-[2px] border-gray-300 bg-white hover:shadow-lg transition-shadow duration-300"
                            >
                              <div className="flex flex-col items-center p-4">
                                <img
                                  src={robot.picture}
                                  alt={robot.deviceName}
                                  className="border border-black rounded-lg mb-4"
                                  style={{ height: "100px", width: "100px", objectFit: "cover" }}
                                />
                                <div className="teal-text text-center mb-2">            
                                  <strong>
                                    {robot.deviceName}
                                  </strong>
                                </div>
                                <div className="text-sm w-full bg-red-500 rounded-full text-white text-center py-1 px-2">
                                  {translations.offline}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectRobotPage;

{/* <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-2 justify-center items-center p-3">
                {/* Dynamically added blocks
                <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                  {robotDetails.map((robot) => (
                    <Link to={`/robots/${robot.category.categoryName}/${robot.deviceid}/${robot.deviceName}`}>
                      <div className="grid sm:grid-cols-1 items-center gap-4">
                        <img
                          src={robot.picture}
                          alt=""
                          className="border border-black rounded-lg mb-4 mx-auto"
                          style={{ height: "100px", width: "100px" }}
                        />
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">{robot.deviceName} ({robot.room.roomName})</div>
                          <div className="text-2xl w-full mb-2 bg-red-500 rounded-full text-white inline-block">
                            {translations.offline}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>{" "} */}
                {/* More blocks will automatically adjust */}
              /*</div> */