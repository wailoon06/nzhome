import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import translationsMap from "../components/locales/translationsMap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Devices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(""); // Track animation direction
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState("all"); // State for status filter (all/active/inactive)
  const [modalDevice, setModalDevice] = useState(null); // State for modal data
  const [animationClass, setAnimationClass] = useState("");
  const [tempIndex, setTempIndex] = useState(currentIndex);
  const [devicesState, setDevicesState] = useState({
    "Samsung TV": false,
    "Philips Hue": false,
    "LG Speaker": false,
    "Nest Thermostat": false,
  });
  const navigate = useNavigate();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [devicesByRoom, setDevicesByRoom] = useState({});
  const [roomNames, setRoomNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const devices = [
  //   { img: "/image/samsung.jpeg", name: "Samsung TV", type: "TV" },
  //   { img: "/image/light.jpeg", name: "Philips Hue", type: "Light" },
  //   { img: "/image/speaker.jpeg", name: "LG Speaker", type: "Speaker" },
  //   { img: "/image/thermostats.jpeg", name: "Nest Thermostat", type: "Thermostat" },
  //   { img: "/image/xiaomi.jpeg", name: "Vacuum", type: "Vacuum" },

  // ];

  const previousStateRef = useRef(devicesState);

  // Get device
  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Get all devices
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const allDevices = response.data;
      const authorisedDevices = [];
  
      for (const device of allDevices) {
        try {
          // Validate device permission
          await axios.post(
            "http://localhost:8080/api/validateDevicePermission",
            { deviceid: device.deviceid },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          // If device is authorized, add it to the list and skip room permission check
          authorisedDevices.push(device);
        } catch (err) {
          console.log(`No permission for device ${device.deviceid}`);
        }
      }
  
      setDeviceDetails(authorisedDevices);
  
      // Step 2: Organize authorized devices by room
      const deviceRooms = {};
      const rooms = [];
  
      authorisedDevices.forEach(device => {
        const roomName = device.room.roomName;
  
        if (!deviceRooms[roomName]) {
          deviceRooms[roomName] = [];
          rooms.push(roomName);
        }
  
        deviceRooms[roomName].push(device);
      });
  
      // Sort room names alphabetically
      rooms.sort((a, b) => a.localeCompare(b));
  
      setRoomNames(rooms);
      setDevicesByRoom(deviceRooms);
  
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeviceDetails();
  }, []);

  const filteredDevices = deviceDetails.filter((device) => {
    const matchesSearch = device.deviceName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && device.onOff === "On") ||
      (filter === "inactive" && device.onOff === "Off");

    return matchesSearch && matchesFilter;
  }).sort((a, b) => 
    a.room.roomName.localeCompare(b.room.roomName, undefined, { sensitivity: 'base' })
  );

  const prevItems = () => {
    if (currentIndex === 0) return; // Prevent going to invalid index
    setDirection("prev");
    setAnimationClass("animate-slide-in-prev");
    setTempIndex(Math.max(currentIndex - 3, 0)); // Set temporary index for previous page
  };

  const nextItems = () => {
    if (currentIndex + 3 >= filteredDevices.length) return; // Prevent overshooting the index
    setDirection("next");
    setAnimationClass("animate-slide-in-next");
    setTempIndex(Math.min(currentIndex + 3, filteredDevices.length - 1)); // Set temporary index for next page
  };

  const totalPages = Math.ceil(filteredDevices.length / 3);
  const currentPage = Math.floor(currentIndex / 3);

  // const handleSwitchToggle = (deviceName) => {
  //   setDevicesState((prevState) => ({
  //     ...prevState,
  //     [deviceName]: !prevState[deviceName],
  //   }));
  // };
  const handleSwitchToggle = async (deviceid) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/OnOff",
        { deviceid: deviceid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh device list after toggling
      fetchDeviceDetails();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      } else {
        console.error("Error toggling device:", err);
        alert("Failed to toggle device");
      }
    }
  };

  // const handleToggleAll = (state) => {
  //   const newDevicesState = {};
  //   Object.keys(devicesState).forEach((device) => {
  //     newDevicesState[device] = state;
  //   });
  //   setDevicesState(newDevicesState);
  // };
  const handleToggleAll = async (targetState) => {
    setLoading(true);
    console.log("Starting toggle all, target state:", targetState);

    try {
      const token = localStorage.getItem("token");

      // Find devices that need to be changed
      const devicesToToggle = filteredDevices.filter(
        (device) =>
          (targetState && device.onOff === "Off") ||
          (!targetState && device.onOff === "On")
      );

      console.log(`Found ${devicesToToggle.length} devices to toggle`);

      if (devicesToToggle.length === 0) {
        console.log("No devices need changing");
        setLoading(false);
        return;
      }

      // Toggle each device one by one
      for (const device of devicesToToggle) {
        console.log(`Toggling device: ${device.deviceid}`);
        await axios.put(
          "http://localhost:8080/api/OnOff",
          { deviceid: device.deviceid },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh device list after toggling all devices
      await fetchDeviceDetails();
    } catch (err) {
      console.error("Error in handleToggleAll:", err);

      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      } else {
        console.error("Error toggling all devices:", err);
        alert("Failed to toggle all devices");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnimationEnd = () => {
    setAnimationClass(""); // Reset animation class after animation ends
    setCurrentIndex(tempIndex); // Update actual index with tempIndex after animation completes
  };

  const openModal = (device) => {
    setModalDevice(device);
  };

  const closeModal = () => {
    setModalDevice(null);
  };

  useEffect(() => {
    // Compare the previous state with the current state
    Object.keys(devicesState).forEach((deviceid) => {
      if (previousStateRef.current[deviceid] !== devicesState[deviceid]) {
        console.log(
          `${deviceid} turned ${devicesState[deviceid] ? "On" : "Off"}`
        );
      }
    });

    previousStateRef.current = devicesState;
  }, [devicesState]);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  console.log(filteredDevices);

  return (
    <div className="rounded-lg p-4 teal-text mb-4">
      <div className="grid grid-cols-1 gap-4">
        <div className=" rounded-lg p-4 baseGreen2 mb-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {" "}
              {translations.devices}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleAll(true)}
                className="text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {translations.processing}
                  </span>
                ) : (
                  translations.turnAllOn
                )}
                {/* {translations.turnAllOn} */}
              </button>
              <button
                onClick={() => handleToggleAll(false)}
                className="text-white font-bold"
                disabled={loading}
              >
                {/* {translations.turnAllOff} */}
                {loading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {translations.processing}
                  </span>
                ) : (
                  translations.turnAllOff
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder={translations.searchDevices}
              className="p-2 border rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="p-2 border rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{translations.all}</option>
              <option value="active">{translations.active}</option>
              <option value="inactive">{translations.inactive}</option>
            </select>
          </div>

          <div className="transition-all duration-500 ease-in-out">
            <div
              className={`grid sm:grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${animationClass}`}
              onAnimationEnd={handleAnimationEnd}
            >
              {filteredDevices
                .slice(currentIndex, currentIndex + 3)
                .map((device, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white p-3 rounded-lg"
                  >
                    <img
                      src={device.picture}
                      alt={device.deviceName}
                      className="rounded-lg mb-4"
                      style={{ height: "170px" }}
                      onClick={() => openModal(device)}
                    />
                    <Link
                      to={`/devices/${device.category.categoryName}/${device.deviceid}/${device.deviceName}/details`}
                    >
                      <div className="teal-text text-sm sm:text-base w-full text-center mb-2">
                        {device.deviceName} ({device.room.roomName})
                      </div>
                    </Link>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={device.onOff === "On"}
                        onChange={() => handleSwitchToggle(device.deviceid)}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-teal-500 peer-focus:ring-2 peer-focus:ring-teal-300"></div>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></span>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`text-2xl ${
                  index === currentPage ? "teal-text" : "text-white"
                }`}
              >
                •
              </span>
            ))}
          </div>

          {filteredDevices.length > 1 && (
            <div className="absolute inset-y-1/2 w-[97%] flex px-10 pe-6 items-center">
              {/* Left Button - Stays on the left when visible */}
              {currentIndex > 0 && (
                <div className="flex-1 flex justify-start">
                  <button
                    onClick={prevItems}
                    className="bg-white border-4 text-gray-800 p-2 rounded-full"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </div>
              )}

              {/* Right Button - Stays on the right when visible */}
              {currentIndex + 1 < filteredDevices.length && (
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={nextItems}
                    className="bg-white border-4 text-gray-800 p-2 rounded-full"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modalDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{modalDevice.name}</h3>
            <p>{translations.additionalDeviceDetails}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-teal-500 teal-text px-4 py-2 rounded"
            >
              {translations.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Devices;
