import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import translationsMap from "../locales/translationsMap";

function RegisterPage() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8080/api/register",
        { username, email, password }
      )
      .then((response) => {
        console.log(response.data);
        alert(response.data);
        navigate("/login"); // Redirect after successful registration
      })
      .catch((error) => {
        console.error("Registration error:", error);
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

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  return (
    <div className="baseBG border border-black px-4 pt-3 grid grid-rows-[5rem_1fr] flex-1 h-screen">
      <div className="flex justify-between items-center relative">
        <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
          {/* Centered Text */}
          <h1 className="flex-grow text-center lg:text-4xl titleGold">
            <a href="/">{translations.title}</a>
          </h1>
        </div>
      </div>

      <div className="baseGreen rounded-lg w-[30%] mt-10 mb-12 mx-auto">
        <div className="text-center">
          <img
            src="./image/NZHome.png"
            alt="NZ Home Logo"
            className="w-2/5 mx-auto -mb-6"
          />
          <h2 className="mb-4 subtitle text-white">{translations.register}</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                username="username"
                placeholder={translations.username}
                value={username}
                onChange={handleUsernameChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder={translations.email}
                value={email}
                onChange={handleEmailChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder={translations.password}
                value={password}
                onChange={handlePasswordChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <p className="pText text-white">
              <input
                type="checkbox"
                name="checkbox"
                required
                className="mr-2"
              />
              {translations.term1}
              <a href=" " className="terms">
                {translations.term2}
              </a>
            </p>

            <button
              type="submit"
              className="button1 bg-green-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
            >
              {translations.register}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
