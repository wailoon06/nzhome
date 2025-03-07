import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function UserProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [rows, setRows] = useState([]);
  const addRow = () => {
    setRows([...rows, ""]); // Add an empty string to rows for new input field
  };

  // translations
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
            <div className="flex flex-col flex-1">
              {/* Profile Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/profile">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.addUser}
                </h1>
              </div>

              {/* Add User */}
              <div className="grid grid-rows-[auto] mt-4 gap-4 flex text-center items-center">
                {rows.map((row, index) => (
                  <div key={index}>
                    <input
                      className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                      type="text"
                      placeholder={translations.enterEmailForRow.replace(
                        "{index}",
                        index + 1
                      )} // Dynamic translations
                      value={row} // Bind the input value to the 'row'
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index] = e.target.value; // Update specific row
                        setRows(newRows);
                      }}
                    />
                  </div>
                ))}

                {/* Add a wrapper div to center the button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addRow} // Add new row
                    className="fas fa-plus text-center rounded-lg border border-gray-500 bg-white p-4 flex items-center justify-center w-12 h-12"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
