import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function InternetUsagePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
            <div class="flex flex-col flex-1 gap-4">
              {/* Internet Usage Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.internetUsage}
                </h1>
              </div>
              {/* ==================== */}
              <div className="grid grid-cols-2 mt-2 gap-4">
                <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 h-full">
                  <img
                    src=""
                    alt=""
                    className="rounded-lg mb-4"
                    style={{ height: "150px", width: "140px" }}
                  />
                  <div className="teal-text text-sm sm:text-base w-full text-center mb-2">
                    {translations.network}
                  </div>
                  <div className="teal-text text-2xl sm:text-3xl lg:text-4xl w-full text-center mb-2">
                    500 Mb/s
                  </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                    <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.internet_used}</div>
                        <div className="grid grid-cols-2">
                          <div className="teal-text text-sm sm:text-base w-full mb-2">
                            {translations.today}
                          </div>
                          <div className="teal-text text-sm sm:text-base w-full mb-2">
                            {translations.monthly}
                          </div>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="teal-text text-2xl w-full mb-2">
                            2877
                          </div>
                          <div className="teal-text text-2xl w-full mb-2">
                            5742
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                    <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">
                          {translations.next_payment_date}
                        </div>
                        <div className="teal-text text-2xl w-full mb-2">
                          02/01/2025
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                {" "}
                <div className="grid grid-cols-2">
                  <img
                    src="https://www.quanthub.com/wp-content/uploads//pie_chart_employee_count-1024x633.png"
                    alt=""
                    className="rounded-lg mb-4"
                  />{" "}
                  <img
                    src="https://www.quanthub.com/wp-content/uploads//pie_chart_employee_count-1024x633.png"
                    alt=""
                    className="rounded-lg mb-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternetUsagePage;
