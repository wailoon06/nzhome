import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NZHome2 from "./image/NZHome2.jpg";
import translationsMap from "./components/locales/translationsMap";
import bgVideo from "./video/bg.mp4";

function ContactPage() {
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
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Header Section */}
      <header className="fixed z-50 w-full flex items-center bg-black shadow-md px-6 py-1 md:px-10">
        <div className="grid grid-cols-3 w-full items-center">
          {/* Logo */}
          <a href="/">
            <div className="flex">
              <img
                src={NZHome2}
                alt="NZ Home Logo"
                className="w-[60px] md:w-20"
              />
            </div>
          </a>

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
          <a
            href="/contact"
            className="font-bold text-white hover:text-orange-500"
          >
            Contact Us
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
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 md:px-12 text-white text-center pt-[15%]">
        <div className="w-full md:w-1/2 grid grid-rows-3">
          <h1
            className={`text-[3rem] md:text-[4rem] font-bold transition-transform transform ${
              animate ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            Contact Us
          </h1>
          <p
            className={`text-1xl md:text-[1.2rem] transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            We’d love to hear from you! Whether you have questions, feedback, or
            need support, feel free to reach out to us.
          </p>
        </div>

        <div className="mt-8 w-full md:w-1/2 space-y-4">
          <form className="space-y-4" action="#" method="POST">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-lg font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-2 p-3 bg-gray-800 text-white rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-2 p-3 bg-gray-800 text-white rounded-md"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-lg font-semibold">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="mt-2 p-3 bg-gray-800 text-white rounded-md"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
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

export default ContactPage;
