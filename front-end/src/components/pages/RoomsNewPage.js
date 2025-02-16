import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

function RoomsNewPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Devices
  const devices = [
    {
      name: "xiaomi",
      type: "vacuum",
    },
    { name: "Daikin", type: "aircon" },
  ];

  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [favorites, setFavorites] = useState([]); // Favorite devices
  const [selectedDevices, setSelectedDevices] = useState([]); // Selected devices

  // Modal Handlers
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Toggle Favorite
  const toggleFavorite = (deviceName) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(deviceName)
          ? prevFavorites.filter((name) => name !== deviceName) // Remove from favorites
          : [...prevFavorites, deviceName] // Add to favorites
    );
  };

  // Toggle Selected State for Modal
  const toggleSelected = (deviceName) => {
    setSelectedDevices(
      (prevSelected) =>
        prevSelected.includes(deviceName)
          ? prevSelected.filter((name) => name !== deviceName) // Remove from selected
          : [...prevSelected, deviceName] // Add to selected
    );
  };

  // Upload picture
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Get title
  const [roomTitle, setRoomTitle] = useState("");

  const getTitle = (e) => {
    setRoomTitle(e.target.value);
  };

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
          {/* Sidebar */}
          <div
            className={`sidebar ${isCollapsed ? "w-[0px]" : "w-[100px]"} ${
              isCollapsed ? "" : "baseGreen"
            } rounded-lg min-h-full flex flex-col overflow-y-auto`}
          >
            {/* Sidebar Logo */}
            <div className="h-[100px] flex items-center justify-center">
              <a href="/">
                <img
                  src="./image/NZHome.png"
                  alt="NZ Home Logo"
                  className={`${isCollapsed ? "hidden" : "block"}`}
                />
              </a>
            </div>
            {/* Sidebar Items */}
            <a href="/devices">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-layer-group text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Devices
                  </span>
                )}
              </div>
            </a>{" "}
            <a href="/electric">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-bolt text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Electrical Usage
                  </span>
                )}
              </div>
            </a>
            <a href="/internet">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-chart-pie text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Internet Usage
                  </span>
                )}
              </div>
            </a>
            <a href="/calendar">
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <i
                  className={`fas fa-wind text-white text-2xl ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                ></i>
                {!isCollapsed && (
                  <span className="text-white text-center text-sm mt-2">
                    Calendar
                  </span>
                )}
              </div>
            </a>
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

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <div className="flex justify-between items-center relative">
              <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
                {/* Hamburger Button */}
                <div
                  className={`flex items-center ${
                    isCollapsed ? "block" : "hidden"
                  }`}
                >
                  <button
                    onClick={toggleSidebar}
                    className="text-white text-2xl bg-transparent border-0 mr-4"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>

                {/* Centered Text */}
                <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
                  NZ HOME
                </h1>

                {/* User Icon */}
                <a href="#" className="mr-8">
                  <i className="fas fa-user text-white text-3xl"></i>
                </a>

                {/* Bell Icon */}
                <a href="/notification" className="ml-auto">
                  <i className="fas fa-bell text-white text-3xl"></i>
                </a>
              </div>
            </div>

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    Create Room
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4">
                  {/* Event Form */}
                  <div className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-rows-[auto] gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full border border-gray-300 rounded p-4">
                        {/* Upload Button */}
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-colors"
                        >
                          Upload Picture
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />

                        {/* Preview the Uploaded Image */}
                        {imagePreview && (
                          <div className="mt-4">
                            <img
                              src={imagePreview}
                              alt="Uploaded Preview"
                              className="w-full max-w-xs mx-auto border border-gray-300 rounded shadow-md"
                            />
                          </div>
                        )}
                      </div>

                      {/* ======================== */}
                      <input
                        type="text"
                        placeholder="Room Title"
                        value={roomTitle}
                        onChange={getTitle}
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                      />
                    </div>

                    <div className="grid grid-rows-[auto] border border-gray-300 bg-white rounded-lg">
                      <div className="grid grid-cols-2">
                        {/* Left Section */}
                        <h3 className="text-xl font-semibold m-5">
                          Select Device
                        </h3>

                        {/* Right Section */}
                        <div className="p-4 flex justify-end items-center">
                          {/* Trigger Button */}
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                            onClick={openModal}
                          >
                            View All
                          </button>

                          {/* Modal */}
                          {isOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-xl font-semibold">
                                    View All Items
                                  </h2>
                                  <button
                                    className="text-gray-500 hover:text-gray-700 transition"
                                    onClick={closeModal}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>

                                {/* Content */}
                                <div className="overflow-y-auto max-h-96">
                                  <ul className="space-y-4">
                                    {devices.map((device) => (
                                      <li
                                        key={device.name}
                                        className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition flex justify-between items-center"
                                      >
                                        <div className="relative w-full">
                                          <span>
                                            {device.name} ({device.type})
                                          </span>

                                          {/* Green Check Mark for Selected Devices */}
                                          {selectedDevices.includes(
                                            device.name
                                          ) && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                              <i className="fas fa-check"></i>
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          onClick={() =>
                                            toggleFavorite(device.name)
                                          }
                                          className={`text-sm px-3 py-1 rounded-md ${
                                            favorites.includes(device.name)
                                              ? "bg-green-500 text-white"
                                              : "bg-gray-300 text-black"
                                          }`}
                                        >
                                          {favorites.includes(device.name)
                                            ? "Favorited"
                                            : "Favorite"}
                                        </button>

                                        <button
                                          onClick={() =>
                                            toggleSelected(device.name)
                                          }
                                          className="text-sm px-3 py-1 rounded-md ml-2"
                                        >
                                          {selectedDevices.includes(device.name)
                                            ? "Deselect"
                                            : "Select"}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 justify-center items-center p-3">
                        {/* Dynamically added blocks for Favorites */}
                        {favorites.map((favDevice) => (
                          <div
                            key={favDevice}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 cursor-pointer"
                            onClick={() => toggleSelected(favDevice)} // Toggle selected when clicked
                          >
                            <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                              <img
                                src=""
                                alt=""
                                className="border border-black rounded-lg mb-4 mx-auto"
                                style={{ height: "100px", width: "100px" }}
                              />
                              <div className="relative w-full">
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{favDevice}</div>
                                </div>

                                {/* Green Check Mark for Selected Devices in Favorites */}
                                {selectedDevices.includes(favDevice) && (
                                  <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                    <i className="fas fa-check"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Message if no favorites */}
                        {favorites.length === 0 && (
                          <p className="text-gray-500 col-span-4 text-center">
                            No favorites added yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/rooms/${roomTitle}/access`} // Use the input value in the link
                      className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center ${
                        roomTitle ? "" : "pointer-events-none opacity-50"
                      }`}
                    >
                      Next
                    </Link>
                    {/* ===================================== */}
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

export default RoomsNewPage;
