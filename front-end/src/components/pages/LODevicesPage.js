import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LODevicesPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [deviceStates, setDeviceStates] = useState({});
  const [devicesByRoom, setDevicesByRoom] = useState({});
  const [roomNames, setRoomNames] = useState([]);
  

  // Language
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const translations = translationsMap[language] || translationsMap["en"];
  
  const [userDetails, setUserDetails] = useState([]);
  
  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Get all devices
      const response = await axios.get(
        "http://localhost:8080/api/getUserDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserDetails(response.data.role);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurred");
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Get device
  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Get all devices
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const allDevices = response.data;
      
      // Step 2: Extract unique rooms from devices
      const uniqueRooms = [...new Set(
        allDevices
          .filter(device => device.room.roomid) // Filter out devices without rooms
          .map(device => device.room.roomid)
      )];
      
      // Step 3: Check permissions for each unique room
      const authorizedRoomIds = [];
      
      for (const roomId of uniqueRooms) {
        try {
          // Use your existing validatePermission endpoint
          await axios.post(
            "http://localhost:8080/api/validatePermission",
            { roomid: roomId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // If we get here without an error, the user has permission for this room
          authorizedRoomIds.push(roomId);
        } catch (err) {
          // If we get a 403 error, the user doesn't have permission for this room
          // Just continue to the next room
          console.log(`No permission for room ${roomId}`);
        }
      }
      
      // Step 4: Filter devices to only those in rooms the user has access to
      const authorizedDevices = allDevices.filter(device => {
        // Include devices without rooms (Unassigned) or in authorized rooms
        return !device.room || !device.room.roomid || authorizedRoomIds.includes(device.room.roomid);
      });
      
      setDeviceDetails(authorizedDevices);
      
      // Step 5: Organize authorized devices by room
      const deviceRooms = {};
      const rooms = [];
      
      // Group devices by room
      authorizedDevices.forEach(device => {
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
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeviceDetails();
  }, []);

  const toggleSwitch = async (deviceid) => {
    try {
      const currentState = deviceStates[deviceid];
      const newState = !currentState;

      setDeviceStates((prevState) => ({
        ...prevState,
        [deviceid]: !prevState[deviceid], // Toggle device state
      }));

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/OnOff",
        {
          deviceid: deviceid,
          state: newState ? "On" : "Off",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh device list to get updated data
      fetchDeviceDetails();
    } catch (err) {
      console.error("Failed to update device state:", err);
      setDeviceStates((prevState) => ({
        ...prevState,
        [deviceid]: !prevState[deviceid],
      }));

      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
    }
  };

  // Toggle function (On/Off)
  useEffect(() => {
    if (deviceDetails.length > 0) {
      // Initialize device states based on data from the backend
      const initialStates = {};
      deviceDetails.forEach((device) => {
        initialStates[device.deviceid] = device.onOff === "On";
      });
      setDeviceStates(initialStates);
    }
  }, [deviceDetails]);

  // Device card component to avoid duplication
  const DeviceCard = ({ device }) => (
    <div
      key={device.deviceName}
      className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col items-center p-4"
    >
      <Link
        to={`/devices/${device.category.categoryName}/${device.deviceid}/${device.deviceName}/details`}
        className="w-full text-center"
      >
        {/* Displaying Image */}
        {device.picture ? (
          <img
            src={device.picture}
            alt={device.deviceName}
            className="border border-black rounded-lg mb-4 mx-auto object-contain"
            style={{ height: "100px", width: "100px" }}
          />
        ) : (
          <p>No Image Available</p>
        )}
        {/* Displaying device name with room (if available) */}
        {device.room && device.room.roomName ? (
          <div className="teal-text text-sm sm:text-base w-full mb-2">
            <strong>
              {device.deviceName}
            </strong>
          </div>
        ) : (
          <div className="teal-text text-sm sm:text-base w-full mb-2">
            <strong>{device.deviceName}</strong>
          </div>
        )}
      </Link>

      {/* Status Indicator */}
      <div
        className={`text-2xl w-auto px-4 mb-2 rounded-full text-white inline-block py-1 ${
          device.onOff === "On" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {device.onOff === "On" ? translations.online : translations.offline}
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-center">
        <div
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when toggling
            toggleSwitch(device.deviceid);
          }}
          className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
            deviceStates[device.deviceid] ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
              deviceStates[device.deviceid] ? "translate-x-8" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        {/* Sidebar Component */}
        <div className="relative flex">
          <Sidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            language={language}
          />
        </div>

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />

            {/* Main Section */}
            <div className="flex flex-col flex-1">
              {/* Header Section */}
              <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                  {translations.list_of_devices}
                </h1>
                {userDetails == "Owner" && (
                  <a href="/devices/new">
                    <i className="fas fa-plus text-2xl"></i>
                  </a>
                )}
              </div>

              {loading && (
                <div className="text-center py-8">
                  <p>Loading devices...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {/* Device List Section - Organized by Room */}
              <div className="p-3 flex flex-col gap-6">
                {roomNames.map((roomName) => (
                  <div key={roomName} className="mb-4">
                    <h2 className="text-xl font-bold mb-3 pl-2 border-l-4 border-teal-500">
                      {roomName}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {devicesByRoom[roomName].map((device) => (
                        <DeviceCard key={device.deviceid} device={device} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LODevicesPage;