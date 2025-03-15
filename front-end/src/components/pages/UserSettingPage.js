import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function UserSettingPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  //Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const [selectedLang, setSelectedLang] = useState("");
  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLang(lang);
    setLanguage(lang);
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Handle log out
  const logOut = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      alert("Logout Successfully!");
      localStorage.setItem("started", "false");
    } else {
      localStorage.setItem("started", "false"); // Save flag
    }
    window.location.reload();
  };

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

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Setting Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/profile">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-4%]">
                  {translations.settingsTitle}
                </h1>
              </div>

              {/* Main Content Section */}
              <div className="flex flex-col flex-1">
                {/* Language Dropdown */}
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                  <label htmlFor="language" className="block font-bold mb-2">
                    {translations.switchLanguage}:
                  </label>
                  <select
                    id="language"
                    value={selectedLang}
                    onChange={handleLanguageChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="" disabled>
                      {translations.selectLanguage}{" "}
                      {/* Add this key in your translations */}
                    </option>
                    <option value="zh">{translations.zh}</option>
                    <option value="ja">{translations.ja}</option>
                    <option value="en">{translations.en}</option>
                    <option value="ko">{translations.ko}</option>
                    <option value="ms">{translations.ms}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                {/* <a
                  href="/profile/languages"
                  className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">{translations.languages}</span>
                </a> */}

                <div
                  onClick={() => handleNavigation("#")}
                  className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">
                    {translations.notifications}
                  </span>
                </div>

                <div
                  onClick={() => handleNavigation("#")}
                  className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">
                    {translations.helpAndFeedback}
                  </span>
                </div>

                <div
                  onClick={() => handleNavigation("#")}
                  className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">{translations.security}</span>
                </div>

                <div
                  onClick={() => handleNavigation("#")}
                  className="rounded-md border border-gray-500 bg-white p-4 mt-4 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">{translations.privacy}</span>
                </div>

                <div
                  onClick={logOut}
                  className="rounded-md border border-gray-500 bg-white p-4 mt-12 flex items-center justify-center text-center text-lg w-[96%]"
                >
                  <span className="font-bold">{translations.logOut}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSettingPage;
