import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
function LODevicesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const devices = [
    { img: "/image/xiaomi.jpeg",name: "Xiaomi Vacuum", type: "vacuum", status: "Offline" },
    { img: "/image/samsung.jpeg",name: "Samsung TV", type: "TV", status: "Offline" },
    { img: "/image/light.jpeg", name: "Philips Hue",type: "Light", status: "Offline"},
    { img: "/image/speaker.jpeg", name: "LG Speaker",type: "Speaker",status: "Offline" },
    { img: "/image/thermostats.jpeg", name: "Nest Thermostat",type: "Thermostat",status: "Offline"}
  ];

  const [deviceStates, setDeviceStates] = useState(
    devices.reduce((acc, device) => {
      acc[device.name] = false; // Initialize all devices as "Off"
      return acc;
    }, {})
  );

  const toggleSwitch = (deviceName) => {
    setDeviceStates((prevState) => ({
      ...prevState,
      [deviceName]: !prevState[deviceName] // Toggle device state
    }));
  };

  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        
        {/* Sidebar Component */}
        <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
        </div>

        {/* Main Content */}
        <div className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}>
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            
            {/* Main Content Header */}
            <MainContentHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} translations={translations} />

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

              {/* Device List Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
                {devices.map((device) => (
                  <div key={device.name} className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col items-center p-4">
                    <Link to={`/devices/${device.type}/${device.name}/details`} className="w-full text-center">
                      <img
                        src={device.img}
                        alt={device.name}
                        className="border border-black rounded-lg mb-4 mx-auto object-contain"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="teal-text text-sm sm:text-base w-full mb-2">
                        <strong>{device.name}</strong>
                      </div>
                    </Link>

                    {/* Status Indicator */}
                    <div
                      className={`text-2xl w-auto px-4 mb-2 rounded-full text-white inline-block py-1 ${
                        deviceStates[device.name] ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {deviceStates[device.name] ? translations.online : translations.offline}
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center">
                      <div
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation when toggling
                          toggleSwitch(device.name);
                        }}
                        className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                          deviceStates[device.name] ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                            deviceStates[device.name] ? "translate-x-8" : "translate-x-0"
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
