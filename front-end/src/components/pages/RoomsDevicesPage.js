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

  const { roomTitle } = useParams();

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // Fetch Device Details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceStates, setDeviceStates] = useState({});
  const [deviceDetails, setDeviceDetails] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

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
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      } else {
        setError("An unexpected error occurs");
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
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
    }
  };

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

  // Show Users
  const [userDetails, setUserDetails] = useState(null);

  // Modal Handlers
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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
  }, [navigate]);

  // delete users from room
  // Handle delete submission
  const handleDelete = async (email) => {
    // Double confirm
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);

    try {
      // Get token
      const token = localStorage.getItem("token");

      // Delete user
      const response = await axios.delete(
        `http://localhost:8080/api/deleteUserFam`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { email: email },
        }
      );

      // Update the user list after successful deletion
      setUserDetails((prevUsers) =>
        prevUsers.filter((user) => user.email !== email)
      );

      alert(response.data.message);
    } catch (err) {
      console.error("Delete error:", err);
      handleApiError(err);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

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
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                          {/* Header */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                              {translations.allUsers}
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
                            {!loading && !error && userDetails.length > 0
                              ? userDetails.map((user, index) => (
                                  // <div
                                  //   onClick={() => handleNavigation("#")}
                                  //   className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center justify-center text-center text-lg w-[85%] gap-4"
                                  // >
                                  <div
                                    key={user.id || index}
                                    // onClick={() =>
                                    //   handleNavigation(`/user/${user.id}`)
                                    // }
                                    className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center justify-center text-center text-lg w-[85%] gap-4"
                                  >
                                    <h2>
                                      {user.username} ({user.role})
                                    </h2>
                                    <div className="text-[14px] sm:text-2xl font-bold text-right">
                                      {user.email}
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(user.email);
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
                                    <p>No users found.</p>
                                  </div>
                                )}
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

  // return (
  //   <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
  //     <div className="p-2 grid grid-cols-[auto_1fr] h-full">
  //       <div className="relative flex">
  //         <Sidebar
  //           isCollapsed={isCollapsed}
  //           toggleSidebar={toggleSidebar}
  //           language={language}
  //         />
  //       </div>

  //       {/* Main Content */}
  //       <div
  //         className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
  //       >
  //         <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
  //           {/* Main Content Header */}
  //           <MainContentHeader
  //             isCollapsed={isCollapsed}
  //             toggleSidebar={toggleSidebar}
  //             translations={translations}
  //           />

  //           {loading && (
  //             <div className="text-center py-8">
  //               <p>Loading devices...</p>
  //             </div>
  //           )}

  //           {error && (
  //             <div className="text-center py-8 text-red-500">
  //               <p>{error}</p>
  //             </div>
  //           )}

  //           {/* <!-- Main Content --> */}
  //           <div class="flex flex-col flex-1">
  //             {/* Main Content */}
  //             <div
  //               className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
  //             >
  //               <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
  //                 {/* Main Content */}
  //                 <div className="flex flex-col flex-1">
  //                   {/* Setting Section */}
  //                   <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
  //                     <a className="relative pl-4" href="/rooms">
  //                       <i className="fa fa-2x fa-arrow-left"></i>
  //                     </a>
  //                     <h1 className="text-center lg:text-4xl w-full ml-[-1%]">
  //                       {roomTitle}
  //                     </h1>
  //                   </div>

  //                   {/* Main Content Section */}
  //                   <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-2 justify-center items-center p-3">
  //                     {/* Dynamically added blocks */}
  //                     <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
  //                       {deviceDetails.map((device) => (
  //                         <Link
  //                           key={device.deviceName}
  //                           to={`/rooms/summary/${device.deviceName}`}
  //                           className="w-full"
  //                         >
  //                           <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
  //                             <img
  //                               src={device.picture}
  //                               alt={device.deviceName}
  //                               className="border border-black rounded-lg mb-4 mx-auto"
  //                               style={{ height: "100px", width: "100px" }}
  //                             />
  //                             <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
  //                               <div className="mb-2">Xiaomi</div>
  //                               <div
  //                                 className={`text-2xl w-full mb-2 rounded-full text-white inline-block ${
  //                                   deviceStates[device.deviceName]
  //                                     ? "bg-green-500"
  //                                     : "bg-red-500"
  //                                 }`}
  //                               >
  //                                 {deviceStates[device.deviceName]
  //                                   ? `${translations.online}`
  //                                   : `${translations.offline}`}
  //                               </div>
  //                               <div className="flex flex-col items-center justify-center">
  //                                 <div
  //                                   onClick={(e) => {
  //                                     e.preventDefault(); // Prevent navigation when toggling
  //                                     toggleSwitch(device.deviceName);
  //                                   }}
  //                                   className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all ${
  //                                     deviceStates[device.deviceName]
  //                                       ? "bg-green-500"
  //                                       : "bg-gray-300"
  //                                   }`}
  //                                 >
  //                                   <div
  //                                     className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
  //                                       deviceStates[device.deviceName]
  //                                         ? "translate-x-8"
  //                                         : "translate-x-0"
  //                                     }`}
  //                                   ></div>
  //                                 </div>
  //                               </div>
  //                             </div>
  //                           </div>
  //                         </Link>
  //                       ))}
  //                     </div>
  //                     {/* More blocks will automatically adjust */}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const [deviceStates, setDeviceStates] = useState(
  //   deviceDetails.reduce((acc, device) => {
  //     acc[device.name] = false; // Initialize all devices as "Off"
  //     return acc;
  //   }, {})
  // );

  // const toggleSwitch = (deviceid) => {
  //   setDeviceStates((prevState) => ({
  //     ...prevState,
  //     [deviceid]: !prevState[deviceid], // Toggle the state for the specific device
  //   }));
  // };
}

export default RoomsDevicesPage;
