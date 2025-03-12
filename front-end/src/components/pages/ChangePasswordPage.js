import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import axios from "axios";

function ChangePasswordPage() {
  const navigate = useNavigate();

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
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/api/getUserDetails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUserDetails(response.data);
      })
      .catch(error => {
        console.error("Error fetching user details:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    if (token) {
        if (newPassword !== confirmPassword) {
          alert("New password is not matched!");
          window.location.reload();
          setLoading(false);
          return ;
        }
        
        if (oldPassword === newPassword) {
          alert("New password is same as old password!");
          window.location.reload();
          setLoading(false);
          return ;
        }

        axios   
          .put("http://localhost:8080/api/changePassword", 
            {email: userDetails.email, oldPassword, newPassword}, 
            {headers: { Authorization: `Bearer ${token}`}}
          )
          .then((response) => {
            console.log(response.data);
            alert("Password successfully change!");
            setLoading(false);
            navigate("/profile");
          })
          .catch((error) => {
            handleError(error);
          });
 
    } else {
      if (newPassword !== confirmPassword) {
        alert("New password is not matched!");
        window.location.reload();
        setLoading(false);
        return ;
      }
  
      if (oldPassword === newPassword) {
        alert("New password is same as old password!");
        window.location.reload();
        setLoading(false);
        return ;
      }
    
      axios   
        .put("http://localhost:8080/api/forgetPassword", {email, oldPassword, newPassword})
        .then((response) => {
          console.log(response.data);
          alert("Password successfully change!");
          setLoading(false);
          navigate("/login");
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
      alert("Error changing password: " + JSON.stringify(error.response.data));
    } else {
      alert("Error changing password: " + error.message);
    }
    window.location.reload();
  };

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
              {localStorage.getItem('token') ? (
                <input
                type="email"
                name="email"
                placeholder={translations.email}
                value={userDetails?.email}
                disabled
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
                autoComplete="email"
              />
              ) : (
                <input
                type="email"
                name="email"
                placeholder={translations.email}
                onChange={handleEmailChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
                autoComplete="email"
              />
              )}
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password2"
                placeholder={translations.passwordOld}
                onChange={handleOldPasswordChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password1"
                placeholder={translations.password}
                onChange={handleNewPasswordChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password2"
                placeholder={translations.confirm_password}
                onChange={handleConfirmPasswordChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <button
              type="submit"
              className="button1 bg-blue-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
              // onClick={handleButtonClick}
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
