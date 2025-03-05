import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import enTranslations from "../locales/en.json";
import zhTranslations from "../locales/zh.json";

const translationsMap = {
  en: enTranslations,
  zh: zhTranslations,
};

function ChangePasswordPage() {
  const navigate = useNavigate();

  const handleButtonClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate("/");
  };

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || enTranslations;

  return (
    <div className="baseBG border border-black px-4 pt-3 grid grid-rows-[5rem_1fr] flex-1 h-screen">
      {/* Main Content Header */}
      <div className="flex justify-between items-center relative">
        <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
          {/* Centered Text */}
          <h1 className="font-bold text-white flex-grow text-center lg:text-4xl titleGold">
            {translations.title}
          </h1>
        </div>
      </div>

      <div className="baseGreen rounded-lg w-[70%] sm:w-[30%] mt-10 mb-12 mx-auto">
        <div className="text-center">
          <img
            src="./image/NZHome.png"
            alt="NZ Home Logo"
            className="w-3/5 sm:w-2/5 mx-auto -mb-6"
          />
          <h2 className="mb-4 subtitle text-white">
            {translations.change_password}
          </h2>

          <form>
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
