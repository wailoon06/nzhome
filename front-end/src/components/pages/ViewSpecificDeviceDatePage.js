import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function ViewSpecificDeviceDatePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [selectedDate, setSelectedDate] = useState(null); // Manage date state

  localStorage.setItem("date", selectedDate);
  
  const formatDateToLocal = (date) => {
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000); // Adjust to local time
    return localDate.toISOString().split("T")[0]; // Format as yyyy-MM-dd
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
                  <a className="relative pl-4" href="/calendar">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    {translations.choose_date}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4">
                  <div className="container-calendar grid grid-cols-1 gap-4">
                    {/* Right Section - DatePicker */}
                    <div
                      id="right"
                      className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <div className="calendar-wrapper">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)} // Update the state
                          inline
                          dateFormat="yyyy-MM-dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <Link
                        to={`/electric/${
                          selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                        }/devices`}
                        className={`${
                          selectedDate ? "" : "pointer-events-none opacity-50"
                        }`}
                      >
                        <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col p-3">
                          <div className="items-center gap-4">
                            <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                              <div className="mb-2">
                                {translations.view_specific_devices}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
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

export default ViewSpecificDeviceDatePage;
