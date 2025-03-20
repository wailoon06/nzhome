import React, { useState } from "react";
import { Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddNewDevicePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navigate = useNavigate();

  const airConditioner = [
    { name: "Daikin AC", img: "/image/air-conditioner.png", category: "Air Conditioner" },
    { name: "Samsung AC", img: "/image/air-conditioner.png", category: "Air Conditioner" },
  ];
  const television = [
    { name: "Sony TV", img: "/image/television.png", category: "TV" },
    { name: "Samsung TV", img: "/image/television.png", category: "TV" },
  ];
  const thermostat = [
    { name: "Bosch Smart Thermostat", img: "/image/thermostat.jpg", category: "Thermostat" },
    { name: "Ecobee Smart Thermostat", img: "/image/thermostat.jpg", category: "Thermostat" },
  ];
  const light = [
    { name: "Xiaomi Smart Light", img: "/image/smartLight.png", category: "Light" },
    { name: "Philips Smart Light", img: "/image/smartLight.png", category: "Light" },
  ];
  const lock = [
    { name: "August Smart Lock", img: "/image/smartLock.jpg", category: "Lock" },
    { name: "Yale Smart Lock", img: "/image/smartLock.jpg", category: "Lock" },
  ];
  const sensor = [
    { name: "Eve Air Quality Sensor", img: "/image/sensor.webp", category: "Sensor" },
    { name: "Aqara Motion Sensor", img: "/image/sensor.webp", category: "Sensor" },
  ];
  const camera = [
    { name: "Xiaomi Camera", img: "/image/camera.jpg", category: "Camera" },
    { name: "Arlo Ultra Camera", img: "/image/camera.jpg", category: "Camera" },
  ];
  const robot = [
    { name: "Xiaomi Vacuum Robot", img: "/image/vrobot.avif", category: "Vacuum" },
    { name: "ILife Vacuum Robot", img: "/image/vrobot.avif", category: "Vacuum" },
  ];

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
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

            {/* <!-- Main Content --> */}
            <div className="flex flex-col flex-1">
              <div
                className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
              >
                <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
                  <div className="flex flex-col flex-1">
                    {/* Setting Section */}
                    <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                      <a className="relative pl-4" href="/devices">
                        <i className="fa fa-2x fa-arrow-left"></i>
                      </a>
                      <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                        {translations.selectDevice}
                      </h1>
                    </div>

                    {/* Air Conditioner */}
                    <div className="grid grid-rows-[auto,1fr] gap-4 mt-[5%]">
                      <div className="text-left font-medium text-lg ml-6">
                        {/* {translations.airConditionerBrand} */}
                        Air Conditioner
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {airConditioner.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Television */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        {/* {translations.televisionBrand} */}
                        Television
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {television.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Thermostat */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Thermostat
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {thermostat.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "150px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Light */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Light
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {light.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lock */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Lock
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {lock.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sensor */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Sensor
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {sensor.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "150px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Camera */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Camera
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {camera.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Robot */}
                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        Robot
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {robot.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                              onClick={() => {
                                localStorage.setItem("selectedDevice", JSON.stringify(device));
                              }}
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src={device.img}
                                  alt=""
                                  // className="border border-black rounded-lg mb-4 mx-auto"
                                  className="rounded-lg mb-4 mx-auto"
                                  style={{ height: "100px", width: "100px" }}
                                />
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
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

export default AddNewDevicePage;
