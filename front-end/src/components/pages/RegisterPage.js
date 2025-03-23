import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import translationsMap from "../locales/translationsMap";
import bgVideo from "../../video/bg.mp4";

function RegisterPage() {
  const navigate = useNavigate("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [familyName, sethandlefamilyNameChange] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCodeChange = (e) => setCode(e.target.value);
  const handlefamilyNameChange = (e) =>
    sethandlefamilyNameChange(e.target.value);

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/registerOwner",
        { username, email, password, familyName, code }
      );
      console.log(response.data);
      setMessage(
        response.data.message || "Registration Successful! Redirecting..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        setError(
          error.response.data.toString() ||
            "Registration failed. Please try again."
        );
      } else {
        setError("Error registering user: " + error.message);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const setStartupFalse = () => {
    localStorage.setItem("started", "false");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="flex justify-between items-center relative">
        <div className="relative w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center px-6 py-7 shadow-lg">
          {/* Centered Text with Hover Effect */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl lg:text-4xl font-semibold text-white titleGold">
            <a
              href="/"
              onClick={setStartupFalse}
              className="hover:text-green-400 transition duration-300"
            >
              {translations.title}
            </a>
          </h1>
        </div>
      </div>

      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        src={bgVideo}
        autoPlay
        loop
        muted
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-[-1]"></div>

      {/* Success Message */}
      {message && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm px-3 py-2 rounded-md">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Registration Container */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-[80%] sm:w-[60%] lg:w-[35%] mt-10 mb-12 mx-auto p-6 shadow-xl">
          {/* Logo */}
          <div className="text-center">
            <img
              src="./image/NZHome.png"
              alt="NZ Home Logo"
              className="w-2/5 mx-auto -mb-4"
            />
            <h2 className="text-white text-2xl font-bold m-3">
              {translations.register}
            </h2>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-1"
          >
            {/* Activation Code */}
            <input
              type="text"
              name="activCode"
              placeholder={translations.activCode}
              value={code}
              onChange={handleCodeChange}
              required
              className="w-[80%] px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Family Name */}
            <input
              type="text"
              name="familyName"
              placeholder={translations.familyName}
              value={familyName}
              onChange={handlefamilyNameChange}
              required
              className="w-[80%] px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder={translations.username}
              value={username}
              onChange={handleUsernameChange}
              required
              className="w-[80%] px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder={translations.email}
              value={email}
              onChange={handleEmailChange}
              required
              className="w-[80%] px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder={translations.password}
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-[80%] px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Terms & Conditions */}
            <p className="mt-4 text-white text-sm">
              <input
                type="checkbox"
                name="checkbox"
                required
                className="mr-2"
              />
              {translations.term1}
              <a href=" " className="text-green-400 underline ml-1">
                {translations.term2}
              </a>
            </p>

            {/* Register Button */}
            <button
              type="submit"
              className="w-[60%] mt-2 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 shadow-lg"
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

// const handleButtonClick = (event) => {
//   event.preventDefault(); // Prevent default form submission
//   navigate("/");
// };
