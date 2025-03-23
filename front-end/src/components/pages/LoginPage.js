import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import translationsMap from "../locales/translationsMap";
import bgVideo from "../../video/bg.mp4";

function LoginPage() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent scrolling when LoginPage is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, []);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Language settings
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      setRedirectMessage(
        response.data.message || "Login Successful! Redirecting..."
      );

      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setTimeout(() => {
        navigate("/");
        localStorage.setItem("started", "true");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data || "Invalid credentials. Please try again."
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    setLoading(false);
  };

  const setStartupFalse = () => {
    localStorage.setItem("started", "false");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="flex justify-between items-center relative z-[1000]">
        <div className="relative w-full bg-black backdrop-blur-xl rounded-lg flex items-center px-6 py-8 shadow-lg">
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
      
      
      <div className="absolute inset-0 backdrop-blur-md"></div>
      
      
      {/* Main Login Container */}
      <div className="relative flex flex-col items-center justify-start h-full mt-10">
        {/* Overlay Blur for a Glassmorphism Effect */}

        {/* Login Card */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl w-[90%] md:w-[40%] lg:w-[30%] p-8 shadow-2xl z-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="./image/NZHome.png"
              alt="NZ Home Logo"
              className="w-1/3 mx-auto drop-shadow-lg"
            />
          </div>

          <h2 className="text-white text-center text-3xl font-bold tracking-wide">
            {translations.sign_in}
          </h2>

          {/* Redirect Message */}
          {redirectMessage && (
            <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-md px-4 py-2 rounded-md shadow-lg animate-fadeIn">
              {redirectMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-600 text-white text-md p-2 rounded-lg shadow-md text-center mt-4">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                ref={emailRef}
                required
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="text-right mb-4">
              <Link
                to="/change&password"
                className="text-green-300 hover:text-green-400 text-sm transition"
              >
                {translations.forgot_password}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:opacity-80 transition duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? "Loading..." : translations.sign_in}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-white/20" />
            <span className="mx-4 text-white">{translations.or}</span>
            <hr className="flex-grow border-white/20" />
          </div>

          {/* Register Button */}
          <Link to="/register">
            <button
              type="button"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 shadow-lg"
            >
              {translations.register}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
