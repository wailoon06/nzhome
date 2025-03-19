import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";

function UserProfilePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); //added
  const [errorMessage, setErrorMessage] = useState("");     //added

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Languages
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];


  // Form handling
  const [rows, setRows] = useState([{ username: "", email: "", password: "" }]);
  
  // Add new row for registration
  const addRow = () => {
    setRows([...rows, { username: "", email: "", password: "" }]);
  };


  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");    //added
    setSuccessMessage("");  //added

    // Set password equal to username for each row and filter out empty entries
    const filteredRows = rows
      .map((row) => ({
        ...row,
        password: row.username, // Set password equal to username
      }))
      .filter((row) => row.username && row.email);

    if (filteredRows.length === 0) {
      alert(translations.noValidData || "No valid data to submit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get token
      const token = localStorage.getItem("token");

      // Submit all users in parallel
      const responses = await Promise.all(
        filteredRows.map((row) =>
          axios
            .post("http://localhost:8080/api/registerUser", row, {
              headers: { Authorization: `Bearer ${token}` },
            })
            // .then((response) => {
            //   console.log("Registered successfuly", response);
            //   alert(response.data.toString());
            //   navigate("/users");
            // })
            // .catch((error) => {
            //   console.error("Login error:", error);
            //   if (error.response) {
            //     console.log("Response data:", error.response.data);
            //     console.log("Response status:", error.response.status);
            //     alert(error.response.data.toString());
            //   }
            //   window.location.reload();
            // })
        )
      );

      // Set success message (added)
      setSuccessMessage("Users added successfully!");
      
      // Start redirect animation, then navigate (added)
      setTimeout(() => {
        navigate("/users");
      }, 2000);

  //   } catch (err) {
  //     console.error("Error uploading image: ", err);
  //     if (error.response) {
  //       if (error.response.status === 401) {
  //         alert("Session expired. Please log in again.");
  //         localStorage.removeItem("token");
  //         navigate("/login");
  //       } else {
  //         alert(error.response.data.message);
  //       }
  //     } else {
  //       alert("An unexpected error occurred.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

      //replace with this catch (testing only)
      }catch (err) {
      console.error("Registration error:", err);
      
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          console.log("Session expired!");
          setErrorMessage("Session expired. Please log in again.");
          
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("selectedDevice");
            navigate("/login");
          }, 2000);
        } else {
          setErrorMessage(err.response.data?.toString() || "Error adding users!");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
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

            {/* Success Message Display (added)*/}
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

            {/* <!-- Main Content --> */}
            <div className="flex flex-col flex-1">
              {/* Profile Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/profile">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.addUser}
                </h1>
              </div>

              {/* Add User */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-rows-[auto] gap-4 text-center items-center justify-center">
                  {rows.map((row, index) => (
                    <div key={`row-${index}`} className="flex flex-col gap-2">
                      <input
                        className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                        type="text"
                        placeholder={translations.enterUserNameForRow.replace(
                          "{index}",
                          index + 1
                        ) || `Enter username for row ${index + 1}`}
                        value={row.username}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index] = {
                            ...newRows[index],
                            username: e.target.value,
                          };
                          setRows(newRows);
                        }}
                      />
                      <input
                        className="text-center rounded-lg border border-gray-500 bg-white p-4 w-full max-w-[400px]"
                        type="email"
                        placeholder={translations.enterEmailForRow.replace(
                          "{index}",
                          index + 1
                        )}
                        value={row.email}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index] = {
                            ...newRows[index],
                            email: e.target.value,
                          };
                          setRows(newRows);
                        }}
                      />
             
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={addRow}
                      className="fas fa-plus text-center rounded-lg border border-gray-500 bg-white p-4 flex items-center justify-center w-12 h-12"
                    ></button>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    // onClick={() => navigate("/users")}
                    className="bg-blue-500 text-white p-4 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
