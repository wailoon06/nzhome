import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function RoomDeviceSetActionPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [temperature, setTemperature] = useState(""); // Initialize temperature state
  const [activeButton, setActiveButton] = useState(null);
  const [volume, setVolume] = useState(50); // Initialize volume at 50%

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const toggleSwitch = () => {
    setIsSwitchOn((prevState) => !prevState);
  };

  const { roomTitle, type } = useParams();

  // Handle temperature change (for the dropdown)
  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
  };

  // Handle button click to toggle the active state
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (e.g., sending data to DB)
    console.log("Form submitted with data:", {
      temperature,
      isSwitchOn,
      activeButton,
    });

    navigate(`/rooms/devices/${roomTitle}`);
  };

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
            <div class="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <Link
                    className="relative pl-4"
                    to={`/rooms/summary/${roomTitle}`}
                  >
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </Link>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {translations.set_action}
                  </h1>
                </div>

                {/* ==================== */}
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-rows-[auto,1fr] p-4 mt-2 gap-4 rounded-lg bg-white"
                >
                  <h1 className="text-center lg:text-4xl w-full">
                    {roomTitle} {type}
                  </h1>

                  {!["TV", "Light", "vacuum", "Speaker"].includes(type) && (
                    <div className="border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-700">
                        {translations.temperature}
                      </span>

                      <select
                        className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={temperature}
                        onChange={handleTemperatureChange}
                      >
                        <option value="" disabled>
                          {translations.select}
                        </option>
                        {Array.from({ length: 100 }, (_, i) => i + 1).map(
                          (temp) => (
                            <option key={temp} value={temp}>
                              {temp}°C
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {["TV", "Speaker"].includes(type) && (
                    <div className="border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-center">
                      <div className="volume-adjuster">
                        <label
                          htmlFor="volume"
                          className="block text-lg font-medium"
                        >
                          Volume: {volume}%
                        </label>
                        <input
                          id="volume"
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 p-5">
                    {/* Turn On Button */}
                    <div
                      onClick={() => handleButtonClick("on")}
                      className={`border border-gray-300 h-[3rem] rounded-lg text-sm sm:text-base text-center flex justify-center items-center cursor-pointer transition-all ${
                        activeButton === "on"
                          ? "bg-gray-600 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <div className="text-1xl">{translations.turnOn}</div>
                    </div>

                    {/* Turn Off Button */}
                    <div
                      onClick={() => handleButtonClick("off")}
                      className={`border border-gray-300 h-[3rem] rounded-lg text-sm sm:text-base text-center flex justify-center items-center cursor-pointer transition-all ${
                        activeButton === "off"
                          ? "bg-gray-600 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <div className="text-1xl">{translations.turnOff}</div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center h-full w-full">
                    <div className="border border-gray-300 rounded-lg bg-white p-4 w-[40%] flex items-center justify-between">
                      {/* Label */}
                      <span className="text-lg font-medium text-gray-700">
                        {translations.auto}
                      </span>

                      {/* Switch */}
                      <div
                        onClick={toggleSwitch}
                        className={`w-12 h-6 sm:w-16 sm:h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                          isSwitchOn ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white shadow-md transform transition-transform ${
                            isSwitchOn
                              ? "translate-x-6 sm:translate-x-8"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 gap-4 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-black text-sm sm:text-base w-full mb-2 text-center sm:w-[15%] md:w-[15%] h-[3rem] flex justify-center items-center"
                    >
                      <div className="text-1xl text-white">
                        {translations.done}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDeviceSetActionPage;
