import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NZHome2 from "./image/NZHome2.jpg";
import translationsMap from "./components/locales/translationsMap";
import bgVideo from "./video/bg.mp4";

function LandingPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const [animate, setAnimate] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Trigger animation after component mount
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 500); // Animation delay (500ms)

    return () => clearTimeout(timeout);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("started", "true"); // Save flag
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          loop
          muted
        />
      </div>

      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Header Section */}
      <header className="relative w-full flex items-center bg-black shadow-md px-6 py-1 md:px-10">
        <div className="grid grid-cols-3 w-full items-center">
          {/* Logo */}
          <div className="flex">
            <img
              src={NZHome2}
              alt="NZ Home Logo"
              className="w-[60px] md:w-20"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-6 lg:space-x-12 justify-center text-[1.2rem] text-white">
            <a href="#" className="hover:text-orange-500">
              About Us
            </a>
            <a href="#" className="hover:text-orange-500">
              Contact Us
            </a>
          </nav>

          {/* Buttons */}
          <div className="hidden md:flex space-x-3 ml-auto text-[1.2rem]">
            <a href="/login" className="hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full">
              Login
            </a>
            <a href="/register" className="hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full">
              Sign up
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="relative md:hidden w-full bg-black shadow-md flex flex-col items-center space-y-2 py-4 text-[1.2rem]">
          <a href="#" className="font-bold text-white hover:text-orange-500">
            Home
          </a>
          <a href="#" className="font-bold text-white hover:text-orange-500">
            Tools
          </a>
          <a href="#" className="font-bold text-white hover:text-orange-500">
            Development
          </a>
          <a href="#" className="font-bold text-white hover:text-orange-500">
            Contact us
          </a>
          <button className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40">
            Login
          </button>
          <button className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40">
            Sign up
          </button>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 md:px-12 text-white text-center">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 grid grid-rows-3">
          <h1
            className={`text-3xl md:text-4xl font-bold transition-transform transform ${
              animate ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            IOT Smart Home
          </h1>
          <p
            className={`mt-4 text-sm md:text-base transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className={`hover:bg-gray-800 font-bold bg-orange-500 mt-4 rounded-full px-6 py-2 border border-white text-white w-full md:w-[40%] transition-opacity ${
                animate ? "opacity-100" : "opacity-0"
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      {/* New Section with Text Animation */}
      <section className="grid grid-cols-3 relative w-full min-h-screen px-6 py-16 text-white flex items-center text-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gray-800 opacity-80"></div>

        {/* Content with Higher z-index */}
        <div className="relative w-full md:w-2/3 mx-auto z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore the Future of Smart Living
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Seamlessly connect and control your home appliances with our IoT
            solutions, all in one platform.
          </p>
          <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button>
        </div>
        {/* 2nd */}
        <div className="relative w-full md:w-2/3 mx-auto z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore the Future of Smart Living
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Seamlessly connect and control your home appliances with our IoT
            solutions, all in one platform.
          </p>
          <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button>
        </div>
        {/* 3rd */}
        <div className="relative w-full md:w-2/3 mx-auto z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore the Future of Smart Living
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Seamlessly connect and control your home appliances with our IoT
            solutions, all in one platform.
          </p>
          <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
