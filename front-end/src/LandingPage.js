import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NZHome2 from "./image/NZHome2.jpg";
import translationsMap from "./components/locales/translationsMap";
import bgVideo from "./video/bg.mp4";
import { GlobeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "en", label: "English" },
  { code: "ko", label: "Korean" },
  { code: "ms", label: "Malay" },
];

function LandingPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  //Language
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );
  const translations = translationsMap[language] || translationsMap["en"];

  const [selectedLang, setSelectedLang] = useState("");
  const handleLanguageChange = () => {
    const currentIndex = languages.indexOf(selectedLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];
    setSelectedLang(newLang);
    setLanguage(newLang);
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

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
      <header className="fixed z-[11000] w-full flex items-center bg-black shadow-md px-6 py-1 md:px-10">
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
            <a href="/about" className="hover:scale-105 hover:text-orange-500">
              {translations.aboutUs}
            </a>
            <a
              href="/contact"
              className="hover:scale-105 hover:text-orange-500"
            >
              {translations.contactUs}
            </a>
          </nav>

          {/* Buttons */}
          {/* Buttons */}
          <div className="hidden md:flex space-x-3 ml-auto text-[1.2rem]">
            {/* Language Dropdown */}
            <div className="z-[10000] fixed hidden md:flex items-center space-x-3 ml-auto text-[1rem] text-white">
              <div
                className="p-2 border border-gray-600 rounded-md bg-black flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <GlobeIcon className="w-5 h-5 text-gray-300 hover:text-white" />
                <span className="font-medium">
                  {languages.find((l) => l.code === language)?.label}
                </span>
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-[12rem] w-32 bg-black border border-gray-800 rounded-md shadow-lg"
                  >
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setLanguage(lang.code);
                          setDropdownOpen(false);
                        }}
                      >
                        {lang.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!localStorage.getItem("token") ? (
              <>
                <a
                  href="/login"
                  className="hover:scale-105 hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full"
                >
                  {translations.loginButton}
                </a>
                <a
                  href="/register"
                  className="hover:scale-105 hover:bg-gray-800 border bg-orange-500 font-bold text-white px-4 py-2 rounded-full"
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
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="z-[10000] fixed md:hidden w-full bg-black shadow-md flex flex-col items-center space-y-6 py-4 mt-[10%] text-[1.2rem]"
          >
            <a
              href="/about"
              className="font-bold text-white hover:text-orange-500"
            >
              {translations.aboutUs}
            </a>
            <a
              href="/contact"
              className="font-bold text-white hover:text-orange-500"
            >
              {translations.contactUs}
            </a>
            <a
              href="/login"
              className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40"
            >
              {translations.loginButton}
            </a>
            <a
              href="/register"
              className="border hover:bg-gray-800 bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-40"
            >
              {translations.signUp}
            </a>

            <div
              className="p-2 text-white border border-gray-600 rounded-md bg-black flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <GlobeIcon className="w-5 h-5 text-gray-300 hover:text-white" />
              <span className="font-medium">
                {languages.find((l) => l.code === language)?.label}
              </span>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-white left-[37.5%] top-[28%] transform -translate-x-1/2 -translate-y-1/2 w-32 bg-black border border-gray-800 rounded-md shadow-lg"
                >
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLanguage(lang.code);
                        setDropdownOpen(false);
                      }}
                    >
                      {lang.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 md:px-12 text-white text-center">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 grid grid-rows-3">
          <h1
            className={`text-[3rem] md:text-[4rem] font-bold transition-transform transform ${
              animate ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {translations.netzero}
          </h1>
          <p
            className={`text-1xl md:text-[1.2rem] transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp1}
          </p>
          <div className="flex justify-center">
            <a
              href="/login"
              // onClick={handleGetStarted}
              className={`hover:scale-105 hover:bg-gray-800 flex justify-center items-center font-bold bg-orange-500 mt-10 rounded-full px-6 py-2 border border-white text-white w-full h-[50%] md:w-[40%] transition-opacity ${
                animate ? "opacity-100" : "opacity-0"
              }`}
            >
              {translations.getStarted}
            </a>
          </div>
        </div>
      </main>

      {/* New Section with Text Animation */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 relative w-full min-h-screen px-6 py-16 text-white flex items-center text-center">
        <div className="absolute top-6 w-full text-center z-20">
          <h1 className="text-4xl font-bold text-orange-500">
            {translations.whyChoose}
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
            {translations.netEffi}
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp2}
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
            {translations.smartAuto}
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp3}
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
            {translations.susEner}
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp4}
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
            {translations.secConn}
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp5}
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
            {translations.realDataIns}
          </h2>
          <p
            className={`text-lg mb-6 transition-opacity ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          >
            {translations.nzp6}
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
            <a href="/about" className="hover:text-orange-500">
              {translations.aboutUs}
            </a>
            <a href="/contact" className="hover:text-orange-500">
              {translations.contactUs}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
