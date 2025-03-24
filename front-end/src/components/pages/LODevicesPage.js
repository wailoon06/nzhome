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
  const [errorMessage, setErrorMessage] = useState("");     //added
  

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
        "https://humdrum-beef-production.up.railway.app/api/getUserDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserDetails(response.data.role);
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
        "https://humdrum-beef-production.up.railway.app/api/getAllDevice",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const allDevices = response.data;
      const authorisedDevices = [];
  
      for (const device of allDevices) {
        try {
          // Validate device permission
          await axios.post(
            "https://humdrum-beef-production.up.railway.app/api/validateDevicePermission",
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
        "https://humdrum-beef-production.up.railway.app/api/OnOff",
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
                // <div className="text-center py-8">
                //   <p>Loading devices...</p>
                // </div>
                <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                  <p className="text-lg text-gray-600">Loading devices...</p>
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