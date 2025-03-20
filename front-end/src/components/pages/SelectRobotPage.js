import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function SelectRobotPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const navigate = useNavigate();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [robotDetails, setRobotDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get device
  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("API Response:", response);

      // if (!response.data) {
      //   throw new Error("Invalid API response: No data found");
      // }

      setDeviceDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  },[]);

  useEffect(() => {
    const robots = deviceDetails.filter(device => device.category?.categoryName === "Vacuum");
    setRobotDetails(robots);
  }, [deviceDetails]);

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

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Setting Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-4%]">
                  {translations.selectRobot}
                </h1>
              </div>

              {/* Main Content Section */}

              <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-2 justify-center items-center p-3">
                {/* Dynamically added blocks */}
                <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                  {robotDetails.map((robot) => (
                    <Link to={`/robots/${robot.category.categoryName}/${robot.deviceid}/${robot.deviceName}`}>
                      <div className="grid sm:grid-cols-1 items-center gap-4">
                        <img
                          src={robot.picture}
                          alt=""
                          className="border border-black rounded-lg mb-4 mx-auto"
                          style={{ height: "100px", width: "100px" }}
                        />
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">{robot.deviceName} ({robot.room.roomName})</div>
                          <div className="text-2xl w-full mb-2 bg-red-500 rounded-full text-white inline-block">
                            {translations.offline}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>{" "}
                {/* More blocks will automatically adjust */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectRobotPage;
