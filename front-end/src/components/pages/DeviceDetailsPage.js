import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DeviceDetailsPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];

  const { deviceid, name, type } = useParams();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [energyDetails, setEnergyDetails] = useState([]);

  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/getDeviceDetails",
        { deviceid: deviceid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeviceDetails(response.data);
    } catch (err) {
      if (err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, []);

  const fetchEnergyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/getEnergy", {
        headers: { Authorization: `Bearer ${token}` },
        params: { deviceid: deviceid },
      });

      setEnergyDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("Session expired!");
        alert("Session expired!");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedDevice");
        navigate("/login");
      }
      setError("An unexpected error occurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergyDetails();
  }, []);

  const transformedData = energyDetails.map((entry) => ({
    date: entry.date,
    energy: entry.energyConsumption,
  }));

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Format yesterday's date to match API response format (YYYY-MM-DD)
  const formattedYesterday = yesterday.toISOString().split("T")[0];
  const formattedToday = today.toISOString().split("T")[0];

  // Get this month's year and month in YYYY-MM format
  const currentMonth = today.toISOString().slice(0, 7); // "YYYY-MM"

  const todayEnergy = energyDetails.find(
    (entry) => entry.date === formattedToday
  );
  // Find yesterday's energy consumption
  const yesterdayEnergy = energyDetails.find(
    (entry) => entry.date === formattedYesterday
  );

  // Filter energy consumption for this month
  const monthlyData = energyDetails.filter((entry) =>
    entry.date.startsWith(currentMonth)
  );

  // Calculate monthly average consumption
  const monthlyAverage =
    monthlyData.length > 0
      ? (
          monthlyData.reduce((sum, entry) => sum + entry.energyConsumption, 0) /
          monthlyData.length
        ).toFixed(2)
      : "N/A";

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
          <Sidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            language={language}
          />
        </div>

        {/* Main Content */}
        <div className="main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto">
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
              <div className="flex flex-col flex-1 gap-4">
                {/* Header with Back Button */}
                <div className="flex items-center mt-5 w-full">
                  <a
                    className="relative pl-4 transition-transform hover:scale-105"
                    href="/"
                  >
                    <i className="fa fa-2x fa-arrow-left hover:text-gray-600"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl font-bold w-full ml-[-5%]">
                    {name}{" "}
                    <span className="text-gray-500 font-normal">({type})</span>
                  </h1>
                </div>

                {/* Main Dashboard Content */}
                <div className="mt-2 gap-4 rounded-lg bg-white shadow-md">
                  {/* Device Status Section */}
                  <div className="p-3">
                    <div className="flex justify-center items-center p-3">
                      <div className="flex flex-col items-center gap-4 p-4">
                        <div className="relative">
                          <img
                            src={deviceDetails.picture}
                            alt={deviceDetails.deviceName}
                            className="border border-black rounded-lg mb-4 mx-auto object-contain shadow-sm"
                            style={{ height: "100px", width: "100px" }}
                          />
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-2xl py-1 px-4 mb-2 rounded-full text-white inline-block ${
                              deviceDetails.onOff == "On"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {deviceDetails.onOff == "On"
                              ? "Online"
                              : translations.offline}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Energy Chart Section */}
                  <div className="p-3">
                    <div className="flex justify-center items-center p-3">
                      <div className="rounded-lg bg-white p-4 shadow-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-center flex items-center justify-center">
                          <i className="fa fa-bolt mr-2 text-yellow-500"></i>
                          Energy Consumption Over Time
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={transformedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                            <Legend />
                            <Bar
                              dataKey="energy"
                              fill="#8884d8"
                              name="Energy Consumption (kWh)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Energy Stats Cards - 2 Column Grid */}
                  <div className="grid grid-cols-2 p-4 gap-4">
                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">Yesterday</div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {todayEnergy
                            ? `${todayEnergy.energyConsumption} kWh`
                            : "N/A"}
                        </div>
                        {todayEnergy && yesterdayEnergy && (
                          <div className="text-sm text-gray-600">
                            {Number(todayEnergy.energyConsumption) >
                            Number(yesterdayEnergy.energyConsumption) ? (
                              <span className="text-red-500">
                                ↑{" "}
                                {(
                                  ((Number(todayEnergy.energyConsumption) -
                                    Number(yesterdayEnergy.energyConsumption)) /
                                    Number(yesterdayEnergy.energyConsumption)) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            ) : (
                              <span className="text-green-500">
                                ↓{" "}
                                {(
                                  ((Number(yesterdayEnergy.energyConsumption) -
                                    Number(todayEnergy.energyConsumption)) /
                                    Number(yesterdayEnergy.energyConsumption)) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">
                          {translations.today}
                        </div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {yesterdayEnergy
                            ? `${yesterdayEnergy.energyConsumption} kWh`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Average Card */}
                  <div className="p-4 flex justify-center items-center">
                    <div className="rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors p-4 shadow-sm sm:w-1/2 md:w-[35%]">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 font-medium">March Average</div>
                        <div className="teal-text text-2xl font-bold mb-2">
                          {monthlyAverage} kWh
                        </div>
                        <div className="text-sm text-gray-500">
                          Daily average consumption
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    key={name}
                    to={`/devices/${type}/${name}/details/setAction`}
                    className="block"
                  >
                    <div className="p-4 flex justify-center items-center">
                      <div className="rounded-lg border-2 border-gray-300 bg-black hover:bg-gray-800 transition-colors items-center gap-4 p-4 sm:w-1/2 md:w-[35%] shadow-sm">
                        <div className="text-center">
                          <div className="text-2xl text-white flex items-center justify-center">
                            <i className="fa fa-cog mr-2"></i>
                            {translations.set_action}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetailsPage;
