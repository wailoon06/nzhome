import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TestConnectionPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // State for connection status
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const { name } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted", { isConnected });
    navigate(`/devices`);
  };

  const handleTestConnectivity = () => {
    // Simulate testing connectivity
    setTimeout(() => {
      setIsConnected(true); // Set connection status to successful
    }, 1000); // Simulated delay
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
                  <a className="relative pl-4" href="/devices/new">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    Test {name}'s Connection
                  </h1>
                </div>

                {/* ==================== */}
                <form onSubmit={handleSubmit}>
                  <div className="rounded-lg border border-gray-300 bg-white">
                    <div className="grid grid-rows-[auto] p-4 flex justify-center items-center gap-4">
                      <div className="mb-9">
                        <p className="md:text-lg font-semibold">
                          Step 1 : Turn on the device
                        </p>
                        <p className="md:text-lg font-semibold">
                          Step 2 : Test Connection using the button below
                        </p>
                        <p className="md:text-lg font-semibold">
                          Step 3 : If connection is successful then proceed to
                          the next step
                        </p>
                        <p className="md:text-lg font-semibold">
                          Step 4 : Check message pop up shown on the “{name}”
                          device
                        </p>
                        <p className="md:text-lg font-semibold">
                          Step 5 : Click “Done”
                        </p>
                      </div>

                      {/* Test Connectivity Button */}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleTestConnectivity} // Call the test connectivity function
                          className="px-6 py-2 bg-gray-200 text-lg font-semibold rounded-md"
                        >
                          Test Connectivity
                        </button>
                      </div>

                      {/* Display Connection Status */}
                      {isConnected && (
                        <div className="flex justify-center">
                          <p className="text-green-500 text-lg font-semibold">
                            Connection Successful
                          </p>
                        </div>
                      )}

                      {/* Done Button - Shown only if isConnected is true */}
                      {isConnected && (
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white text-lg font-semibold rounded-md"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestConnectionPage;
