import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function VacuumBotsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { name } = useParams();

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
                      <a className="relative pl-4" href="/profile">
                        <i className="fa fa-2x fa-arrow-left"></i>
                      </a>
                      <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                        {name} {translations.vacuumBot}
                      </h1>
                      <a href="/">
                        <i class="fas fa-plus text-2xl"></i>
                      </a>
                    </div>

                    {/* Main Content Section */}
                    <div className="grid grid-rows-2 md:grid-cols-1 lg:grid-cols-2 flex flex-col items-center justify-center">
                      <div className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]">
                        <img
                          src="https://raw.githubusercontent.com/Tasshack/dreame-vacuum/master/docs/media/map_mijia_light.png"
                          alt="eg"
                          className="w-[70%] md:w-[60%]"
                        ></img>
                      </div>
                      <div className="grid grid-rows-2">
                        <div className="grid grid-cols-1">
                          <div className="font-bold rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]">
                            {translations.operationTime}
                          </div>{" "}
                          <div className="rounded-lg border-[2px] border-gray-300 bg-white p-4 mt-4 flex items-center justify-center text-center w-[96%]">
                            <div className="grid grid-cols-[.4fr,1fr] sm:grid-cols-[.5fr,1fr] items-center gap-4">
                              <i className="fas fa-clock text-[3rem]" />
                              <div className="teal-text text-sm sm:text-base w-full mb-2 text-center mt-2">
                                <div className="text-[1.4rem] w-full mb-2">
                                  1 Hour 2 Minutes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-green-500 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            {translations.resume}
                          </button>{" "}
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-red-500 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            {translations.stop}
                          </button>
                          <button
                            type="submit"
                            className="font-bold rounded-md border border-gray-300 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            {translations.goHome}
                          </button>{" "}
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
    </div>
  );
}

export default VacuumBotsPage;
