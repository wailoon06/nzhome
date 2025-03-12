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
  const navigate = useNavigate("");

  //Front
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  
  const translations = translationsMap[language] || translationsMap["en"];

  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  //Back
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:8080/api/getUserDetails', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Store user details in state
        setUserDetails(response.data);
        
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user details');
        
        // Handle token expiration or authentication issues
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Token expired or invalid - redirect to login
          console.log("Session expired!");
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
          setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Display user details
  // if (loading) return <div>Loading user details...</div>;
  if (error) return <div>Error: {error}</div>;

  // const { name } = useParams();

  // useEffect(() => {
  //   const now = new Date();
  //   const dateOnly = now.toLocaleDateString();
  //   document.getElementById("datetime").innerHTML = dateOnly;
  // }, []);

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

              <a
                href="/profile/AddUser"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">{translations.addUser}</div>
                <div className="font-bold text-gray-500 text-right">
                  {translations.addUserDescription}
                </div>
              </a>

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
