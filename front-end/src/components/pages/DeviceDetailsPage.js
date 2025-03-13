import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function DeviceDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { name, type } = useParams();
  const deviceImages = {
    "Xiaomi Vacuum": "/image/xiaomi.jpeg",
    "Samsung TV": "/image/samsung.jpeg",
    "Philips Hue": "/image/light.jpeg",
    "LG Speaker": "/image/speaker.jpeg",
    "Nest Thermostat": "/image/thermostats.jpeg"
  };
  const deviceImage = deviceImages[name];


  // translation
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
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {name} ({type})
                  </h1>
                </div>

                {/* ==================== */}
                <div className="grid grid-rows-[auto,1fr] mt-2 gap-4 rounded-lg bg-white">
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                          <img
                            src= {deviceImage}
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="text-2xl w-full mb-2 rounded-full text-white inline-block bg-red-500">
                              {translations.offline}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        <img
                          alt="eg"
                          src="https://www.excel-easy.com/examples/images/line-chart/line-chart.png"
                        ></img>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-2 p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.today}</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>{" "}
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.today}</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.today}</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          10.5 kWh
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <Link
                    key={name}
                    to={`/devices/${type}/${name}/details/setAction`}
                  >
                    <div className="p-4 gap-4 flex justify-center items-center">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-black items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                        <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="text-2xl text-white">
                            {translations.set_action}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetailsPage;
