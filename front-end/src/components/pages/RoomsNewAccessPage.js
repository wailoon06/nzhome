import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function RoomsNewAccessPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Devices
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Get title
  const { roomTitle } = useParams();

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  const [userDetails, setUserDetails] = useState(null);
  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/getUserFam", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDetails(response.data);
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
    fetchAllUsers();
  }, []);

  // select users
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelected = (userid) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userid)
          ? prevSelected.filter((id) => id !== userid) // Remove from selected
          : [...prevSelected, userid] // Add to selected
    );
  };

  const handlePermissionSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const roomid = localStorage.getItem("roomid");

      const response = await axios.post(
        "http://localhost:8080/api/grantPermission",
        {
          userid: selectedUsers,
          roomid: roomid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Permission successfully granted!");
      navigate(`/${roomTitle}/${roomid}/devices/`);
      localStorage.removeItem("roomid");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.clear();
        navigate("/login");
      }
      setError("An unexpected error occurs");
    } finally {
      setLoading(false);
    }
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
                  <a className="relative pl-4" href="/rooms/new">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    {translations.roomAccessPermission}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4 flex items-center justify-center min-h-[70vh]">
                  {/* Event Form */}
                  <div className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-rows-[auto] gap-4 w-full max-w-4xl">
                    <div className="grid grid-rows-[auto]">
                      <div className="grid grid-cols-1">
                        <h3 className="text-xl font-semibold m-5 text-center">
                          {translations.assignAccess} "{roomTitle}"
                        </h3>
                      </div>

                      {/* Dynamically added blocks for Devices */}
                      <div className="grid grid-cols-1 gap-2 justify-center items-center p-3">
                        {/* Loading State - Centered and visible only when loading */}
                        {loading && (
                          <div className="text-center py-12 w-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                            <p className="text-gray-600 font-medium">Loading users...</p>
                          </div>
                        )}

                        {/* Error Message - Only visible when there's an error */}
                        {error && (
                          <div className="text-center py-12 w-full bg-red-50 rounded-lg border border-red-200">
                            <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-3"></i>
                            <p className="text-red-500">Error loading users. Please try again.</p>
                          </div>
                        )}

                        {/* User Selection Container - Only visible when not loading and no error */}
                        {!loading && !error && (
                          <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <i className="fas fa-users text-blue-500 mr-3"></i>
                                <h2 className="text-lg font-medium text-gray-800">
                                  Select Users
                                </h2>
                              </div>
                              <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                                {selectedUsers.length} selected
                              </div>
                            </div>

                            {/* Search Bar */}
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search by name, email or role..."
                                  className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                              </div>
                            </div>

                            {/* User List */}
                            <div className="p-3 max-h-[60vh] overflow-y-auto">
                              {/* Main Content Section */}
                              <div className="flex flex-col items-center justify-center w-full">
                                {userDetails.length > 0 ? (
                                  userDetails.map((user, index) => (
                                    <div
                                      key={user.id || index}
                                      onClick={() => toggleSelected(user.userid)}
                                      className={`relative grid grid-cols-[auto,1fr,auto] rounded-lg border p-4 mb-3 items-center w-full gap-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        selectedUsers.includes(user.userid)
                                          ? "border-green-500 bg-green-50"
                                          : "border-gray-200 bg-white hover:border-blue-300"
                                      }`}
                                    >
                                      {/* User Avatar Circle */}
                                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-medium">
                                        {user.username.charAt(0).toUpperCase()}
                                      </div>

                                      {/* User Info */}
                                      <div className="flex flex-col">
                                        <div className="font-medium text-gray-900">
                                          {user.username}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 mr-2">
                                            {user.role}
                                          </span>
                                          <span className="hidden sm:inline">
                                            {user.email}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Email (visible only on mobile) */}
                                      <div className="text-sm text-gray-600 sm:hidden truncate max-w-[120px]">
                                        {user.email}
                                      </div>

                                      {/* Selection Indicator */}
                                      <div
                                        className={`flex items-center justify-center transition-opacity duration-200 ${
                                          selectedUsers.includes(user.userid)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      >
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                          <i className="fas fa-check text-white text-xs"></i>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8 w-full bg-gray-50 rounded-lg border border-gray-200">
                                    <i className="fas fa-users text-gray-300 text-4xl mb-2"></i>
                                    <p className="text-gray-500">No users found.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next Button - Only visible when not loading and users are available */}
                    {!loading && !error && (
                      <button
                        onClick={handlePermissionSubmit}
                        className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center`}
                      >
                        {translations.nextStep}
                      </button>
                    )}
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

export default RoomsNewAccessPage;
