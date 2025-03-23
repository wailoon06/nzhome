import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useEffect } from "react";

function VacuumBotsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { id, name } = useParams();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const navigate = useNavigate();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [robotDetails, setRobotDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [errorMessage, setErrorMessage] = useState("");     //added

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
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 5000);
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
    if (deviceDetails.length > 0) {
      const robots = deviceDetails.filter(device => device.deviceid === parseInt(id, 10));
      setRobotDetails(robots);
    }
  }, [deviceDetails]);

  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Handle Start/Resume button click
  const handleStartResume = () => {
    setIsRunning(true);
    setHasStarted(true); // Mark that the timer has started at least once
  };

  // Handle Stop button click
  const handleStop = () => {
    setIsRunning(false);
  };

  // Handle Reset button click
  const handleReset = () => {
    setElapsedTime(0);
    setIsRunning(false);
    setHasStarted(false); // Reset the "has started" state
  };

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
         <div className="relative flex">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
          </div>

          {/* Error Message Display (added)*/}
          {errorMessage && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
              {errorMessage}
            </div>
          )}

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
                      <a className="relative pl-4" href="/">
                        <i className="fa fa-2x fa-arrow-left"></i>
                      </a>
                      <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                        {name}  ({robotDetails[0]?.room?.roomName || "Unknown Room"})
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
                                  {formatTime(elapsedTime)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        <div className="grid grid-cols-1 md:grid-cols-2">
                        <button
                          onClick={handleStartResume}
                          disabled={isRunning} // Disable when running
                          className={`font-bold rounded-md border border-gray-300 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%] 
                            ${isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
                        >
                          {hasStarted ? translations.resume : "Start"}
                        </button>
                          <button
                            onClick={handleStop}
                            className="font-bold rounded-md border border-gray-300 bg-red-500 p-4 mt-4 flex items-center justify-center text-center text-lg w-[92%]"
                          >
                            {translations.stop}
                          </button>
                          <button
                            onClick={handleReset}
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
