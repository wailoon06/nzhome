import React, { useState, useEffect } from "react";
import {
  FaHandshake,
  FaLeaf,
  FaLightbulb,
  FaPeopleCarry,
} from "react-icons/fa";
import NZHome2 from "./image/NZHome2.jpg";
import translationsMap from "./components/locales/translationsMap";
import bgVideo from "./video/bg.mp4";

function AboutPage() {
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
              {translations.aboutUs}
            </a>
            <a href="/contact" className="hover:text-orange-500">
            {translations.contactUs}
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
                  {translations.loginButton}
                </a>
                <a
                  href="/register"
                  className="hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full"
                >
                  {translations.signUp}
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
          {translations.home}
          </a>
          <a
            href="/contact"
            className="font-bold text-white hover:text-orange-500"
          >
            {translations.contactUs}
          </a>
          <button className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40">
          {translations.loginButton}
          </button>
          <button className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40">
          {translations.signUp}
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
            {translations.aboutUs}
          </h1>
          <p
            className={`text-1xl md:text-[1.2rem] transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
         {translations.aboutUsp1}
          </p>
        </div>

        <div className="mt-8 w-full md:w-1/2 lg:w-2/3 space-y-4">
          <h2 className="text-2xl font-semibold text-orange-500">{translations.vision}</h2>
          <p className="text-lg text-white">
          {translations.aboutUsp2}
          </p>

          <br />

          <h2 className="text-2xl font-semibold text-orange-500 mt-9">
            {translations.value}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-6">
            {/* Value 1 */}
            <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all hover:scale-105 transform hover:bg-orange-500">
              <FaHandshake className="text-4xl mb-4" />
              <h3 className="text-xl font-semibold">{translations.collaboration}</h3>
              <p className="text-center mt-2">
              {translations.aboutUsp3}
              </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all hover:scale-105 transform hover:bg-green-500">
              <FaLeaf className="text-4xl mb-4" />
              <h3 className="text-xl font-semibold">{translations.susta}</h3>
              <p className="text-center mt-2">
              {translations.aboutUsp4}
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all hover:scale-105 transform hover:bg-blue-500">
              <FaLightbulb className="text-4xl mb-4" />
              <h3 className="text-xl font-semibold">{translations.inno}</h3>
              <p className="text-center mt-2">
              {translations.aboutUsp5}
              </p>
            </div>

            {/* Value 4 */}
            <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all hover:scale-105 transform hover:bg-purple-500">
              <FaPeopleCarry className="text-4xl mb-4" />
              <h3 className="text-xl font-semibold">{translations.comm}</h3>
              <p className="text-center mt-2">
              {translations.aboutUsp6}
              </p>
            </div>
          </div>
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

export default AboutPage;
