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

  const [userDetails, setUserDetails] = useState([]);                        // All users in the family
  const [userWithPermission, setUserWithPermission] = useState([]);          // Users with permission
  const [usersWithoutPermission, setUserWithoutPermission] = useState([]);   // Users without permission
  const [selectedUsers, setSelectedUsers] = useState([]);                    // Selected users to grant permission


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
      const response = await axios.post("http://localhost:8080/api/getUserWithPermission",
      {
        roomid: roomid
      },
      { 
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const withoutPermission = userDetails.filter(user => 
        !userWithPermission.some(permUser => permUser.userId === user.userid)
      );
      setUserWithoutPermission(withoutPermission);
    }
  }, [userDetails, userWithPermission]);


  // Selected users for permission granting
  const toggleUserSelection = (userid) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userid)) {
        return prevSelected.filter(id => id !== userid);
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
      }, 5000);
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
          roomid: roomid 
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
      }, 5000);  

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
        }, 5000);
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
            roomid: roomid 
          }
        }
      );
      
      // alert("Permission successfully removed!");
      // Show success message(added)
      setSuccessMessage("Permission successfully removed!");
      
      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

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
        }, 5000);
    } finally {
      setLoading(false);
    }
  }
  
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
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-50">
                {successMessage}
              </div>
            )}

            {/* Error Message Display (added) */}
            {errorMessage && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
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

                    {/* Modal */}
                    {isOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
                        <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                          {/* Header */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                              {/* {translations.allUsers} */}
                              Users With Access
                            </h2>
                            <button
                              className="text-gray-500 hover:text-gray-700 transition"
                              onClick={closeModal}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>

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
                          <div className="flex flex-col items-center justify-center">
                            {/* Scrollable container for users */}
                            <div className="max-h-[60vh] w-full max-w-md mx-auto overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                              {!loading && !error && userDetails.length > 0
                                ? userWithPermission.map((user, index) => (
                                    <div
                                      key={user.userId || index}
                                      className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center text-center text-lg w-full"
                                    >
                                      <h2 className="text-center w-full">
                                        {user.username} ({user.role})
                                      </h2>
                                      <div className="text-[14px] sm:text-2xl font-bold text-center w-full">
                                        {user.email}
                                      </div>
                                      <button
                                        onClick={() => {
                                          handleDelete(user.userId);
                                        }}
                                        className="text-red-500 text-xl font-bold px-2"
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  ))
                                : !loading &&
                                  !error && (
                                    <div className="text-center py-8">
                                      <p>No users with access found.</p>
                                    </div>
                                  )}
                            </div>
                          </div>

                          {/* add user */}
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={openAddUserModal}
                              className="bg-blue-500 text-white py-2 px-4 rounded-full text-xl flex items-center hover:bg-blue-600 transition"
                            >
                              <i className="fas fa-plus mr-2"></i> Add User
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add user pop up */}
                    {isAddUserOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
                        <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                          {/* Header */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                              {translations.addUser}
                            </h2>
                            <button
                              className="text-gray-500 hover:text-gray-700 transition"
                              onClick={closeAddUserModal}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>

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
                          <div className="flex flex-col items-center justify-center">
                            {/* Scrollable container for users */}
                            <div className="max-h-[60vh] w-full max-w-md mx-auto overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                              {!loading && !error && userDetails.length > 0
                                ? usersWithoutPermission.map((user, index) => (
                                    <div
                                      key={user.userid || index}
                                      onClick={() => toggleUserSelection(user.userid)}
                                      className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center text-center text-lg w-full"
                                    >
                                      <h2 className="text-center w-full">
                                        {user.username} ({user.role})
                                      </h2>
                                      <div className="text-[14px] sm:text-2xl font-bold text-center w-full">
                                        {user.email}
                                      </div>
                                      <div className="text-blue-500">
                                        {selectedUsers.includes(user.userid) && (
                                          <i className="fas fa-check"></i>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                : !loading &&
                                  !error && (
                                    <div className="text-center py-8">
                                      <p>No additional users found without access.</p>
                                    </div>
                                  )}
                            </div>
                          </div>

                          {/* add user */}
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={handlePermissionSubmit}
                              className="bg-blue-500 text-white py-2 px-4 rounded-full text-xl flex items-center hover:bg-blue-600 transition"
                              disabled={selectedUsers.length === 0}
                            >
                              <i className="fas fa-plus mr-2"></i> Grant Access
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
