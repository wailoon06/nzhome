import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

import WidgetsEnergy from "./components/widgetsEnergy";
import RoomsRobots from "./components/roomsRobots";
import Devices from "./components/devices";
import Users from "./components/users";

import RoomPage from "./components/pages/RoomPage";
import DeviceDetailsPage from "./components/pages/DeviceDetailsPage";
import UserPage from "./components/pages/UserPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import LanguagePage from "./components/pages/LanguagePage";
import AddUserPage from "./components/pages/AddUserPage";
import InternetUsagePage from "./components/pages/InternetUsagePage";
import ElectricUsagePage from "./components/pages/ElectricUsagePage";
import UserSettingPage from "./components/pages/UserSettingPage";
import AllUserPage from "./components/pages/AllUserPage";
import ChangePasswordPage from "./components/pages/ChangePasswordPage";
import SelectRobotPage from "./components/pages/SelectRobotPage";
import VacuumBotsPage from "./components/pages/VacuumBotsPage";
import NotificationPage from "./components/pages/NotificationPage";
import ActionSchedulePage from "./components/pages/ActionSchedulePage";
import LODevicesPage from "./components/pages/LODevicesPage";
import AddNewDevicePage from "./components/pages/AddNewDevicePage";
import NewDeviceDetailsPage from "./components/pages/NewDeviceDetailsPage";
import TestConnectionPage from "./components/pages/TestConnectionPage";
import CameraPage from "./components/pages/CameraPage";
import AllRoomPage from "./components/pages/AllRoomPage";
import CalendarPage from "./components/pages/CalendarPage";
import CalendarReport from "./components/pages/calendarReport";
import RoomsNewPage from "./components/pages/RoomsNewPage";
import RoomsNewAccessPage from "./components/pages/RoomsNewAccessPage";
import ViewSpecificDevicePage from "./components/pages/ViewSpecificDevicePage";
import ViewSpecificDeviceDatePage from "./components/pages/ViewSpecificDeviceDatePage";
import ViewSpecificDeviceReportPage from "./components/pages/ViewSpecificDeviceReportPage";
import RoomsDevicesPage from "./components/pages/RoomsDevicesPage";
import RoomEnergyUsagePage from "./components/pages/RoomEnergyUsagePage";
import RoomDeviceSetActionPage from "./components/pages/RoomDeviceSetActionPage";

import translationsMap from "./components/locales/translationsMap";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // const handleReturnGetStarted = () => {
  //   localStorage.setItem("started", "false"); // Save flag
  //   window.location.reload();
  // };

  // Handle log out
  const [logoutMessage, setlogoutMessage] = useState("");

  const logOut = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      localStorage.removeItem('token');
      // alert("Logout Successfully!");
      setlogoutMessage("Logout Successful! Redirecting...");
      localStorage.setItem("started", "false");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 3000);;
    } else {
      localStorage.setItem("started", "false"); // Save flag
    }
    setTimeout(() => {//new added
      setlogoutMessage("");
      navigate("/login"); // Redirect after message disappears
    }, 3000);
  }

  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    
    try {
      // Get token
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/getUserDetails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserDetails(response.data);
  
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.message || 'Failed to load user details');
      
      // Handle token expiration or authentication issues
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // Token expired or invalid - redirect to login
        console.log("Session expired!");
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Routes>
      {/* Routes that require a full layout */}
      <Route
        path="/"
        element={
          <div className="baseBG p-2 grid grid-cols-[auto_1fr] h-full">
            <div className="relative flex">
              {/* Sidebar */}
              <div
                className={`sidebar ${isCollapsed ? "w-[0px]" : "w-[100px]"} ${
                  isCollapsed ? "" : "baseGreen"
                } rounded-lg min-h-full flex flex-col overflow-y-auto`}
              >
                {/* Sidebar Logo */}
                <div className="h-[100px] flex items-center justify-center pt-10">
                  <a href="/">
                    <img
                      src="./image/NZHome2.png"
                      alt="NZ Home Logo"
                      className={`${isCollapsed ? "hidden" : "block"}`}
                    />
                  </a>
                </div>
                {/* Sidebar Items */}
                <a href="/devices">
                  <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                    <i
                      className={`fas fa-layer-group text-white text-2xl ${
                        isCollapsed ? "hidden" : "block"
                      }`}
                    ></i>
                    {!isCollapsed && (
                      <span className="text-white text-center text-sm mt-2">
                        {translations.devices}
                      </span>
                    )}
                  </div>
                </a>
                <a href="/electric">
                  <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                    <i
                      className={`fas fa-bolt text-white text-2xl ${
                        isCollapsed ? "hidden" : "block"
                      }`}
                    ></i>
                    {!isCollapsed && (
                      <span className="text-white text-center text-sm mt-2">
                        {translations.electricalUsage}
                      </span>
                    )}
                  </div>
                </a>
                <a href="/internet">
                  <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                    <i
                      className={`fas fa-chart-pie text-white text-2xl ${
                        isCollapsed ? "hidden" : "block"
                      }`}
                    ></i>
                    {!isCollapsed && (
                      <span className="text-white text-center text-sm mt-2">
                        {translations.internetUsage}
                      </span>
                    )}
                  </div>
                </a>
                <a href="/calendar">
                  <div className="flex flex-col items-center justify-center px-4 py-2 pt-8">
                    <i
                      className={`fas fa-wind text-white text-2xl ${
                        isCollapsed ? "hidden" : "block"
                      }`}
                    ></i>
                    {!isCollapsed && (
                      <span className="text-white text-center text-sm mt-2">
                        {translations.calendar}
                      </span>
                    )}
                  </div>
                </a>

                <button
                  onClick={logOut}
                  className="mt-auto mb-[20%]"
                >
                  <div className="flex flex-col items-center justify-center px-4 py-2">
                    <i
                      className={`fas fa-sign-out-alt text-white text-2xl ${
                        isCollapsed ? "hidden" : "block"
                      }`}
                    ></i>
                  </div>
                </button>
              </div>

              {/* Collapse Button */}
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
                  isCollapsed ? "left-[0px]" : "left-[80px]"
                }`}
              >
                <button
                  onClick={toggleSidebar}
                  className={`text-white text-2xl baseGreen p-2 rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
                    isCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  <i
                    className={`fas ${
                      isCollapsed ? "fa-chevron-left" : "fa-chevron-left"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            {logoutMessage && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-[2000]">
              {logoutMessage}
            </div>
            )}

            {/* Main Content */}
            <div className="main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto">
              <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
                {/* Header */}
                <div className="sticky top-0 z-[9999] ">
                  <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
                    {/* Hamburger Button */}
                    <div
                      className={`flex items-center ${
                        isCollapsed ? "block" : "hidden"
                      }`}
                    >
                      <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl bg-transparent border-0 ml-4"
                      >
                        <i className="fas fa-bars"></i>
                      </button>
                    </div>

                    {/* Centered Text */}
                    <h1 className="font-bold text-white flex-grow text-center lg:text-4xl ml-[4%] titleGold">
                      {translations.title}
                    </h1>

                    {/* User Icon */}
                    <a href="/profile" className="mr-8">
                      <i className="fas fa-user text-white text-3xl"></i>
                    </a>

                    {/* Bell Icon */}
                    <a href="/notification" className="mr-5">
                      <i className="fas fa-bell text-white text-3xl"></i>
                    </a>
                  </div>
                </div>

                {/* Main Widgets */}
                <WidgetsEnergy />
                <RoomsRobots />
                <Devices />
                <Users />
              </div>
            </div>
          </div>
        }
      />
      {/* Routes that display a blank page */}
      <Route path="/room/:name" element={<RoomPage />} />
      <Route
        path="/devices/:type/:deviceid/:name/details"
        element={<DeviceDetailsPage />}
      />
      <Route path="/user/:name" element={<UserPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/profile/languages" element={<LanguagePage />} />
      <Route path="/profile/AddUser" element={<AddUserPage />} />
      <Route path="/internet" element={<InternetUsagePage />} />
      <Route path="/electric" element={<ElectricUsagePage />} />
      <Route path="/electric/date" element={<ViewSpecificDeviceDatePage />} />
      <Route
        path="/electric/:date/devices"
        element={<ViewSpecificDevicePage />}
      />
      <Route
        path="/electric/:date/:name/report"
        element={<ViewSpecificDeviceReportPage />}
      />
      <Route path="/settings" element={<UserSettingPage />} />
      <Route path="/users" element={<AllUserPage />} />
      <Route path="/change&password" element={<ChangePasswordPage />} />
      <Route path="/robots" element={<SelectRobotPage />} />
      <Route path="/robots/vacuum/:id/:name" element={<VacuumBotsPage />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/devices" element={<LODevicesPage />} />
      <Route
        path="/devices/:type/:name/details/setAction"
        element={<ActionSchedulePage />}
      />
      <Route path="/devices/new" element={<AddNewDevicePage />} />
      <Route path="/devices/new/:name" element={<NewDeviceDetailsPage />} />
      <Route path="/devices/new/:name/test" element={<TestConnectionPage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/rooms" element={<AllRoomPage />} />
      {/* <Route path="/electric/rooms/:name" element={<AllRoomPage />} /> */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/calendar/report" element={<CalendarReport />} />
      <Route path="/rooms/new" element={<RoomsNewPage />} />
      <Route path="/rooms/:roomTitle/access" element={<RoomsNewAccessPage />} />
      <Route path="/:roomTitle/:roomid/devices" element={<RoomsDevicesPage />} />
      <Route
        path="/devices/:type/:deviceid/:name/details"
        element={<RoomEnergyUsagePage />}
      />{" "}
      <Route
        path="/rooms/summary/:roomTitle/setAction"
        element={<RoomDeviceSetActionPage />}
      />
    </Routes>
  );
}

export default App;
