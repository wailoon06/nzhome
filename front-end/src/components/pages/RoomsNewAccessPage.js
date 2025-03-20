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
  const [userDetails, setUserDetails] = useState(null);
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

  // the family users
  // Handle error
  const handleApiError = (err) => {
    console.error("API Error:", err);

    if (err.response) {
      setError(err.response.data.message);

      if (err.response.status === 401) {
        console.log("Session expired!");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

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
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [navigate]);

  // select users
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleSelected = (username) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(username)
          ? prevSelected.filter((name) => name !== username) // Remove from selected
          : [...prevSelected, username] // Add to selected
    );
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
                <div className="wrapper p-4">
                  {/* Event Form */}
                  <div className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-rows-[auto] gap-4">
                    <div className="grid grid-rows-[auto]">
                      <div className="grid grid-cols-1">
                        <h3 className="text-xl font-semibold m-5 text-center">
                          {translations.assignAccess} “{roomTitle}”
                        </h3>{" "}
                      </div>

                      {/* Dynamically added blocks for Devices */}
                      <div className="grid grid-cols-4 gap-2 justify-center items-center p-3">
                        {loading && (
                          <div className="text-center py-8">
                            <p>Loading users...</p>
                          </div>
                        )}

                        {error && (
                          <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                          </div>
                        )}

                        {/* Main Content Section */}
                        {/* Main Content Section */}
                        <div className="flex flex-col items-center justify-center">
                          {!loading && !error && userDetails.length > 0
                            ? userDetails.map((user, index) => (
                                <div
                                  key={user.id || index}
                                  onClick={() => toggleSelected(user.username)}
                                  className="relative grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center justify-center text-center text-lg w-[85%] gap-4 cursor-pointer"
                                >
                                  {/* Green Check Mark for Selected Users */}
                                  {selectedUsers.includes(user.username) && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                      <i className="fas fa-check"></i>
                                    </div>
                                  )}

                                  {/* User Info */}
                                  <h2>
                                    {user.username} ({user.role})
                                  </h2>
                                  <div className="text-[14px] sm:text-2xl font-bold text-right">
                                    {user.email}
                                  </div>
                                </div>
                              ))
                            : !loading &&
                              !error && (
                                <div className="text-center py-8">
                                  <p>No users found.</p>
                                </div>
                              )}
                        </div>
                      </div>
                    </div>

                    {/* Next Button */}
                    <Link
                      to={`/rooms/devices/${roomTitle}`}
                      className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center ${
                        selectedUsers.length === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`} // Disable button if no users are selected
                    >
                      {translations.nextStep}
                    </Link>
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
