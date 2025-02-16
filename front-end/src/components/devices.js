import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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

  const previousStateRef = useRef(devicesState);

  const devices = [
    { img: "room1.jpg", name: "Samsung TV", type: "TV" },
    { img: "room2.jpg", name: "Philips Hue", type: "TV" },
    { img: "room2.jpg", name: "LG Speaker", type: "Speaker" },
    { img: "room2.jpg", name: "Nest Thermostat", type: "Eg" },
    { img: "room2.jpg", name: "Nest Thermostat", type: "Eg" },
    { img: "room2.jpg", name: "Nest Thermostat", type: "Eg" },
    { img: "room2.jpg", name: "Nest Thermostat", type: "Eg" },
    { img: "room2.jpg", name: "Nest Thermostat", type: "Eg" },
  ];

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && devicesState[device.name]) ||
      (filter === "inactive" && !devicesState[device.name]);

    return matchesSearch && matchesFilter;
  });

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

  const handleSwitchToggle = (deviceName) => {
    setDevicesState((prevState) => ({
      ...prevState,
      [deviceName]: !prevState[deviceName],
    }));
  };

  const handleToggleAll = (state) => {
    const newDevicesState = {};
    Object.keys(devicesState).forEach((device) => {
      newDevicesState[device] = state;
    });
    setDevicesState(newDevicesState);
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
    Object.keys(devicesState).forEach((deviceName) => {
      if (previousStateRef.current[deviceName] !== devicesState[deviceName]) {
        console.log(
          `${deviceName} turned ${devicesState[deviceName] ? "on" : "off"}`
        );
      }
    });

    previousStateRef.current = devicesState;
  }, [devicesState]);

  return (
    <div className="rounded-lg p-4 teal-text mb-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-lg p-4 baseGreen mb-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Devices</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleAll(true)}
                className="text-white font-bold"
              >
                Turn All On
              </button>
              <button
                onClick={() => handleToggleAll(false)}
                className="text-white font-bold"
              >
                Turn All Off
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Search devices..."
              className="p-2 border rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="p-2 border rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
                      src={device.img}
                      alt={device.name}
                      className="rounded-lg mb-4"
                      style={{ height: "170px" }}
                      onClick={() => openModal(device)}
                    />
                    <Link to={`/devices/${device.type}/${device.name}/details`}>
                      <div className="teal-text text-sm sm:text-base w-full text-center mb-2">
                        {device.name}
                      </div>
                    </Link>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={devicesState[device.name]}
                        onChange={() => handleSwitchToggle(device.name)}
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

          <div className="absolute inset-y-1/2 w-[95%] flex justify-between items-center">
            <button
              onClick={prevItems}
              disabled={currentIndex === 0}
              className="bg-white text-gray-800 p-2 rounded-full"
            >
              <i className={"fas fa-chevron-left"}></i>
            </button>
            <button
              onClick={nextItems}
              disabled={currentIndex + 3 >= filteredDevices.length}
              className="bg-white text-gray-800 p-2 rounded-full"
            >
              <i className={"fas fa-chevron-right"}></i>
            </button>
          </div>
        </div>
      </div>

      {modalDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{modalDevice.name}</h3>
            <p>Additional device details go here.</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-teal-500 teal-text px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Devices;
