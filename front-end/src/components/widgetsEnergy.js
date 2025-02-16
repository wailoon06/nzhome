import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function WidgetsEnergy() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date.toLocaleDateString("en-US"));
  };

  return (
    <div className="grid grid-cols-2 p-4 gap-4 mb-4">
      {/* Widgets */}
      <div>
        <div className="baseGreen rounded-lg mb-4 p-4 flex flex-col justify-center">
          <img
            src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            alt=""
            className="rounded-lg mb-4"
            style={{ height: "170px" }}
          />
          <a href="/camera">
            <div className="relative bg-white text-gray-800 rounded-full text-[12px] md:text-[15px] lg:text-[18px] py-2 px-4 flex justify-center items-center cursor-pointer">
              Check Camera
            </div>
          </a>
        </div>

        <a href="#">
          <div className="mt-12">
            <div className="rounded-lg p-3 baseGreen flex flex-wrap gap-2 mt-2 overflow-hidden">
              {/* Weather Today */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg truncate">
                  Weather Today
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  Clear
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg truncate">
                  Temperature
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  20 °C
                </div>
              </div>

              {/* Device Status */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg truncate">
                  Device Status
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  Stable
                </div>
              </div>

              {/* Network */}
              <div className="bg-white rounded-lg p-2 teal-text flex-1 min-w-[120px] overflow-hidden">
                <div className="text-sm sm:text-base md:text-lg truncate">
                  Network
                </div>
                <div className="text-2xl sm:text-2xl md:text-3xl truncate">
                  500 mb/s
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="baseGreen rounded-lg mb-4 p-4 teal-text">
        {/* Date Picker */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative bg-white text-gray-800 rounded-full text-sm py-1 px-2 flex items-center cursor-pointer w-[170px] z-50">
            <i className="fas fa-calendar mr-2 text-gray-600"></i>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="bg-transparent border-0 cursor-pointer w-full"
            />
          </div>
        </div>

        {/* Energy Usage Section */}
        <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl mb-4">Energy Usage</h2>

          {/* Today Energy Usage */}

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden relative">
                <i className="fas fa-bolt text-lg mr-3"></i>
                <span className="text-sm sm:text-base">Today</span>
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-lg">
                    28.6 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
              <i className="fas fa-lock text-white text-2xl"></i>
            </div>
          </div>

          {/* This Month Energy Usage */}

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden relative">
                <i className="fas fa-bolt text-lg mr-3"></i>
                <span className="text-sm sm:text-base">This Month</span>
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-lg">
                    325.37 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
              <i className="fas fa-lock text-white text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Energy Generation Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-hidden relative">
          <h2 className="text-xl mb-4">Energy Generation</h2>

          <div className="relative">
            {/* Main Container */}
            <a href="#">
              <div className="flex flex-wrap items-center p-2 rounded-xl bg-gray-200 mb-3 overflow-hidden">
                {/* Icon */}
                <i className="fas fa-sun text-lg mr-3"></i>

                {/* Label */}
                <span className="text-sm sm:text-base md:text-lg truncate">
                  This Month
                </span>

                {/* Energy Value */}
                <div className="ml-auto font-bold w-full sm:w-auto text-left sm:text-right truncate">
                  <span className="block sm:inline text-xs sm:text-sm md:text-base">
                    400 kWh
                  </span>
                </div>
              </div>
            </a>

            {/* Overlay Div */}
            <div className="absolute top-0 left-0 w-full h-full lockBG flex justify-center items-center rounded-xl z-10">
              <i className="fas fa-lock text-white text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetsEnergy;
