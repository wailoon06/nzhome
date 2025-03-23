import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate("");
  const [errorMessage, setErrorMessage] = useState("");     //added


  // Language 
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];


  // Handle profile picture
  const [profileImage, setProfileImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    
    // No file given
    if (!file) return ;

    // Check file type
    if (!file.type.match('image.*')) {
      alert("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }

    setUploadLoading(true);
    setError(null);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      //Get token
      const token = localStorage.getItem('token');

      // Post picture
      const response = await axios.post("http://localhost:8080/api/upload", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });

      // Handle successful response
      if (response.status === 200) {
        // Preview image
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
        setUploadStatus("Profile picture updated successfully!");

        fetchUserDetails();
      }

    } catch (error) {
       console.error("Error uploading image: ", error);
       if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        alert("Error uploading image" + error.response.data.toString());
       }
    }      
  }


  // Handle getting user details
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    
    try {
      // Get token
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/getUserDetails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserDetails(response.data);
      setProfileImage(response.data.picture || null);
  
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.message || 'Failed to load user details');
      
      // Handle token expiration or authentication issues
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
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

  if (loading) return (<div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        <div className="flex flex-col items-center">
                          <svg
                            className="animate-spin h-10 w-10 text-blue-600 mb-2"
                            xmlns="http://www.w3.org/5000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"
                            ></path>
                          </svg>
                          <p className="text-gray-700 text-lg font-semibold">
                            Loading user details...
                          </p>
                        </div>
                      </div>)

  if (error) return (<div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-lg animate-bounce">
                      <span className="mr-2">⚠️</span> Error: {error}
                    </div>)

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

         {/* Error Message Display (added)*/}
         {errorMessage && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
              {errorMessage}
            </div>
          )}

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
              {/* Profile Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.profileTitle}
                </h1>
              </div>

              {/* Profile Card */}
              <div className="rounded-lg border border-gray-500 bg-white p-5 my-5 flex items-center w-full max-w-[full]">
                
                {/* User data */}
                {<><label className="cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload} />
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Picture"
                      className="rounded-full w-20 h-20 mr-5 object-cover border-2 border-gray-300" />
                  ) : (
                    <i className="fas fa-user-circle text-gray-400 text-6xl mr-5"></i>
                  )}
                </label>

                <div className="flex flex-col">
                    {userDetails ? (
                      <>
                        <h3 className="font-bold">{userDetails.username}</h3>
                        <h4 className="text-gold">{userDetails.role}</h4>
                        <span className="text-gray-500">
                          Date Joined: <span id="datetime">{userDetails.createdDate}</span>
                        </span>
                      </>
                    ) : (
                      <p>Loading user data...</p>
                    )}
                  </div></>
                } 
              </div>

              {/* Navigation Options */}
              <a
                href="/settings"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">{translations.generalSettings}</div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  {translations.generalSettingsDescription}
                </div>
              </a>
              
              {userDetails.role !== "User" && (
                <a
                href="/profile/AddUser"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">{translations.addUser}</div>
                <div className="font-bold text-gray-500 text-right">
                  {translations.addUserDescription}
                </div>
              </a>
              )}
              
              <a
                href="/users"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">{translations.allUsers}</div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  {translations.allUsersDescription}
                </div>
              </a>

              <a
                href="/change&password"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">{translations.changePassword}</div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  {translations.changePasswordDescription}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;

{/* Login and register
                <a
                  href="/login"
                  className="button2 bg-green-500 text-white text-center text-2xl w-[20%] h-[110%] rounded-[1rem] mx-auto"
                >
                  {translations.sign_in}
                </a>{" "}
                <a
                  href="/register"
                  className="button2 bg-blue-500 text-white text-center text-2xl w-[20%] h-[110%] rounded-[1rem] mx-auto"
                >
                  {translations.register}
                </a> */}
