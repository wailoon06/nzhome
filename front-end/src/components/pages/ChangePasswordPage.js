import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import translationsMap from "../locales/translationsMap";
import bgVideo from "../../video/bg.mp4";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(""); //new added
  const [errorMessage, setErrorMessage] = useState(""); //new added

  // front
  const handleButtonClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate("/");
  };

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  //back
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/api/getUserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
          }
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); //new added
    setErrorMessage(""); //new added

    const token = localStorage.getItem("token");

    if (token) {
      if (newPassword !== confirmPassword) {
        // alert("New password is not matched!");
        // window.location.reload();
        setErrorMessage("New password is not matched!"); //new added
        setTimeout(() => {
          //new added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          window.location.reload();
        }, 5000);
        setLoading(false);
        return;
      }

      if (oldPassword === newPassword) {
        // alert("New password is same as old password!");
        // window.location.reload();
        setErrorMessage("New password cannot be the same as old password!"); //new added
        setTimeout(() => {
          //new added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          window.location.reload();
        }, 5000);
        setLoading(false);
        return;
      }

      axios
        .put(
          "http://localhost:8080/api/changePassword",
          { email: userDetails.email, oldPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log(response.data);
          // alert("Password successfully change!");
          setSuccessMessage("Password successfully changed! Redirecting..."); //new added
          setLoading(false);
          // navigate("/profile");
          setTimeout(() => {
            //new added
            navigate("/profile"); //new added
          }, 5000); //new added
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      if (newPassword !== confirmPassword) {
        // alert("New password is not matched!");
        // window.location.reload();
        setErrorMessage("New password is not matched!"); //new added
        setTimeout(() => {
          //new added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          window.location.reload();
        }, 5000);
        setLoading(false);
        return;
      }

      if (oldPassword === newPassword) {
        // alert("New password is same as old password!");
        // window.location.reload();
        setErrorMessage("New password cannot be the same as old password!"); //new added
        setTimeout(() => {
          //new added
          localStorage.removeItem("token");
          localStorage.removeItem("selectedDevice");
          window.location.reload();
        }, 5000);
        setLoading(false);
        return;
      }

      axios
        .put("http://localhost:8080/api/forgetPassword", {
          email,
          oldPassword,
          newPassword,
        })
        .then((response) => {
          console.log(response.data);
          // alert("Password successfully change!");
          setSuccessMessage(
            "Password successfully changed! Redirecting to login..."
          ); //new added
          setLoading(false);
          // navigate("/login");
          setTimeout(() => {
            //new added
            navigate("/login"); //new added
          }, 5000); //new added
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  const handleError = (error) => {
    setLoading(false);
    console.error("Change Password Error: ", error);
    if (error.response) {
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      // alert("Error changing password: " + JSON.stringify(error.response.data));
      setErrorMessage(
        "Error changing password: " + //new added
          (typeof error.response.data === "object" //new added
            ? JSON.stringify(error.response.data) //new added
            : error.response.data.toString())
      ); //new added
    } else {
      // alert("Error changing password: " + error.message);
      setErrorMessage("Error changing password: " + error.message); //new added
    }
    // window.location.reload();
    setTimeout(() => {
      //new added
      setErrorMessage(""); //new added
    }, 5000); //new added
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="flex justify-between items-center relative z-[1000]">
        <div className="relative w-full bg-black backdrop-blur-xl rounded-lg flex items-center px-6 py-8 shadow-lg">
          {/* Centered Text with Hover Effect */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl lg:text-4xl font-semibold text-white titleGold">
            <a
              href="/"
              className="hover:text-green-400 transition duration-300"
            >
              {translations.title}
            </a>
          </h1>
        </div>
      </div>

      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        src={bgVideo}
        autoPlay
        loop
        muted
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <div className="relative flex flex-col items-center justify-start h-full mt-[7%]">
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl w-[90%] md:w-[40%] lg:w-[30%] p-8 shadow-2xl z-10">
          <h2 className="text-white text-center text-3xl font-bold tracking-wide">
            {translations.change_password}
          </h2>
          {successMessage && (
            <div className="bg-green-500 text-white p-2 rounded-lg text-center mt-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-600 text-white p-2 rounded-lg text-center mt-4">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="">
              {localStorage.getItem("token") ? (
                <input
                  type="email"
                  name="email"
                  placeholder={translations.email}
                  value={userDetails?.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  autoComplete="email"
                />
              ) : (
                <input
                  type="email"
                  name="email"
                  placeholder={translations.email}
                  onChange={handleEmailChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                  autoComplete="email"
                />
              )}
            </div>
            <input
              type="password"
              placeholder={translations.old_password}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
            />
            <input
              type="password"
              placeholder={translations.new_password}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
            />
            <input
              type="password"
              placeholder={translations.confirm_password}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:opacity-80 transition duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? "Loading..." : translations.change_password}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
