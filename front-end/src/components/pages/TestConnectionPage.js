import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function TestConnectionPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // State for connection status
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const { name } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted", { isConnected });
    navigate(`/devices`);
  };

  const handleTestConnectivity = () => {
    // Simulate testing connectivity
    setTimeout(() => {
      setIsConnected(true); // Set connection status to successful
    }, 1000); // Simulated delay
  };

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
                  <a className="relative pl-4" href="/devices/new">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {translations.testConnection1} {name} {translations.testConnection2}
                  </h1>
                </div>

                {/* ==================== */}
                <form onSubmit={handleSubmit}>
                  <div className="rounded-lg border border-gray-300 bg-white">
                    <div className="grid grid-rows-[auto] p-4 flex justify-center items-center gap-4">
                      <div className="mb-9">
                        <p className="md:text-lg font-semibold">
                          {translations.step1}
                        </p>
                        <p className="md:text-lg font-semibold">
                          {translations.step2}
                        </p>
                        <p className="md:text-lg font-semibold">
                          {translations.step3}
                        </p>
                        <p className="md:text-lg font-semibold">
                          {translations.step41} “{name}” {translations.step42}
                        </p>
                        <p className="md:text-lg font-semibold">
                          {translations.step5}
                        </p>
                      </div>

                      {/* Test Connectivity Button */}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleTestConnectivity} // Call the test connectivity function
                          className="px-6 py-2 bg-gray-200 text-lg font-semibold rounded-md"
                        >
                          {translations.testConnectivity}
                        </button>
                      </div>

                      {/* Display Connection Status */}
                      {isConnected && (
                        <div className="flex justify-center">
                          <p className="text-green-500 text-lg font-semibold">
                            {translations.connectionSuccessful}
                          </p>
                        </div>
                      )}

                      {/* Done Button - Shown only if isConnected is true */}
                      {isConnected && (
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white text-lg font-semibold rounded-md"
                          >
                            {translations.done}
                          </button>
                        </div>
                      )}
                    </div>
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

export default TestConnectionPage;
