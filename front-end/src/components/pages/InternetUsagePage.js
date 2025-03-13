import React, { useState, useEffect } from "react";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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
  const [internetUsageData, setInternetUsageData] = useState([]);
  const [todayInternetUsage, setTodayInternetUsage] = useState(0);
  const [monthlyInternetUsage, setMonthlyInternetUsage] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [networkSpeed, setNetworkSpeed] = useState(500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token missing.");
      setLoading(false);
      navigate("/login");
      return;
    }
  
    axios
      .get("http://localhost:8080/api/internet", { headers: { Authorization: `Bearer ${token}` } })
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
  
        // Convert to Pie Chart format
        const formattedData = Object.keys(monthlyData).map((month) => ({
          name: month,
          value: Math.round(monthlyData[month].total / monthlyData[month].count), // Round values
        }));
  
        console.log("Formatted Data:", formattedData);
        console.log("Today's Usage:", todayUsage);
        console.log("Monthly Usage:", monthlyUsage);
  
        setInternetUsageData(formattedData);
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
        // Generate a random speed between 500 and 7000 MB/s
        const newSpeed = Math.floor(Math.random() * (700 - 500 + 1)) + 500;
        setNetworkSpeed(newSpeed);
      }, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup on unmount

  }, []);
  

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];


  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
      <div className="relative flex">
          <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} language={language} />
         </div>
         
        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
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
                <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 h-full">
                  <img
                    src=""
                    alt=""
                    className="rounded-lg mb-4"
                    style={{ height: "150px", width: "140px" }}
                  />
                  <div className="teal-text text-sm sm:text-base w-full text-center mb-2">
                    {translations.network}
                  </div>
                  <div className="teal-text text-2xl sm:text-3xl lg:text-4xl w-full text-center mb-2">
                    {networkSpeed} MB/s
                  </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                    <div className="flex flex-col justify-center items-center gap-4 text-center">
                    {/* <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4"> */}
                      {/* <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.internet_used}</div>
                        <div className="grid grid-cols-2 w-full">
                          <div className="teal-text text-sm sm:text-base w-full mb-2">
                            {translations.today}
                          </div>
                          <div className="teal-text text-sm sm:text-base w-full mb-2">
                            {translations.monthly}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 w-full" >
                          <div className="teal-text text-2xl w-full mb-2">
                            {todayInternetUsage} MB
                          </div>
                          <div className="teal-text text-2xl w-full mb-2">
                            {monthlyInternetUsage} MB
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {" "}
                  <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                    <div className="flex flex-col justify-center items-center text-center gap-4 mt-7">
                    {/* <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                      <img
                        src=""
                        alt=""
                        className="border border-black rounded-lg mb-4 mx-auto"
                        style={{ height: "100px", width: "100px" }}
                      /> */}
                      <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                        <div className="mb-2">{translations.next_payment_date}</div>
                        <div className="teal-text text-2xl w-full mb-2">
                          {nextPaymentDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                
                {/* Pie chart section */}
                <h2 className="text-center text-2xl mb-4">{translations.internetUsageChart}</h2>
                  {/* Title */}
                    <h2 className="text-center text-2xl font-bold mb-4">
                      Average Internet Usage (MB)
                    </h2>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : (
                    <div className="flex justify-center">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={internetUsageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label
                        >
                          {internetUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
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
