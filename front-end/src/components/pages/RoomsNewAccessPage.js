import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function RoomsNewAccessPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Devices
  const users = [{ name: "mom" }, { name: "daughter" }];

  const [selectedDevices, setSelectedDevices] = useState([]); // Selected users

  // Toggle Selected State
  const toggleSelected = (deviceName) => {
    setSelectedDevices(
      (prevSelected) =>
        prevSelected.includes(deviceName)
          ? prevSelected.filter((name) => name !== deviceName) // Remove from selected
          : [...prevSelected, deviceName] // Add to selected
    );
  };

  // Get title
  const { roomTitle } = useParams();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
        </div>
        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} translations={translations} />

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/rooms/new">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    {translations.roomAccessPermission}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4">
                  {/* Event Form */}
                  <div className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-rows-[auto] gap-4">
                    <div className="grid grid-rows-[auto]">
                      <div className="grid grid-cols-1">
                        <h3 className="text-xl font-semibold m-5 text-center">
                          {translations.assignAccess} “{roomTitle}”
                        </h3>{" "}
                      </div>

                      {/* Dynamically added blocks for Devices */}
                      <div className="grid grid-cols-4 gap-2 justify-center items-center p-3">
                        {users.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 cursor-pointer"
                            onClick={() => toggleSelected(device.name)} // Toggle selected on click
                          >
                            <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                              <img
                                src=""
                                alt=""
                                className="border border-black rounded-lg mb-4 mx-auto"
                                style={{ height: "100px", width: "100px" }}
                              />
                              <div className="relative w-full">
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{device.name}</div>
                                </div>

                                {/* Green Check Mark for Selected Devices */}
                                {selectedDevices.includes(device.name) && (
                                  <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                    <i className="fas fa-check"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Message if no users */}
                        {users.length === 0 && (
                          <p className="text-gray-500 col-span-4 text-center">
                            {translations.noUsersMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Next Button */}
                    <Link
                      to={`/rooms/access`} // Use the input value in the link
                      className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center ${
                        selectedDevices.length === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`} // Disable button if no users are selected
                    >
                      {translations.nextStep}
                    </Link>
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

export default RoomsNewAccessPage;
