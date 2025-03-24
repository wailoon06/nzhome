import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"; // Import BarChart components
import LOWWIFI from '../../image/LOWWIFI.png';
import MIDDLEWIFI from '../../image/MIDDLEWIFI.png';
import GOODWIFI from '../../image/GOODWIFI.png';
import PendingPayment from '../../image/PendingPayment.png';


function InternetUsagePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const navigate = useNavigate("");

  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];


  // Chart
  const [todayInternetUsage, setTodayInternetUsage] = useState(0);
  const [monthlyInternetUsage, setMonthlyInternetUsage] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [networkSpeed, setNetworkSpeed] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1); // Default to January
  const [barChartData, setBarChartData] = useState([]); // State for bar chart data

  // Handle month changes (year dropdown is fixed to 2025)
  const handleMonthChange = (e) => setSelectedMonth(Number(e.target.value));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token missing.");
      setLoading(false);
      navigate("/login");
      return;
    }
  
    axios
      .get("https://humdrum-beef-production.up.railway.app/api/internet", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
  
        if (!Array.isArray(response.data)) {
          setError("Unexpected API response format.");
          setLoading(false);
          return;
        }
  
        const monthlyData = {};
        let todayUsage = 0;
        let monthlyUsage = 0;
        const today = new Date().toISOString().slice(0, 10); // Get today's date YYYY-MM-DD
        const currentMonth = today.slice(0, 7); // Get current month YYYY-MM
  
        response.data.forEach((item) => {
          if (!item.date || typeof item.usage !== "number") {
            console.error("Invalid data format:", item);
            return;
          }
  
          const month = item.date.slice(0, 7); // Extract YYYY-MM
          if (!monthlyData[month]) {
            monthlyData[month] = { total: 0, count: 0 };
          }
          monthlyData[month].total += item.usage;
          monthlyData[month].count++;
  
          // Calculate today's total usage
          if (item.date === today) {
            todayUsage += item.usage;
          }
  
          // Calculate current month's total usage
          if (month === currentMonth) {
            monthlyUsage += item.usage;
          }
        });
  
        console.log("Today's Usage:", todayUsage);
        console.log("Monthly Usage:", monthlyUsage);
  
        setTodayInternetUsage(todayUsage);
        setMonthlyInternetUsage(monthlyUsage);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching internet usage:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });


      /* Next payment date */
      
      // Get current date
      const currentDate = new Date();

      // Calculate first day of next month
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      // Format date as "DD/MM/YYYY"
      const formattedNextPaymentDate = nextMonth.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      setNextPaymentDate(formattedNextPaymentDate);


      /* Network speed */

      const interval = setInterval(() => {
        // Generate a random speed between 20and 50 MB/s
        const newSpeed = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
        setNetworkSpeed(newSpeed);
      }, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup on unmount

  }, []);
  
  // Fetch weekly data for the selected month
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token missing.");
      setLoading(false);
      navigate("/login");
      return;
    }

    axios
      .get("https://humdrum-beef-production.up.railway.app/api/internet", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("API Response:", response.data);

        if (!Array.isArray(response.data)) {
          setError("Unexpected API response format.");
          setLoading(false);
          return;
        }

        // Filter data for the selected month
        const selectedMonthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
        const filteredData = response.data.filter((item) =>
          item.date.startsWith(selectedMonthKey)
        );

        // Aggregate data by week
        const weeklyData = {};
        filteredData.forEach((item) => {
          const week = Math.ceil(new Date(item.date).getDate() / 7); // Calculate week number
          if (!weeklyData[week]) {
            weeklyData[week] = 0;
          }
          weeklyData[week] += item.usage; // Sum usage for the week
        });

        // Convert to bar chart format
        const formattedData = Object.keys(weeklyData).map((week) => ({
          name: `Week ${week}`,
          usage: weeklyData[week],
        }));

        console.log("Formatted Weekly Data:", formattedData);
        setBarChartData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching internet usage:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, [selectedYear, selectedMonth]);

  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
      <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
         </div>
         
        {/* Main Content */}
        <div className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}>
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} translations={translations} />
            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1 gap-4">
              {/* Internet Usage Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.internetUsage}
                </h1>
              </div>
          
              {/* ==================== */}
              <div className="grid grid-cols-2 mt-2 gap-4">
                <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-2 h-[430px]">
                  <img
                    src={
                      networkSpeed < 10
                        ? LOWWIFI
                        : networkSpeed < 40
                        ? MIDDLEWIFI
                        : GOODWIFI
                    }
                    className="rounded-lg mb-4"
                    style={{ height: "120px", width: "110px" }}
                  />
                  <div className="teal-text text-sm sm:text-base w-full font-bold text-center mb-2">
                    {translations.network}
                  </div>
                  <div className="teal-text text-2xl sm:text-3xl lg:text-4xl w-full text-center mb-2">
                    {networkSpeed} Mbps
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-4">
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-2 h-[200px]">
                    <div className="flex flex-col justify-center items-center gap-4 text-center">
                    {/* <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4"> */}
                      {/* <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2 font-bold text-xl">{translations.internet_used}</div>
                        <div className="grid grid-cols-2 w-full">
                          <div className="teal-text w-full font-bold mb-2 text-lg">
                            {translations.today}
                          </div>
                          <div className="teal-text font-bold w-full mb-2 text-lg">
                            {translations.monthly}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 w-full" >
                          <div className="teal-text text-2xl w-full mb-2">
                            {todayInternetUsage} GB
                          </div>
                          <div className="teal-text text-2xl w-full mb-2">
                            {monthlyInternetUsage} GB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-2 h-[207px]">
                    <div className="flex items-center gap-4 h-full">
                    <div class="px-32 ">
                      {/* Image on the left */}
                      <img
                        src={PendingPayment}
                        alt=""
                        className="rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      />
                      </div>
                      {/* Text on the right */}
                      <div className="flex flex-col justify-center">
                        <div className="mb-2 font-bold text-left text-xl">{translations.next_payment_date}</div>
                        <div className="teal-text text-2xl text-left">{nextPaymentDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-2 rounded-lg"
                style={{ height: "400px" }}
              >
                {/* Title */}
                <h2 className="text-center text-2xl font-bold mb-4 pr-42">
                      {translations.monthlyInternet}
                </h2>
                <h2 className="text-center text-2xl mb-4">{translations.internetUsageChart}</h2>
                <h2 className="text-center text-2xl font-bold mb-4 pr-44">{translations.weeklyInternet}</h2>
                {loading ? (
                  <p className="text-center">{translations.loading}</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : (
                  <div className="flex justify-center items-center gap-2">
                    <BarChart
                      width={600}
                      height={300}
                      data={barChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" fill="#8884d8" />
                    </BarChart>
                    <div className="flex justify-center gap-4 mt-4">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={selectedYear}
                        disabled // Fixed to 2025
                      >
                        <option value={2025}>2025</option>
                      </select>
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternetUsagePage;
