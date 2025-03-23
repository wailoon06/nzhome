import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import translationsMap from "../components/locales/translationsMap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WidgetsEnergy() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date.toLocaleDateString("en-US"));
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  const [networkSpeed, setNetworkSpeed] = useState(500);
  const [error, setError] = useState(null); // Add missing state
  const [loading, setLoading] = useState(false); // Add missing state
  const navigate = useNavigate(); // Ensure navigate is defined
  const [errorMessage, setErrorMessage] = useState(""); //added

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Authorization token missing.");
      setLoading(false);
      // navigate("/login");
      setTimeout(() => {//added
        localStorage.clear();
        navigate("/login");
      }, 5000);
      return;
    }

    const interval = setInterval(() => {
      // Generate a random speed between 20 and 50 Mbps
      const newSpeed = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      setNetworkSpeed(newSpeed);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  // Handle getting user details
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    setLoading(true);

    try {
      // Get token
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getUserDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserDetails(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message || "Failed to load user details");

      // Handle token expiration or authentication issues
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        // Token expired or invalid - redirect to login
        console.log("Session expired!");
        // localStorage.removeItem('token');
        // navigate('/login');
        setErrorMessage("Session expired. Please log in again.");

        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [camera, setCamera] = useState([]);
  const fetchCameraDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getAllDevice",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter only devices with categoryName === 'Robot'
      const camera = response.data.filter(
        (device) => device.category.categoryName === "Camera"
      );

      setCamera(camera);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraDetails();
  }, []);

  return (
    <div className="grid grid-cols-2 p-4 gap-4 mb-4">
      {/* Widgets */}
      <div>
        <div className="baseGreen2 rounded-lg mb-4 p-4 flex flex-col justify-center">
          <img
            src="https://plus.unsplash.com/premium_photo-1706140675031-1e0548986ad1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGl2aW5ncm9vbXxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
            className="rounded-lg mb-4"
            style={{ height: "170px" }}
          />
          {camera && camera.length > 0 ? (
            <a href="/camera">
              <div className="relative bg-white text-gray-800 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center cursor-pointer">
                {translations.checkCamera}
              </div>
            </a>
          ) : (
            <div className="relative bg-gray-400 text-gray-600 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center cursor-not-allowed">
              {translations.checkCamera}
            </div>
          )}
        </div>

        {/* Error Message Display (added)*/}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
            {errorMessage}
          </div>
        )}

        <a href="#">
          <div className="mt-12">
            <div className="rounded-lg p-3 baseGreen2 flex flex-wrap gap-2 mt-2 overflow-hidden px-4 py-8">
              {/* Weather Today */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg pb-4 font-bold">
                  {translations.weatherToday}
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  {translations.clear}
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg pb-4 font-bold">
                  {translations.temperature}
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate ">
                  20 °C
                </div>
              </div>

              {/* Device Status */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg pb-4 font-bold">
                  {translations.deviceStatus}
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  {translations.stable}
                </div>
              </div>

              {/* Network */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <a href="/internet">
                  <div className="text-sm sm:text-base md:text-lg pb-4 font-bold">
                    {translations.network}
                  </div>
                  <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                    {networkSpeed} Mbps {/* Use dynamic state */}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="baseGreen2 rounded-lg mb-4 p-4 teal-text">
        {/* Date Picker */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative bg-white text-gray-800 rounded-full text-sm py-1 px-2 flex items-center cursor-pointer w-[170px] z-50">
            <i className="fas fa-calendar mr-2 text-gray-600"></i>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="bg-transparent border-0 cursor-pointer w-full"
            />
          </div>
        </div>

        {/* Energy Usage Section */}
        <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl mb-4">{translations.energyUsage}</h2>

          {/* Today Energy Usage */}

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden relative">
                <i className="fas fa-bolt text-lg mr-3"></i>
                <span className="text-sm sm:text-base">
                  {translations.today}
                </span>
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-lg">
                    28.6 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            {userDetails?.role === "User" && (
              <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
                <i className="fas fa-lock text-white text-2xl"></i>
              </div>
            )}
          </div>

          {/* This Month Energy Usage */}

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden relative">
                <i className="fas fa-bolt text-lg mr-3"></i>
                <span className="text-sm sm:text-base">
                  {translations.thisMonth}
                </span>
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-lg">
                    325.37 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            {userDetails?.role === "User" && (
              <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
                <i className="fas fa-lock text-white text-2xl"></i>
              </div>
            )}
          </div>
        </div>

        {/* Energy Generation Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-hidden relative">
          <h2 className="text-xl mb-4">{translations.energyGeneration}</h2>

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden">
                {/* Icon */}
                <i className="fas fa-sun text-lg mr-3"></i>

                {/* Label */}
                <span className="text-sm sm:text-base md:text-lg truncate">
                  {translations.thisMonth}
                </span>

                {/* Energy Value */}
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-base">
                    400 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            {userDetails?.role === "User" && (
              <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
                <i className="fas fa-lock text-white text-2xl"></i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetsEnergy;
