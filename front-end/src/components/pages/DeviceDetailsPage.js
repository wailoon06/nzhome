import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DeviceDetailsPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Handle error
  const handleApiError = (err) => {
    console.error("API Error:", err);

    if (err.response) {
      setError(err.response.data.message);

      if (err.response.status === 401) {
        console.log("Session expired!");
        // localStorage.removeItem("token");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again."); //added

        setTimeout(() => {
          //added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          navigate("/login");
        }, 5000);
      }
    } else {
      setError("An unexpected error occurred. Please try again."); //added
    }

    setTimeout(() => {
      //added
      setErrorMessage("");
    }, 5000);
  };

  const [userRole, setUserRole] = useState("");
  const fetchUserRole = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://humdrum-beef-production.up.railway.app/api/getUserDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserRole(response.data.role);
    } catch (err) {
      if (err.response.status === 403) {
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
    fetchUserRole();
  }, []);

  const { deviceid, name, type } = useParams();
  const [deviceDetails, setDeviceDetails] = useState([]);

  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://humdrum-beef-production.up.railway.app/api/getDeviceDetails",
        { deviceid: deviceid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeviceDetails(response.data);
    } catch (err) {
      if (err.response.status === 403) {
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
  }, []);

  // Get all users
  // Get users with permission (show)
  // Filter users without permission with all users and users with permission (show)
  // Grant permission for selected users (post)

  const [userDetails, setUserDetails] = useState([]); // All users in the family
  const [userWithPermission, setUserWithPermission] = useState([]); // Users with permission
  const [usersWithoutPermission, setUserWithoutPermission] = useState([]); // Users without permission
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users to grant permission

  // Get all users in family (userid)
  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://humdrum-beef-production.up.railway.app/api/getUserFam", {
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
    fetchUserDetails();
  }, []);

  // Get users with permission (userId)
  const fetchUserWithPermission = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://humdrum-beef-production.up.railway.app/api/getUserWithDevicePermission",
        {
          deviceid: deviceid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserWithPermission(response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get users without permission
  useEffect(() => {
    if (userDetails.length > 0 && userWithPermission.length > 0) {
      const withoutPermission = userDetails.filter(
        (user) =>
          !userWithPermission.some(
            (permUser) => permUser.userId === user.userid
          )
      );
      setUserWithoutPermission(withoutPermission);
    }
  }, [userDetails, userWithPermission]);

  // Selected users for permission granting
  const toggleUserSelection = (userid) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userid)) {
        return prevSelected.filter((id) => id !== userid);
      } else {
        return [...prevSelected, userid];
      }
    });
  };

  // Handle device permission submission
  const handlePermissionSubmit = async () => {
    if (selectedUsers.length === 0) {
      // alert("Please select at least one user");
      setErrorMessage("Please select at least one user"); //added
      setTimeout(() => {
        //added
        setErrorMessage("");
      }, 3000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://humdrum-beef-production.up.railway.app/api/grantDevicePermission",
        {
          userid: selectedUsers,
          deviceid: deviceid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // alert("Permission successfully granted!");
      // Show success message(added)
      setSuccessMessage("Permission successfully granted!");

      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setSelectedUsers([]);

      fetchUserWithPermission();

      closeAddUserModal();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.clear();
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again."); //added

        setTimeout(() => {
          //added
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
      // setError("An unexpected error occurs");
      setErrorMessage("Failed to grant permission. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWithPermission();
  }, [deviceid]);

  // Handle delete permission submission
  const handleDelete = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "https://humdrum-beef-production.up.railway.app/api/deleteDevicePermission",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            userid: [userId],
            deviceid: deviceid,
          },
        }
      );

      // alert("Permission successfully removed!");
      // Show success message(added)
      setSuccessMessage("Permission successfully removed!");

      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      fetchUserWithPermission();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.clear();
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again."); //added

        setTimeout(() => {
          //added
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
      // setError("An unexpected error occurs");
      setErrorMessage("Failed to remove permission. Please try again."); //added
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  /*------------------------------------------------------------------------------------------------------------------ */

  // Modals when open all users
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    fetchUserWithPermission();
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  // Modals when open add users
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const openAddUserModal = () => setIsAddUserOpen(true);
  const closeAddUserModal = () => setIsAddUserOpen(false);

  /*------------------------------------------------------------------------------------------------------------------ */
  const [energyDetails, setEnergyDetails] = useState([]);
  const fetchEnergyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://humdrum-beef-production.up.railway.app/api/getEnergy", {
        headers: { Authorization: `Bearer ${token}` },
        params: { deviceid: deviceid },
      });

      setEnergyDetails(response.data);
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
    fetchEnergyDetails();
  }, []);

  const transformedData = energyDetails.map((entry) => ({
    date: entry.date,
    energy: entry.energyConsumption,
  }));

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Format yesterday's date to match API response format (YYYY-MM-DD)
  const formattedYesterday = yesterday.toISOString().split("T")[0];
  const formattedToday = today.toISOString().split("T")[0];

  // Get this month's year and month in YYYY-MM format
  const currentMonth = today.toISOString().slice(0, 7); // "YYYY-MM"

  const todayEnergy = energyDetails.find(
    (entry) => entry.date === formattedToday
  );
  // Find yesterday's energy consumption
  const yesterdayEnergy = energyDetails.find(
    (entry) => entry.date === formattedYesterday
  );

  // Filter energy consumption for this month
  const monthlyData = energyDetails.filter((entry) =>
    entry.date.startsWith(currentMonth)
  );

  // Calculate monthly average consumption
  const monthlyAverage =
    monthlyData.length > 0
      ? (
          monthlyData.reduce((sum, entry) => sum + entry.energyConsumption, 0) /
          monthlyData.length
        ).toFixed(2)
      : "N/A";

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
        <div className="main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto">
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />

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
            <div className="flex flex-col flex-1">
              <div className="flex flex-col flex-1 gap-4">
                {/* Header with Back Button */}
                <div className="flex items-center mt-5 w-full">
                  <a
                    className="relative pl-4 transition-transform hover:scale-105"
                    href="/devices"
                  >
                    <i className="fa fa-2x fa-arrow-left hover:text-gray-600"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl font-bold w-full ml-[-5%]">
                    {name}{" "}
                    <span className="text-gray-500 font-normal">({type})</span>
                  </h1>
                  {/* Trigger Button */}
                  {userRole === "Owner" && (
                    <button type="button" onClick={openModal}>
                      <i className="fas fa-user text-2xl mr-5 text-3xl"></i>
                    </button>
                  )}

                  {/* Users Modal */}
                  {isOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1001] backdrop-blur-sm"
                      onClick={closeModal}
                    >
                      <div
                        className="bg-white w-11/12 max-w-3xl p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <i className="fas fa-users-cog mr-3 text-blue-500"></i>
                            Users With Access
                          </h2>
                          <button
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            onClick={closeModal}
                            aria-label="Close"
                          >
                            <i className="fas fa-times text-lg"></i>
                          </button>
                        </div>

                        {loading && (
                          <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Loading users...</p>
                          </div>
                        )}

                        {error && (
                          <div className="text-center py-8 bg-red-50 rounded-lg my-4">
                            <i className="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                            <p className="text-red-600">{error}</p>
                          </div>
                        )}

                        {/* Main Content Section */}
                        <div className="flex flex-col items-center justify-center">
                          {/* User count summary */}
                          {!loading &&
                            !error &&
                            userWithPermission.length > 0 && (
                              <div className="w-full max-w-md mb-4 text-gray-600 text-sm">
                                <span className="font-medium">
                                  {userWithPermission.length}
                                </span>{" "}
                                users have access to this device
                              </div>
                            )}

                          {/* Scrollable container for users */}
                          <div className="max-h-[60vh] w-full max-w-md mx-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {!loading && !error && userDetails.length > 0
                              ? userWithPermission.map((user, index) => (
                                  <div
                                    key={user.userId || index}
                                    className="flex justify-between rounded-lg border border-gray-200 bg-white p-4 mb-3 items-center w-full hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex flex-col">
                                      <h3 className="font-medium text-gray-800">
                                        {user.username}{" "}
                                        <span className="text-sm text-gray-500">
                                          ({user.role})
                                        </span>
                                      </h3>
                                      <div className="text-sm text-gray-600">
                                        {user.email}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleDelete(user.userId);
                                      }}
                                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-2"
                                      aria-label="Remove user access"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                ))
                              : !loading &&
                                !error && (
                                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <i className="fas fa-user-slash text-gray-300 text-5xl mb-4"></i>
                                    <p className="text-gray-500">
                                      No users with access found.
                                    </p>
                                  </div>
                                )}
                          </div>
                        </div>

                        {/* add user */}
                        <div className="flex justify-center mt-8 pt-4 border-t">
                          <button
                            onClick={openAddUserModal}
                            className="bg-blue-500 text-white py-3 px-6 rounded-lg text-base font-medium flex items-center hover:bg-blue-600 transition shadow-sm hover:shadow"
                          >
                            <i className="fas fa-user-plus mr-2"></i> Add User
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add user pop up */}
                  {isAddUserOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1001] backdrop-blur-sm"
                      onClick={closeAddUserModal}
                    >
                      <div
                        className="bg-white w-11/12 max-w-3xl p-6 rounded-xl shadow-xl border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                            <i className="fas fa-user-plus mr-3 text-blue-500"></i>
                            {translations.addUser}
                          </h2>
                          <button
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            onClick={closeAddUserModal}
                            aria-label="Close"
                          >
                            <i className="fas fa-times text-lg"></i>
                          </button>
                        </div>

                        {loading && (
                          <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Loading users...</p>
                          </div>
                        )}

                        {error && (
                          <div className="text-center py-8 bg-red-50 rounded-lg my-4">
                            <i className="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                            <p className="text-red-600">{error}</p>
                          </div>
                        )}

                        {/* Search input */}
                        {!loading &&
                          !error &&
                          usersWithoutPermission.length > 0 && (
                            <div className="mb-4 max-w-md mx-auto">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search users..."
                                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                              </div>
                            </div>
                          )}

                        {/* Main Content Section */}
                        <div className="flex flex-col items-center justify-center">
                          {/* Available users count */}
                          {!loading &&
                            !error &&
                            usersWithoutPermission.length > 0 && (
                              <div className="w-full max-w-md mb-2 text-gray-600 text-sm">
                                <span className="font-medium">
                                  {usersWithoutPermission.length}
                                </span>{" "}
                                users available
                              </div>
                            )}

                          {/* Scrollable container for users */}
                          <div className="max-h-[50vh] w-full max-w-md mx-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {!loading && !error && userDetails.length > 0
                              ? usersWithoutPermission.map((user, index) => (
                                  <div
                                    key={user.userid || index}
                                    onClick={() =>
                                      toggleUserSelection(user.userid)
                                    }
                                    className={`flex justify-between rounded-lg border p-4 mb-3 items-center w-full cursor-pointer transition-all ${
                                      selectedUsers.includes(user.userid)
                                        ? "border-blue-300 bg-blue-50"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex flex-col">
                                      <h3 className="font-medium text-gray-800">
                                        {user.username}{" "}
                                        <span className="text-sm text-gray-500">
                                          ({user.role})
                                        </span>
                                      </h3>
                                      <div className="text-sm text-gray-600">
                                        {user.email}
                                      </div>
                                    </div>
                                    <div
                                      className={`w-6 h-6 flex items-center justify-center rounded-full ${
                                        selectedUsers.includes(user.userid)
                                          ? "bg-blue-500 text-white"
                                          : "border-2 border-gray-300"
                                      }`}
                                    >
                                      {selectedUsers.includes(user.userid) && (
                                        <i className="fas fa-check text-sm"></i>
                                      )}
                                    </div>
                                  </div>
                                ))
                              : !loading &&
                                !error && (
                                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <i className="fas fa-users text-gray-300 text-5xl mb-4"></i>
                                    <p className="text-gray-500">
                                      No additional users found without access.
                                    </p>
                                  </div>
                                )}
                          </div>
                        </div>

                        {/* Selected count and grant access button */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t">
                          <div className="mb-4 sm:mb-0 text-gray-600">
                            {selectedUsers.length > 0 ? (
                              <span className="font-medium">
                                {selectedUsers.length} users selected
                              </span>
                            ) : (
                              <span>Select users to grant access</span>
                            )}
                          </div>
                          <button
                            onClick={handlePermissionSubmit}
                            className={`py-3 px-6 rounded-lg text-base font-medium flex items-center transition ${
                              selectedUsers.length === 0
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow"
                            }`}
                            disabled={selectedUsers.length === 0}
                          >
                            <i className="fas fa-key mr-2"></i> Grant Access
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Dashboard Content */}
                <div className="mt-2 gap-4 rounded-lg bg-white shadow-md">
                  {/* Device Status Section */}
                  <div className="p-3">
                    <div className="flex justify-center items-center p-3">
                      <div className="flex flex-col items-center gap-4 p-4">
                        <div className="relative">
                          <img
                            src={deviceDetails.picture}
                            alt={deviceDetails.deviceName}
                            className="border border-black rounded-lg mb-4 mx-auto object-contain shadow-sm"
                            style={{ height: "100px", width: "100px" }}
                          />
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl py-1 px-4 mb-2 rounded-full text-white inline-block ${
                              deviceDetails.onOff == "On"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {deviceDetails.onOff == "On"
                              ? "Online"
                              : translations.offline}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Energy Chart Section */}
                  <div className="p-3">
                    <div className="flex justify-center items-center p-3">
                      <div className="rounded-lg bg-white p-4 shadow-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-center flex items-center justify-center">
                          <i className="fa fa-bolt mr-2 text-yellow-500"></i>
                          {translations.energyCOT}
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={transformedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                            <Legend />
                            <Bar
                              dataKey="energy"
                              fill="#BE9D6A"
                              name={translations.energyKwh}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Energy Stats Cards - 2 Column Grid */}
                  <div className="grid grid-cols-2 p-4 gap-4">
                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">{translations.yesterday}</div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {todayEnergy
                            ? `${parseFloat(todayEnergy.energyConsumption.toFixed(2))} kWh`
                            : "N/A"}
                        </div>
                        {todayEnergy && yesterdayEnergy && (
                          <div className="text-sm text-gray-600">
                            {Number(todayEnergy.energyConsumption) >
                            Number(yesterdayEnergy.energyConsumption) ? (
                              <span className="text-red-500">
                                ↑{" "}
                                {(
                                  ((Number(todayEnergy.energyConsumption) -
                                    Number(yesterdayEnergy.energyConsumption)) /
                                    Number(yesterdayEnergy.energyConsumption)) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            ) : (
                              <span className="text-green-500">
                                ↓{" "}
                                {(
                                  ((Number(yesterdayEnergy.energyConsumption) -
                                    Number(todayEnergy.energyConsumption)) /
                                    Number(yesterdayEnergy.energyConsumption)) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">
                          {translations.today}
                        </div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {yesterdayEnergy
                            ? `${parseFloat(yesterdayEnergy.energyConsumption.toFixed(2))} kWh`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Average Card */}
                  <div className="p-4 flex justify-center items-center">
                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm sm:w-1/2 md:w-[35%]">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">{translations.thisMonthAverage}</div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {monthlyAverage} kWh
                        </div>
                        <div className="text-sm text-gray-500">
                          {translations.dailyAverage}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    key={name}
                    to={`/devices/${type}/${deviceid}/${name}/details/setAction`}
                    className="block"
                  >
                    <div className="p-4 flex justify-center items-center">
                      <div className="rounded-lg border-2 border-gray-300 bg-black hover:bg-gray-800 transition-colors items-center gap-4 p-4 sm:w-1/2 md:w-[35%] shadow-sm">
                        <div className="text-center">
                          <div className="text-2xl text-white flex items-center justify-center">
                            <i className="fa fa-cog mr-2"></i>
                            {translations.set_action}
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
  );
}

export default DeviceDetailsPage;
