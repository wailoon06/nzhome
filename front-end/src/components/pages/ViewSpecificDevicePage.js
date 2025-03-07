import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function ViewSpecificDevicePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { date } = useParams();

  const aircon = [{ name: "DaikinAC" }, { name: "SamsungAC" }];
  const TV = [{ name: "SonyTV" }, { name: "SamsungTV" }];

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
              {/* Main Content */}
              <div
                className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
              >
                <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
                  {/* Main Content */}
                  <div className="flex flex-col flex-1">
                    {/* Setting Section */}
                    <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                      <a className="relative pl-4" href="/devices">
                        <i className="fa fa-2x fa-arrow-left"></i>
                      </a>
                      <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                        {translations.view_specific_devices}
                      </h1>
                    </div>

                    <div className="grid grid-rows-[auto,1fr] gap-4 mt-[5%]">
                      {/* Air Conditioner Brand */}
                      <div className="text-left font-medium text-lg ml-6">
                        {translations.airConditionerBrand}
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {aircon.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/electric/${date}/${device.name}/report`}
                              className="w-full"
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src=""
                                  alt=""
                                  className="border border-black rounded-lg mb-4 mx-auto"
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

                    <div className="grid grid-rows-[auto,1fr] gap-4">
                      {/* Air Conditioner Brand */}
                      <div className="text-left font-medium text-lg mt-6 ml-6">
                        {translations.televisionBrand}
                      </div>

                      {/* Main Content Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center p-3">
                        {/* Dynamically added blocks */}
                        {TV.map((device) => (
                          <div
                            key={device.name}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3"
                          >
                            <Link
                              to={`/devices/new/${device.name}`}
                              className="w-full"
                            >
                              <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                                <img
                                  src=""
                                  alt=""
                                  className="border border-black rounded-lg mb-4 mx-auto"
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

export default ViewSpecificDevicePage;
