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

  // const handleGetStarted = () => {
  //   localStorage.setItem("started", "true"); // Save flag
  //   window.location.reload();
  // };

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
      <header className="fixed z-50 w-full flex items-center bg-black shadow-md px-6 py-1 md:px-10">
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
            <a href="/about" className="hover:text-orange-500">
              About Us
            </a>
            <a href="/contact" className="hover:text-orange-500">
              Contact Us
            </a>
          </nav>

          {/* Buttons */}
          {/* Buttons */}
          <div className="hidden md:flex space-x-3 ml-auto text-[1.2rem]">
            {!localStorage.getItem("token") ? (
              <>
                <a
                  href="/login"
                  className="hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full"
                >
                  Sign up
                </a>
              </>
            ) : (
              <></>
            )}
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
            className={`text-[3rem] md:text-[4rem] font-bold transition-transform transform ${
              animate ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            Net Zero Home
          </h1>
          <p
            className={`text-1xl md:text-[1.2rem] transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Experience the next generation of smart living with NZ Home, a
            cutting-edge Net Zero Smart Home designed to revolutionize the way
            you live. Our advanced technology seamlessly integrates energy
            efficiency, automation, and sustainability to create a home that’s
            intelligent, eco-friendly, and cost-effective.
          </p>
          <div className="flex justify-center">
            <a
              href="/login"
              // onClick={handleGetStarted}
              className={`hover:bg-gray-800 flex justify-center items-center font-bold bg-orange-500 mt-10 rounded-full px-6 py-2 border border-white text-white w-full h-[50%] md:w-[40%] transition-opacity ${
                animate ? "opacity-100" : "opacity-0"
              }`}
            >
              Get Started
            </a>
          </div>
        </div>
      </main>

      {/* New Section with Text Animation */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 relative w-full min-h-screen px-6 py-16 text-white flex items-center text-center">
        <div className="absolute top-6 w-full text-center z-20">
          <h1 className="text-4xl font-bold text-orange-500">
            Why Choose NZ Home?
          </h1>
        </div>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gray-800 opacity-80"></div>

        {/* Content with Higher z-index */}
        <div className="relative w-full md:w-2/3 mx-auto mt-5 z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Net Zero Energy Efficiency
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            NZ Home is designed to produce as much energy as it consumes, using
            advanced solar panels, smart energy storage, and AI-driven energy
            optimization.
          </p>
          {/* <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button> */}
        </div>
        {/* 2nd */}
        <div className="relative w-full md:w-2/3 mx-auto mt-5 z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Smart Automation
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Control your lighting, heating, cooling, and appliances remotely
            with our intuitive NZ Home App. Our AI-driven system learns your
            habits and optimizes energy use to save costs and reduce waste.
          </p>
          {/* <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button> */}
        </div>
        {/* 3rd */}
        <div className="relative w-full md:w-2/3 mx-auto mt-5 z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Sustainable Energy Management
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Monitor and manage your energy production and consumption in real
            time. NZ Home adapts to your lifestyle, ensuring efficiency without
            compromising comfort.
          </p>
          {/* <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button> */}
        </div>

        {/* 4th */}
        <div className="relative w-full md:w-2/3 mx-auto mt-5 z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Security & Connectivity
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Stay connected and secure with advanced IoT sensors, smart locks,
            AI-powered surveillance, and voice-controlled automation that keep
            your home safe and responsive.
          </p>
          {/* <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button> */}
        </div>

        {/* 5th */}
        <div className="relative w-full md:w-2/3 mx-auto mt-5 z-10">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Real-Time Data & Insights
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Get detailed reports on your energy usage, appliance efficiency, and
            environmental impact to make informed decisions for a greener
            lifestyle.
          </p>
          {/* <button
            className={`hover:bg-gray-800 border bg-orange-500 font-bold text-white px-6 py-3 rounded-full text-xl transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            Learn More
          </button> */}
        </div>
      </section>

      <footer className="relative w-full bg-black text-white py-6 text-center">
        <div className="container mx-auto">
          <p className="text-sm md:text-base">
            © {new Date().getFullYear()} NZ Home (Group 1). All Rights Reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-orange-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-orange-500">
              Terms of Service
            </a>
            <a href="#" className="hover:text-orange-500">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
