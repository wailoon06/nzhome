import React, { useState } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RoomsNewPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [favorites, setFavorites] = useState([]); // Favorite devices
  const [selectedDevices, setSelectedDevices] = useState([]); // Selected devices

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // Modal Handlers
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Toggle Favorite
  const toggleFavorite = (deviceid) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(deviceid)
          ? prevFavorites.filter((id) => id !== deviceid) // Remove from favorites
          : [...prevFavorites, deviceid] // Add to favorites
    );
  };

  // Toggle Selected State for Modal
  const toggleSelected = (deviceid) => {
    setSelectedDevices(
      (prevSelected) =>
        prevSelected.includes(deviceid)
          ? prevSelected.filter((id) => id !== deviceid) // Remove from selected
          : [...prevSelected, deviceid] // Add to selected
    );
  };

  // Fetch Device Details
  const [deviceDetails, setDeviceDetails] = useState([]);

  const [successMessage, setSuccessMessage] = useState(""); //added
  const [errorMessage, setErrorMessage] = useState("");     //added

  const fetchDeviceDetails = async (e) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/getDeviceNoRoom",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeviceDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          navigate("/login");
        }, 5000);
      } else {
        setError("An unexpected error occurs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, []);


  const [imageFile, setImageFile] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    // No file selected
    if (!file) return;

    // Check file type
    if (!file.type.match("image.*")) {
      alert("Please select an image file!");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB!");
      return;
    }

    // Store the file for submission
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };


  // Handle submission for room title, picture and selected device
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");  //added
    setErrorMessage("");

    if (!roomName) {
      // alert(translations.pleaseEnterRoomTitle || "Please enter a room title");
      alert("Please enter a room title!");
      return;
    }

    if (!imageFile) {
      alert("Please upload an image for the room!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("roomName", roomName);
    selectedDevices.forEach(deviceid => {
      formData.append("deviceID", deviceid);
    })

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/createRoom",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        localStorage.setItem("roomid", response.data);
        setUploadStatus("Image updated successfully!");
        // alert("Room successfully created!")
        // Set success message (added)
        setSuccessMessage("Room successfully created!");
        
        // Start redirect animation, then navigate (added)
        setTimeout(() => {
          navigate(`/rooms/${roomName}/access`);
        }, 5000);
        // navigate(`/rooms/${roomName}/access`);
      }

    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          navigate("/login");
        }, 5000);
      } else {
        setError("An unexpected error occurs");
      }
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
  
        {/* Toast Messages - Improved positioning and styling */}
        {successMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md px-4 py-3 rounded-md shadow-lg transition-opacity duration-500 ease-in-out z-50 flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        )}
  
        {errorMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-3 rounded-md shadow-lg z-50 flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {errorMessage}
          </div>
        )}
  
        {/* Main Content */}
        <div className="main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto">
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />
  
            {/* Main Content */}
            <div className="flex flex-col flex-1">
              <div className="flex flex-col flex-1 gap-4">
                {/* Back button and title - Improved alignment */}
                <div className="flex items-center mt-5 w-full">
                  <a className="flex items-center text-gray-700 hover:text-gray-900 transition-colors" href="/">
                    <i className="fa fa-arrow-left text-xl mr-4"></i>
                    <span className="text-sm">{translations.backToRooms}</span>
                  </a>
                  <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold flex-grow">
                    {translations.createRoom}
                  </h1>
                  <div className="w-24"></div> {/* Spacer for balance */}
                </div>
  
                {/* Form wrapper with better spacing */}
                <div className="wrapper p-4 max-w-4xl mx-auto w-full">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle mr-3"></i>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Room Creation Form - Improved layout and visual hierarchy */}
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md grid gap-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Image Upload Section - Improved styling */}
                      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 flex flex-col items-center justify-center">
                        {!imagePreview ? (
                          <>
                            <div className="text-gray-400 mb-4 text-center">
                              <i className="fas fa-image text-4xl mb-2"></i>
                              <p>{translations.roomImageHelp}</p>
                            </div>
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                              <i className="fas fa-upload mr-2"></i>
                              {translations.uploadPicture}
                            </label>
                          </>
                        ) : (
                          <div className="relative w-full">
                            <img
                              src={imagePreview}
                              alt="Room Preview"
                              className="w-full h-48 object-cover rounded-md shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => setImagePreview(null)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors mt-4 inline-block"
                            >
                              <i className="fas fa-sync-alt mr-2"></i>
                              {translations.changeImage}
                            </label>
                          </div>
                        )}
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
  
                      {/* Room Details Section */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                            {translations.roomTitle} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="roomName"
                            type="text"
                            placeholder={translations.roomTitlePlaceholder || "Living Room, Kitchen, etc."}
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
  
                    {/* Submit Button - Improved styling and feedback */}
                    <button
                      type="submit"
                      disabled={!roomName}
                      className={`w-full py-3 rounded-md text-white font-medium flex items-center justify-center ${
                        roomName
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-300 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <i className="fas fa-arrow-right mr-2"></i>
                      {translations.nextStep}
                    </button>
                    
                    {/* Form validation messages */}
                    {!roomName && (
                      <div className="text-sm text-gray-500 text-center">
                        <p>{translations.roomNameRequired || "Room name is required"}</p>
                      </div>
                    )}
                  </form>
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

  // Devices
  // const devices = [
  //   {
  //     name: "xiaomi",
  //     type: "vacuum",
  //   },
  //   { name: "Daikin", type: "aircon" },
  // ];

  
