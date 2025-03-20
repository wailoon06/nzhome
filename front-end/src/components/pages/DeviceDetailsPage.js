import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";


function DeviceDetailsPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // const deviceImages = {
  //   "Xiaomi Vacuum": "/image/xiaomi.jpeg",
  //   "Samsung TV": "/image/samsung.jpeg",
  //   "Philips Hue": "/image/light.jpeg",
  //   "LG Speaker": "/image/speaker.jpeg",
  //   "Nest Thermostat": "/image/thermostats.jpeg"
  // };
  // const deviceImage = deviceImages[name];

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
          headers: { Authorization: `Bearer ${token}` }
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
  }

  useEffect(() => {
    fetchDeviceDetails();
  }, []);
  
  const fetchEnergyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/getEnergy",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {deviceid: deviceid}
        }
      );

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
  }

  useEffect(() => {
    fetchEnergyDetails();
  }, []);

  const transformedData = energyDetails.map(entry => ({
    date: entry.date, 
    energy: entry.energyConsumption 
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

  const todayEnergy = energyDetails.find(entry => entry.date === formattedToday);
  // Find yesterday's energy consumption
  const yesterdayEnergy = energyDetails.find(entry => entry.date === formattedYesterday);

  // Filter energy consumption for this month
  const monthlyData = energyDetails.filter(entry => entry.date.startsWith(currentMonth));

  // Calculate monthly average consumption
  const monthlyAverage = monthlyData.length > 0
    ? (monthlyData.reduce((sum, entry) => sum + entry.energyConsumption, 0) / monthlyData.length).toFixed(2)
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
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                    {name} ({type})
                  </h1>
                </div>

                {/* ==================== */}
                <div className="grid grid-rows-[auto,1fr] mt-2 gap-4 rounded-lg bg-white">
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                          <img
                            src={deviceDetails.picture}
                            alt={deviceDetails.deviceName}
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div
                              className={`text-2xl w-full mb-2 rounded-full text-white inline-block ${
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
                  </div>{" "}
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className=" flex flex-cols justify-center items-center p-3">
                        {/* Bar Chart Section */}
                        <div className="rounded-lg bg-white p-4 shadow-md">
                          <h2 className="text-lg font-bold mb-4 text-center">Energy Consumption Over Time</h2>
                          <ResponsiveContainer width={800} height={300}>
                            <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="energy" fill="#8884d8" name="Energy Consumption (kWh)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-2 p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      {/* <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        {/* <div className="mb-2">{translations.today}</div> */}
                        <div className="mb-2">Yesterday</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          {todayEnergy ? `${todayEnergy.energyConsumption} kWh` : "N/A"}
                        </div>
                      </div>
                    </div>{" "}
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4">
                      {/* <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.today}</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          {yesterdayEnergy ? `${yesterdayEnergy.energyConsumption} kWh` : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="p-4 gap-4 flex justify-center items-center">
                    <div className="rounded-lg border-[2px] border-gray-300 grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                      {/* <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        {/* <div className="mb-2">{translations.today}</div> */}
                        <div className="mb-2">March Average</div>
                        <div className="teal-text text-2xl w-full mb-2">
                            {monthlyAverage} kWh
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <Link
                    key={name}
                    to={`/devices/${type}/${name}/details/setAction`}
                  >
                    <div className="p-4 gap-4 flex justify-center items-center">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-black items-center gap-4 p-4 sm:w-[50%] md:w-[35%]">
                        <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="text-2xl text-white">
                            {translations.set_action}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
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



