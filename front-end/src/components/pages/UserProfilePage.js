import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // const { name } = useParams();a

  // useEffect(() => {
  //   const now = new Date();
  //   const dateOnly = now.toLocaleDateString();
  //   document.getElementById("datetime").innerHTML = dateOnly;
  // }, []);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
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
                <a href="/profile" className="mr-8">
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
              {/* Profile Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  Profile
                </h1>
              </div>

              {/* Profile Card */}
              <div className="rounded-lg border border-gray-500 bg-white p-5 my-5 flex items-center w-full max-w-[full]">
                {/* <img
                  src="https://static3.depositphotos.com/1000951/138/i/600/depositphotos_1380772-stock-photo-profile-of-beautiful-smiling-girl.jpg"
                  alt="Profile Picture"
                  className="rounded-full w-16 h-16 mr-5"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold">Camilia Olson</h3>
                  <h4 className="text-gold">Admin</h4>
                  <span className="text-gray-500">
                    Date Joined: <span id="datetime"></span>
                  </span>
                </div> */}
                <a
                  href="/login"
                  className="button2 bg-green-500 text-white text-center text-2xl w-[20%] h-[110%] rounded-[1rem] mx-auto"
                >
                  Login
                </a>{" "}
                <a
                  href="/register"
                  className="button2 bg-blue-500 text-white text-center text-2xl w-[20%] h-[110%] rounded-[1rem] mx-auto"
                >
                  Register
                </a>
              </div>

              {/* Navigation Options */}
              <a
                href="/settings"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">General Settings</div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  Languages, Notifications, Feedback, Security, Privacy
                </div>
              </a>

              <a
                href="/profile/AddUser"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">Add User </div>
                <div className="font-bold text-gray-500 text-right">
                  Add User to Your Home
                </div>
              </a>

              <a
                href="/users"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">All Users </div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  View The Amount of Existing Users
                </div>
              </a>

              <a
                href="/change&password"
                className="grid grid-cols-2 rounded-lg border border-gray-500 bg-white p-5 my-2.5 w-full max-w-full"
              >
                <div className="font-bold">Change Password </div>{" "}
                <div className="font-bold text-gray-500 text-right">
                  Change your account's password
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
