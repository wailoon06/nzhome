import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function AllUserPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");     //added
  const [successMessage, setSuccessMessage] = useState(""); //added

  // Add confirm dialog state
  const [confirmMessage, setConfirmMessage] = useState("");
  const [emailToDelete, setEmailToDelete] = useState("");

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const [userDetails, setUserDetails] = useState([]);

  // Handle error
  const handleApiError = (err) => {
    console.error("API Error:", err);

    if (err.response) {
      setError(err.response.data.message);

      if (err.response.status === 401) {
        // console.log("Session expired!");
        // localStorage.removeItem("token");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
    }
  };

  // Get users in family
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getUserFam",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserDetails(response.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Show confirm dialog
  const showConfirm = (email) => {
    setEmailToDelete(email);
    setConfirmMessage("Are you sure you want to delete this user?");
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setConfirmMessage("");
      setEmailToDelete("");
    }, 10000);
  };
  

  // // Handle delete submission
  // const handleDelete = async (email) => {
  //   // Double confirm
  //   if (!window.confirm("Are you sure you want to delete this user?")) {
  //     return;
  //   }

   // Handle confirm actions
   const handleConfirmYes = async () => {
    setConfirmMessage("");
    setLoading(true);

    try {
      // Get token
      const token = localStorage.getItem("token");

      // Delete user
      const response = await axios.delete(
        `http://localhost:8080/api/deleteUserFam`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { email: emailToDelete },
        }
      );

      // Update the user list after successful deletion
      setUserDetails((prevUsers) =>
        prevUsers.filter((user) => user.email !== emailToDelete)
      );

      // alert(response.data.message);
      // Show success message(added)
      setSuccessMessage(response.data.message || "User deleted successfully");
      
      // Auto-hide success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Delete error:", err);
      handleApiError(err);
      // window.location.reload();
    } finally {
      setLoading(false);
      setEmailToDelete();
    }
  };

  const handleConfirmNo = () => {
    setConfirmMessage("");
    setEmailToDelete("");
  };

  const [userRole, setUserRole] = useState("");

  const fetchUserRole = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Step 1: Get all devices
      const response = await axios.get(
        "http://localhost:8080/api/getUserDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserRole(response.data.role);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");
          
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

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

         {/* Success Message Display */}
         {successMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-50">
            {successMessage}
          </div>
        )}

        {/* Error Message Display (added)*/}
        {errorMessage && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
                {errorMessage}
              </div>
        )}

         {/* Confirm Dialog Display */}
         {confirmMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50 flex flex-col items-center">
            <div className="mb-2">{confirmMessage}</div>
            <div className="flex space-x-4">
              <button 
                onClick={handleConfirmYes}
                className="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Yes
              </button>
              <button 
                onClick={handleConfirmNo}
                className="bg-gray-500 text-white px-3 py-1 rounded-md"
              >
                No
              </button>
            </div>
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

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              {/* Setting Section */}
              <div className="grid grid-cols-[auto,1fr,auto] items-center mt-5 w-full">
                <a className="relative pl-4" href="/profile">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-4%]">
                  {translations.allUsers}
                </h1>
                {userRole === "Owner" && (<a href="/profile/AddUser">
                  <i className="fas fa-plus text-2xl"></i>
                </a>)}
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
                {!loading && !error && userDetails?.length > 0
                  ? userDetails.map((user, index) => (
                      // <div
                      //   onClick={() => handleNavigation("#")}
                      //   className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center justify-center text-center text-lg w-[85%] gap-4"
                      // >
                      <div
                        key={user.id || index}
                        onClick={() => handleNavigation(`/user/${user.id}`)}
                        className="grid grid-cols-[auto,1fr,auto] rounded-md border border-gray-500 bg-white p-4 mt-4 items-center justify-center text-center text-lg w-[85%] gap-4"
                      >
                        <h2>
                          {user.username} ({user.role})
                        </h2>
                        <div className="text-[14px] sm:text-2xl font-bold text-right">
                          {user.email}
                        </div>
                        {(userRole === "Owner" && user.role !== "Owner") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleDelete(user.email);
                              showConfirm(user.email);
                            }}
                            className="text-red-500 text-xl font-bold px-2"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
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
        </div>
      </div>
    </div>
  );
}

export default AllUserPage;
