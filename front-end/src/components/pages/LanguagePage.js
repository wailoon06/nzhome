import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";

function LanguagePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // translations
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

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
            <div className="flex justify-between items-center relative">
              <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
                {/* Hamburger Button */}
                <div
                  className={`flex items-center ${
                    isCollapsed ? "block" : "hidden"
                  }`}
                >
                  <button
                    onClick={toggleSidebar}
                    className="text-white text-2xl bg-transparent border-0 mr-4"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>

                {/* Centered Text */}
                <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
                  {translations.title}
                </h1>

                {/* User Icon */}
                <a href="#" className="mr-8">
                  <i className="fas fa-user text-white text-3xl"></i>
                </a>

                {/* Bell Icon */}
                <a href="#" className="ml-auto">
                  <i className="fas fa-bell text-white text-3xl"></i>
                </a>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Setting Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full">
                  {translations.switchLanguage}
                </h1>
              </div>

              {/* Options */}
              <div className="grid grid-rows-4 mt-4">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white p-4 mb-4">
                  <span className="font-bold">{translations.zh} </span>
                  <button
                    onClick={() => setLanguage("zh")}
                    className="ml-auto text-blue-500"
                  >
                    {translations.switchLanguage}
                  </button>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg bg-white p-4 mb-4">
                  <span className="font-bold">{translations.ja} </span>
                  <button
                    onClick={() => setLanguage("ja")}
                    className="ml-auto text-blue-500"
                  >
                    {translations.switchLanguage}
                  </button>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg bg-white p-4 mb-4">
                  <span className="font-bold">{translations.en} </span>
                  <button
                    onClick={() => setLanguage("en")}
                    className="ml-auto text-blue-500"
                  >
                    {translations.switchLanguage}
                  </button>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg bg-white p-4 mb-4">
                  <span className="font-bold">{translations.ko} </span>
                  <button
                    onClick={() => setLanguage("ko")}
                    className="ml-auto text-blue-500"
                  >
                    {translations.switchLanguage}
                  </button>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg bg-white p-4 mb-4">
                  <span className="font-bold">{translations.ms} </span>
                  <button
                    onClick={() => setLanguage("ms")}
                    className="ml-auto text-blue-500"
                  >
                    {translations.switchLanguage}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguagePage;
