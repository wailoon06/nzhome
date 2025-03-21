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
  const toggleSidebar = () => {setIsCollapsed(!isCollapsed)};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [deviceStates, setDeviceStates] = useState({});

  // Get device
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

      setDeviceDetails(response.data);

    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [navigate]);
  

  // Toggle function (On/Off)
  useEffect(() => {
    if (deviceDetails.length > 0) {
      // Initialize device states based on data from the backend
      const initialStates = {};
      deviceDetails.forEach(device => {
        initialStates[device.deviceid] = device.onOff === "On";
      });
      setDeviceStates(initialStates);
    }
  }, [deviceDetails]);

  const toggleSwitch = async (deviceid) => {
    try {
      const currentState = deviceStates[deviceid];
      const newState = !currentState;

      setDeviceStates((prevState) => ({
        ...prevState,
        [deviceid]: !prevState[deviceid] // Toggle device state
      }));

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/OnOff",
        {
          deviceid: deviceid,
          state: newState ? "On" : "Off"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh device list to get updated data
      fetchDeviceDetails();

    } catch (err) {
      
      console.error("Failed to update device state:", err);
      setDeviceStates(prevState => ({
        ...prevState,
        [deviceid]: !prevState[deviceid]
      }));

      if (err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
    } 
    
  }

  // Language
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const translations = translationsMap[language] || translationsMap["en"];


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
                <a href="/devices/new">
                  <i className="fas fa-plus text-2xl"></i>
                </a>
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

              {/* Device List Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
                {deviceDetails.map((device) => (
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
                            {device.deviceName} ({device.room.roomName})
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
                      {device.onOff === "On"
                        ? translations.online
                        : translations.offline}
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center">
                      <div
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation when toggling
                          toggleSwitch(device.deviceid);
                        }}
                        className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                          deviceStates[device.deviceid]
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                            deviceStates[device.deviceid]
                              ? "translate-x-8"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
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

  // const devices = [
  //   { img: "/image/xiaomi.jpeg",name: "Xiaomi Vacuum", type: "vacuum", status: "Offline" },
  //   { img: "/image/samsung.jpeg",name: "Samsung TV", type: "TV", status: "Offline" },
  //   { img: "/image/light.jpeg", name: "Philips Hue",type: "Light", status: "Offline"},
  //   { img: "/image/speaker.jpeg", name: "LG Speaker",type: "Speaker",status: "Offline" },
  //   { img: "/image/thermostats.jpeg", name: "Nest Thermostat",type: "Thermostat",status: "Offline"}

    // const [deviceStates, setDeviceStates] = useState(
  //   devices.reduce((acc, device) => {
  //     acc[device.name] = false; // Initialize all devices as "Off"
  //     return acc;
  //   }, {})
  // );
  // ];
