import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

function UserProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [rows, setRows] = useState([{ username: "", email: "", password: "" }]);

  const addRow = () => {
    setRows([...rows, { username: "", email: "", password: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty entries
    const filteredRows = rows.filter(
      (row) => row.username && row.email && row.password
    );

    console.log("Submitted data:", filteredRows);
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
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-rows-[auto] gap-4 text-center items-center justify-center">
                  {rows.map((row, index) => (
                    <div key={`row-${index}`} className="flex flex-col gap-2">
                      <input
                        className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                        type="text"
                        placeholder={translations.enterUserNameForRow.replace(
                          "{index}",
                          index + 1
                        )}
                        value={row.username}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index] = {
                            ...newRows[index],
                            username: e.target.value,
                          };
                          setRows(newRows);
                        }}
                      />
                      <input
                        className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                        type="email"
                        placeholder={translations.enterEmailForRow.replace(
                          "{index}",
                          index + 1
                        )}
                        value={row.email}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index] = {
                            ...newRows[index],
                            email: e.target.value,
                          };
                          setRows(newRows);
                        }}
                      />
                      <input
                        className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                        type="password"
                        placeholder={translations.enterPasswordForRow.replace(
                          "{index}",
                          index + 1
                        )}
                        value={row.password}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index] = {
                            ...newRows[index],
                            password: e.target.value,
                          };
                          setRows(newRows);
                        }}
                      />
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      onClick={addRow}
                      className="fas fa-plus text-center rounded-lg border border-gray-500 bg-white p-4 flex items-center justify-center w-12 h-12"
                    ></button>
                  </div>
                </div>
                {/* <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-4 rounded-lg"
                  >
                    Submit
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
