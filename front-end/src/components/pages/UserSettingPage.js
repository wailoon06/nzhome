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
  const [logoutMessage, setlogoutMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const logOut = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      // alert("Logout Successfully!");
      setlogoutMessage("Logout Successful! Redirecting...");
      localStorage.setItem("started", "false");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }, 3000);;

    } else {
      localStorage.setItem("started", "false"); // Save flag
    }

    setTimeout(() => {//new added
      setlogoutMessage("");
      navigate("/login"); // Redirect after message disappears
    }, 3000);

  };

  // feedback
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    // if (!message.trim()) return alert("Message cannot be empty");
    if (!message.trim()) {

      setErrorMessage("Message cannot be empty");
      setTimeout(() => {
        setErrorMessage("");
        // window.location.reload();
      }, 3000);
      setIsLoading(true);
      return;

    }

    
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        // alert("Message posted successfully!");
        // setMessage("");
        // setIsOpen(false);
        // Show success message(added)
      setSuccessMessage("Message posted successfully!");
      
      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
        // window.location.reload();
      }, 3000);

      } else {
        // alert("Failed to post message");
        setErrorMessage("Failed to post message");//added
        
        setTimeout(() => {//added
          localStorage.clear();
          setErrorMessage("");
          // window.location.reload();
        }, 5000);
      }
    } catch (error) {
      // alert("An error occurred: " + error.message);
      setErrorMessage("An error occurred: " + error.message);//added
        
      setTimeout(() => {//added
        localStorage.clear();
        setErrorMessage("");
      }, 5000);
    }
    setIsLoading(false);
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

        {logoutMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out">
          {logoutMessage}
        </div>  
        )}

        {/* Success Message Display (added) */}
        {successMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-[10000]">
            {successMessage}
          </div>
        )}

        {/* Error Message Display (added) */}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-[10000]">
            {errorMessage}
          </div>
        )}

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
                    <a href="/notification" className="font-bold">
                      {translations.notifications}
                    </a>
                  </div>

                  <div className="w-[96%] mt-4 p-2 border border-gray-500 rounded-md bg-white text-center">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="px-4 py-2 font-bold text-lg w-full"
                    >
                      {translations.helpfeed}
                    </button>
                    {isOpen && (
                      <div className="mt-4 flex flex-col items-center w-full">
                        <textarea
                          className="w-full max-w-lg p-2 border rounded-md teal-text"
                          rows="4"
                          placeholder={translations.typemess}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <button
                          onClick={handleSubmit}
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md w-full max-w-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? translations.posting : translations.postmess}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* <div
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
                </div> */}

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
    </div>
  );
}

export default UserSettingPage;
