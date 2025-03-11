import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import axios from "axios";
import jwtDecode from "jwt-decode";

function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    axios   
      .post("http://localhost:8080/api/changePassword", {email, oldPassword, newPassword})
      .then((response) => {
        console.log(response.data);
        alert("Password successfully change");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Change Password Error: ", error);
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          alert("Error registering user: " + JSON.stringify(error.response.data));
        } else {
          alert("Error registering user: " + error.message);
        }
      });
  };

  const handleButtonClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate("/");
  };

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG border border-black px-4 pt-3 grid grid-rows-[5rem_1fr] flex-1 h-screen">
      {/* Main Content */}
      <div className="main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto">
        <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
          {/* Main Content Header */}
          <div className="flex justify-between items-center relative">
            <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
              {/* Centered Text */}
              <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
                {translations.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="baseGreen rounded-lg w-[70%] sm:w-[30%] mt-10 mb-12 mx-auto grid grid-rows-[auto,1fr]">
        <a className="mt-3 relative pl-4" href="/profile">
          <i className="fa fa-2x fa-arrow-left text-white"></i>
        </a>
        <div className="text-center">
          <img
            src="./image/NZHome.png"
            alt="NZ Home Logo"
            className="w-3/5 sm:w-2/5 mx-auto -mb-6"
          />
          <h2 className="mb-4 subtitle text-white">
            {translations.change_password}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder={translations.email}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
                autocomplete="email"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password2"
                placeholder={translations.passwordOld}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password1"
                placeholder={translations.password}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password2"
                placeholder={translations.confirm_password}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <button
              type="button"
              className="button1 bg-blue-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
              onClick={handleButtonClick}
            >
              {translations.reset}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
