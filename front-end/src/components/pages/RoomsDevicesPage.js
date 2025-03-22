import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useEffect } from "react";

function RoomsDevicesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navigate = useNavigate();

  const { roomid, roomTitle } = useParams();

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          setErrorMessage("Session expired. Please log in again.");//added
        
          setTimeout(() => {//added
            localStorage.removeItem("token");
            localStorage.removeItem("selectedDevice");
            navigate("/login");
          }, 2000);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");//added
      }

      setTimeout(() => {//added
        setErrorMessage("");
      }, 5000);
    };

  // Fetch Device Details
  const [deviceStates, setDeviceStates] = useState({});
  const [deviceDetails, setDeviceDetails] = useState([]);

  const fetchDeviceDetails = async (e) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/getDeviceRoom",
        { roomName: roomTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeviceDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        setErrorMessage("Session expired. Please log in again.");//added
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setTimeout(() => {//added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          navigate("/login");
        }, 2000);
      } else {
        // setError("An unexpected error occurs");
        setErrorMessage("An unexpected error occurred while fetching devices.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [roomTitle]);

  // Toggle function (On/Off)
  useEffect(() => {
    if (deviceDetails.length > 0) {
      // Initialize device states based on data from the backend
      const initialStates = {};
      deviceDetails.forEach((device) => {
        initialStates[device.deviceid] = device.onOff === "On";
      });
      setDeviceStates(initialStates);
    }
  }, [deviceDetails]);

  const toggleSwitch = async (deviceid) => {
    try {
      const currentState = deviceStates[deviceid];
      const newState = !currentState;

      setDeviceStates((prevState) => ({
        ...prevState,
        [deviceid]: !prevState[deviceid], // Toggle device state
      }));

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/OnOff",
        {
          deviceid: deviceid,
          state: newState ? "On" : "Off",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message (added)
      setSuccessMessage(`Device ${newState ? "turned on" : "turned off"} successfully!`);
      // Auto-clear success message after 3 seconds (added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);


      // Refresh device list to get updated data
      fetchDeviceDetails();
    } catch (err) {
      console.error("Failed to update device state:", err);
      setDeviceStates((prevState) => ({
        ...prevState,
        [deviceid]: !prevState[deviceid],
      }));

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
        }, 2000);
      } else {
        setErrorMessage("Failed to update device state. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    }
  };

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
    fetchUserDetails();
  }, []);

  // Get users with permission (userId)
  const fetchUserWithPermission = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/getUserWithPermission",
        {
          roomid: roomid,
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

  // Handle permission submission
  const handlePermissionSubmit = async () => {
    if (selectedUsers.length === 0) {
      // alert("Please select at least one user");
      setErrorMessage("Please select at least one user");//added
      setTimeout(() => {//added
        setErrorMessage("");
      }, 3000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

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
        setErrorMessage("Session expired. Please log in again.");//added
        
        setTimeout(() => {//added
          localStorage.clear();
          navigate("/login");
        }, 2000);
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
  }, [roomid]);

  // Handle delete submission
  const handleDelete = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "http://localhost:8080/api/deletePermission",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            userid: [userId],
            roomid: roomid,
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
        setErrorMessage("Session expired. Please log in again.");//added
        
        setTimeout(() => {//added
          localStorage.clear();
          navigate("/login");
        }, 2000);
      }
      // setError("An unexpected error occurs");
      setErrorMessage("Failed to remove permission. Please try again.");//added
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        {/* Sidebar Component */}
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


            {/* Main Section */}
            <div className="flex flex-col flex-1">
              {/* Header Section */}
              <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
                  {translations.list_of_devices}
                </h1>
                <div className="flex gap-3">
                  {" "}
                  {/* Users */}
                  <div className="p-4 flex justify-end items-center">
                    {/* Trigger Button */}
                    <button type="button" onClick={openModal}>
                      {/* {translations.view_all} */}
                      <i className="fas fa-user text-2xl mr-5 text-3xl"></i>
                    </button>

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
                                        {selectedUsers.includes(
                                          user.userid
                                        ) && (
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
                                        No additional users found without
                                        access.
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

                    {/* Add device */}
                    <a href="/devices/new">
                      <i className="fas fa-plus text-3xl"></i>
                    </a>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <p>Loading devices...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {/* Device List Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
                {deviceDetails.map((device) => (
                  <div
                    key={device.deviceName}
                    className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col items-center p-4"
                  >
                    <Link
                      to={`/rooms/summary/${device.deviceName}`}
                      className="w-full text-center"
                    >
                      {/* Displaying Image */}
                      {device.picture ? (
                        <img
                          src={device.picture}
                          alt={device.deviceName}
                          className="border border-black rounded-lg mb-4 mx-auto object-contain"
                          style={{ height: "100px", width: "100px" }}
                        />
                      ) : (
                        <p>No Image Available</p>
                      )}
                      <div className="teal-text text-sm sm:text-base w-full mb-2">
                        <strong>{device.deviceName}</strong>
                      </div>
                    </Link>

                    {/* Status Indicator */}
                    <div
                      className={`text-2xl w-auto px-4 mb-2 rounded-full text-white inline-block py-1 ${
                        device.onOff === "On" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {device.onOff === "On"
                        ? translations.online
                        : translations.offline}
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center">
                      <div
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation when toggling
                          toggleSwitch(device.deviceid);
                        }}
                        className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                          deviceStates[device.deviceid]
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                            deviceStates[device.deviceid]
                              ? "translate-x-8"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsDevicesPage;
