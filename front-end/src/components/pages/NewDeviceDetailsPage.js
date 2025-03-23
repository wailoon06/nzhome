import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function NewDeviceDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const code = ["12345"];
  const [serialCode, setSerialCode] = useState("");
  const [isValid, setIsValid] = useState(null); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  const toggleSwitch = () => {
    setIsSwitchOn((prevState) => !prevState);
  };

  const { name, type } = useParams();

  // Handle the check validity button click
  const handleCheckValidity = (e) => {
    e.preventDefault();  

    if (code.includes(serialCode.trim())) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  useEffect(() => {
    const fetchRoomList = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getAllRoomName",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRoomList(response.data.roomName);
      } catch (err) {
        if (err.response.status === 403) {
          console.log("Session expired!");
          // alert("Session expired!");
          // localStorage.removeItem("token");
          // localStorage.removeItem("selectedDevice");
          // navigate("/login");
          setErrorMessage("Session expired. Please log in again.");//added
        
          setTimeout(() => {//added
            localStorage.removeItem("token");
            localStorage.removeItem("selectedDevice");
            navigate("/login");
          }, 5000);
        }

        // setError("An unexpected error occurs");
        setErrorMessage("An unexpected error occurred. Please try again.");//added
      } finally {
        setLoading(false);
      }
      setTimeout(() => {//added
        setErrorMessage("");
      }, 5000);
    };

    fetchRoomList();
  }, [navigate]);
  
  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const selectedDevice = JSON.parse(localStorage.getItem('selectedDevice'));

      const response = await axios.post(
      "http://localhost:8080/api/addDevice",
      { 
        deviceName: selectedDevice.name, 
        categoryName: selectedDevice.category, 
        roomName: selectedRoom,
        picture: selectedDevice.img
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }  
      }
      );
      
      // alert("Successfully created!");
      // localStorage.removeItem("selectedDevice");
      // navigate(`/devices/new/${name}/test`);
      // Show success message(added)
      setSuccessMessage("Device successfully added!");
      
      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
        localStorage.removeItem("selectedDevice");
        navigate(`/devices/new/${name}/test`);
      }, 3000);  

    } catch (err) {
      if (err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");//added
        
        setTimeout(() => {//added
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
      setErrorMessage("An unexpected error occurred. Please try again.");//added
    } finally {
      setLoading(false);
    }
    setTimeout(() => {//added
      setErrorMessage("");
    }, 5000);
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
                    {name}
                  </h1>
                </div>

                {/* Serial code */}
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-rows-[auto,1fr] p-4 mt-2 gap-4 rounded-lg bg-white"
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-between">
                    {/* Label */}
                    <span className="text-lg font-medium text-gray-700">
                      {translations.enter_device_unique_serial_code}
                    </span>

                    {/* Input */}
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg p-2 ml-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={translations.enter_serial_code}
                      value={serialCode}
                      onChange={(e) => {
                        setSerialCode(e.target.value);
                        setIsValid(code.includes(e.target.value.trim())); // Validate instantly
                      }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 flex items-center justify-between">
                    {/* Label */}
                    <span className="text-lg font-medium text-gray-700">
                      {translations.select_which_space_to_add_to}
                    </span>

                    {/* Dropdown */}
                    <select
                      className="ml-5 border border-gray-300 rounded-lg p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                    >
                      <option value="" disabled>
                        {translationsMap.en.select}
                      </option>
                      {loading ? (
                        <option value="" disabled>
                          Loading...
                        </option>
                      ) : roomList.length > 0 ? (
                        roomList.map((room) => (
                          <option key={room} value={room}>
                            {room}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No Rooms Found
                        </option>
                      )}
                      {/* <option value="" disabled>
                        {translations.select}
                      </option>
                      {[
                        `${translations.living_room}`,
                        `${translations.kitchen}`,
                        `${translations.bedroom}`,
                        `${translations.bathroom}`,
                        `${translations.garage}`,
                      ].map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))} */}
                    </select>
                  </div>

                  <div className="flex justify-center items-center h-full w-full">
                    <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] border border-gray-300 rounded-lg bg-white p-4 w-[40%] flex items-center justify-between">
                      {/* Label */}
                      <button
                        onClick={handleCheckValidity}
                        className="text-lg font-medium text-gray-700"
                      >
                        {translations.check_validity}
                      </button>

                      {/* Switch */}
                      {/* <div className="text-green-700 w-full h-full flex items-center justify-center">
                        {translations.valid}
                      </div> */}
                      <div
                        className={`w-full h-full flex items-center justify-center text-lg font-medium ${
                          isValid === null
                            ? "text-gray-500"
                            : isValid
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {isValid === null
                          ? ""
                          : isValid
                          ? translations.valid
                          : "Invalid"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 gap-4 flex justify-end">
                    <button
                      type="submit"
                      className={`rounded-lg text-sm sm:text-base w-full mb-2 text-center sm:w-[15%] md:w-[15%] h-[3rem] flex justify-center items-center ${
                        isValid ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      }`}
                      disabled={!isValid}
                    >
                      <div className="text-1xl text-white">{translations.done}</div>
                    </button>
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

export default NewDeviceDetailsPage;
