import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import axios from "axios";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { PDFDocument, rgb } from "pdf-lib";

function ElectricUsagePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

  const generatePDF = async () => {
    // Extract text from the specific section
    const energyTextElements = document.querySelectorAll(".teal-text");
    let extractedText = "";

    energyTextElements.forEach((el) => {
      if (el.innerText.trim()) {
        extractedText += el.innerText.trim() + "\n";
      }
    });

    // Create a new PDF Document
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 400]); // Initial page
    let { width, height } = page.getSize();

    // Define text properties
    const fontSize = 14;
    const margin = 50;
    let yPosition = height - margin;
    let lineCount = 0;

    // Split text into lines
    const lines = extractedText.split("\n");

    for (let line of lines) {
      // Check if we need a new page
      if (yPosition < margin) {
        page = pdfDoc.addPage([600, 400]); // Create a new page
        yPosition = height - margin;
        lineCount = 0; // Reset line counter for new page
      }

      // Draw the text line
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      yPosition -= fontSize + 5; // Move down

      lineCount++;
      if (lineCount % 3 === 0) {
        yPosition -= fontSize + 10; // Add extra spacing after every 2 rows
      }
    }

    // Save and download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Energy_Report.pdf";
    link.click();
  };

  /*---------------------------------------------------------------------------------------*/

  /*------ Display for total ------*/

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const month = today.toLocaleString("default", { month: "short" });

  const [dailyConsumption, setDailyConsumption] = useState(0);
  const [yesterdayConsumption, setYesterdayConsumption] = useState(0);

  const [todayGeneration, setTodayGeneration] = useState(0);
  const [ytdGeneration, setYtdGeneration] = useState(0);

  useEffect(() => {
    const fetchConsumption = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getEnergyFam",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        /*------ Total energy consumption for today ------*/
        const daily = data.reduce((sum, device) => {
          const dailyConsumption = device.energyRecords
            .filter((record) => {
              const recordDate = new Date(record.date);
              return (
                recordDate.getFullYear() === currentYear &&
                recordDate.getMonth() + 1 === currentMonth &&
                recordDate.getDate() === today.getDate()
              );
            })
            .reduce((acc, record) => acc + record.energyConsumption, 0); // Sum per device

          return sum + dailyConsumption;
        }, 0);

        setDailyConsumption(parseFloat(daily.toFixed(2)));

        /*------ Total energy generation for today ------*/
        const todayGeneration = data.reduce((sum, device) => {
          const deviceGeneration = device.energyRecords
            .filter((record) => {
              const recordDate = new Date(record.date);
              return (
                recordDate.getFullYear() === currentYear &&
                recordDate.getMonth() + 1 === currentMonth &&
                recordDate.getDate() === today.getDate()
              );
            })
            .reduce((acc, record) => acc + record.energyGeneration, 0); // Sum per device

          return sum + deviceGeneration;
        }, 0);

        setTodayGeneration(parseFloat(todayGeneration.toFixed(2)));

        /*------ Total energy consumption for yesterday ------*/
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Move back one day
        yesterday.setHours(0, 0, 0, 0); // Normalize time to 00:00:00

        const yesterdayConsumption = data.reduce((sum, device) => {
          const deviceConsumption = device.energyRecords
            .filter((record) => {
              const recordDate = new Date(record.date);
              recordDate.setHours(0, 0, 0, 0); // Normalize time for accurate date comparison
              return recordDate.getTime() === yesterday.getTime();
            })
            .reduce((acc, record) => acc + (record.energyConsumption || 0), 0); // Sum per device

          return sum + deviceConsumption;
        }, 0);

        setYesterdayConsumption(parseFloat(yesterdayConsumption.toFixed(2)));

        /*------ Total energy generation for yesterday ------*/
        const yesterdayGeneration = data.reduce((sum, device) => {
          const deviceConsumption = device.energyRecords
            .filter((record) => {
              const recordDate = new Date(record.date);
              recordDate.setHours(0, 0, 0, 0); // Normalize time for accurate date comparison
              return recordDate.getTime() === yesterday.getTime();
            })
            .reduce((acc, record) => acc + (record.energyGeneration || 0), 0); // Sum per device

          return sum + deviceConsumption;
        }, 0);

        setYtdGeneration(parseFloat(yesterdayGeneration.toFixed(2)));
      } catch (err) {
        alert("Error!");
      } finally {
        setLoading(false);
      }
    };

    fetchConsumption();
  }, []);

  /*------------------------------------------------------------------------------- */

  /*------- Graph ------*/
  /*------- Energy date by date  -------*/
  const [graphEnergyDay, setGraphEnergyDay] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getEnergyFam",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        const groupedByDate = {};

        // Process each device's energy records
        data.forEach((deviceData) => {
          deviceData.energyRecords.forEach((record) => {
            const date = record.date;

            if (!groupedByDate[date]) {
              groupedByDate[date] = {
                date,
                totalConsumption: 0,
                totalGeneration: 0,
              };
            }

            // Add this device's consumption and generation to the date totals
            groupedByDate[date].totalConsumption +=
              record.energyConsumption || 0;
            groupedByDate[date].totalGeneration += record.energyGeneration || 0;
          });
        });

        const processedData = Object.values(groupedByDate).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setGraphEnergyDay(processedData);

        /* Generation */
      } catch (err) {
        alert("Error!");
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  /*------ Energy week by week  ------*/

  const [graphEnergyWeek, setGraphEnergyWeek] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getWeekStart(new Date().toISOString())
  );

  function getWeekStart(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday start
    const weekStart = new Date(date.setDate(diff));
    return weekStart.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7); // Move forward or backward by 7 days
    setCurrentWeekStart(getWeekStart(newDate.toISOString()));
  };

  useEffect(() => {
    const fetchGraphWeek = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getEnergyFam",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        // Calculate week end date (7 days from start)
        const weekStartDate = new Date(currentWeekStart);
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);

        // Create an array for each day of the week
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
          const day = new Date(weekStartDate);
          day.setDate(weekStartDate.getDate() + i);
          const dayStr = day.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          weekDays.push({
            date: dayStr,
            formattedDate: `${day.getDate()}/${day.getMonth() + 1}`,
            totalConsumption: 0,
            totalGeneration: 0,
          });
        }

        // Process each device's energy records for the current week
        data.forEach((deviceData) => {
          deviceData.energyRecords.forEach((record) => {
            const recordDate = record.date.split("T")[0]; // Format as YYYY-MM-DD
            const recordDateObj = new Date(recordDate);

            // Check if the record is within the selected week
            if (
              recordDateObj >= weekStartDate &&
              recordDateObj <= weekEndDate
            ) {
              // Find the corresponding day in our weekDays array
              const dayIndex = Math.floor(
                (recordDateObj - weekStartDate) / (24 * 60 * 60 * 1000)
              );
              if (dayIndex >= 0 && dayIndex < 7) {
                weekDays[dayIndex].totalConsumption +=
                  record.energyConsumption || 0;
                weekDays[dayIndex].totalGeneration +=
                  record.energyGeneration || 0;
              }
            }
          });
        });

        setGraphEnergyWeek(weekDays);
      } catch (err) {
        alert("Error!");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphWeek();
  }, [currentWeekStart]);

  /*------ Energy month by month ------*/

  const [graphEnergyMonth, setGraphEnergyMonth] = useState([]);

  useEffect(() => {
    const fetchGraphByMonth = async () => {
      setLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/getEnergyFam",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;

        /*------ Total energy consumption, grouped by month ------*/
        // Initialize the object to hold data grouped by month
        const groupedByMonth = {};

        // Array of month names for display
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // Get the current year or use the year from the data
        const currentYear = new Date().getFullYear().toString();
        let dataYear = currentYear;

        // Try to determine the year from the data
        if (data.length > 0 && data[0].energyRecords.length > 0) {
          dataYear = new Date(data[0].energyRecords[0].date)
            .getFullYear()
            .toString();
        }

        // Initialize all months with zero values
        for (let i = 0; i < 12; i++) {
          const monthKey = `${dataYear}-${i}`;
          groupedByMonth[monthKey] = {
            year: dataYear,
            month: i,
            monthName: monthNames[i],
            devices: {},
            totalConsumption: 0,
            totalGeneration: 0,
          };
        }

        // Process each device's energy records
        data.forEach((deviceData) => {
          const deviceId = deviceData.deviceId;

          deviceData.energyRecords.forEach((record) => {
            const date = new Date(record.date);
            const year = date.getFullYear().toString();
            const month = date.getMonth(); // 0-11
            const monthKey = `${year}-${month}`; // e.g., "2025-0" for January 2025

            // Skip if the record's year doesn't match our target year
            // Remove this check if you want to show data across multiple years
            if (year !== dataYear) return;

            // Initialize the device in this month if it doesn't exist
            if (!groupedByMonth[monthKey].devices[deviceId]) {
              groupedByMonth[monthKey].devices[deviceId] = {
                deviceId: deviceId,
                totalConsumption: 0,
                totalGeneration: 0,
              };
            }

            // Add this record's data to the device's totals for this month
            groupedByMonth[monthKey].devices[deviceId].totalConsumption +=
              record.energyConsumption || 0;
            groupedByMonth[monthKey].devices[deviceId].totalGeneration +=
              record.energyGeneration || 0;

            // Update the month totals
            groupedByMonth[monthKey].totalConsumption +=
              record.energyConsumption || 0;
            groupedByMonth[monthKey].totalGeneration +=
              record.energyGeneration || 0;
          });
        });

        // Convert to array
        const processedData = Object.values(groupedByMonth);

        // Sort by month (they're all from the same year)
        processedData.sort((a, b) => a.month - b.month);

        console.log("Processed month data:", processedData);
        setGraphEnergyMonth(processedData);
      } catch (err) {
        alert("Error fetching energy data!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphByMonth();
  }, []);

  /*---------------------------------------------------------------------------------------------------------------------*/

  const [graphType, setGraphType] = useState(null);
  const [generationGraphType, setGenerationGraphType] = useState(null);

  // Function to handle graph type change
  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  // Function to handle graph type change
  const handleGenerationGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  const chartSelection = () => {
    if (graphType === "Week") {
      return (
        <>
          <div className="flex justify-between w-full mb-3">
            <button
              onClick={() => changeWeek(-1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              ← Previous Week
            </button>
            <h2 className="text-lg font-semibold">{`Week of ${currentWeekStart}`}</h2>
            <button
              onClick={() => changeWeek(1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
              disabled={
                currentWeekStart === getWeekStart(new Date().toISOString())
              }
            >
              Next Week →
            </button>
          </div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyWeek}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                  labelFormatter={(value) => {
                    // Find the full date from the formattedDate
                    const entry = graphEnergyWeek.find(
                      (item) => item.formattedDate === value
                    );
                    if (entry) {
                      const date = new Date(entry.date);
                      return date.toLocaleDateString(); // Return a nicely formatted full date
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalConsumption"
                  fill="#BE9D6A"
                  name={translations.energyKwh}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    } else if (graphType === "Month") {
      return (
        <>
          <div className="flex justify-between w-full mb-3"></div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalConsumption"
                  fill="#BE9D6A"
                  name={translations.energyKwh}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    } else if (graphType === "Day") {
      return (
        <>
          <div className="flex justify-between w-full mb-3"></div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                  labelFormatter={(value) => {
                    // Find the full date from the formattedDate
                    const entry = graphEnergyWeek.find(
                      (item) => item.formattedDate === value
                    );
                    if (entry) {
                      const date = new Date(entry.date);
                      return date.toLocaleDateString(); // Return a nicely formatted full date
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalConsumption"
                  fill="#BE9D6A"
                  name={translations.energyKwh}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    }
  };

  const generationChartSelection = () => {
    if (graphType === "Week") {
      return (
        <>
          <div className="flex justify-between w-full mb-3">
            <button
              onClick={() => changeWeek(-1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              ← Previous Week
            </button>
            <h2 className="text-lg font-semibold">{`Week of ${currentWeekStart}`}</h2>
            <button
              onClick={() => changeWeek(1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
              disabled={
                currentWeekStart === getWeekStart(new Date().toISOString())
              }
            >
              Next Week →
            </button>
          </div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyWeek}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                  labelFormatter={(value) => {
                    // Find the full date from the formattedDate
                    const entry = graphEnergyWeek.find(
                      (item) => item.formattedDate === value
                    );
                    if (entry) {
                      const date = new Date(entry.date);
                      return date.toLocaleDateString(); // Return a nicely formatted full date
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalGeneration"
                  fill="#BE9D6A"
                  name="Energy Generation (kWh)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    } else if (graphType === "Month") {
      return (
        <>
          <div className="flex justify-between w-full mb-3"></div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyMonth}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalGeneration"
                  fill="#BE9D6A"
                  name="Energy Generation (kWh)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    } else if (graphType === "Day") {
      return (
        <>
          <div className="flex justify-between w-full mb-3"></div>
          <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={graphEnergyDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  formatter={(value) => {
                    // Format the value to show exactly 2 decimal places
                    return value.toFixed(2);
                  }}
                  labelFormatter={(value) => {
                    // Find the full date from the formattedDate
                    const entry = graphEnergyWeek.find(
                      (item) => item.formattedDate === value
                    );
                    if (entry) {
                      const date = new Date(entry.date);
                      return date.toLocaleDateString(); // Return a nicely formatted full date
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="totalGeneration"
                  fill="#BE9D6A"
                  name="Energy Generation (kWh)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    }
  };

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
            <div id="reportGen" class="flex flex-col flex-1 gap-4">
              {/* Internet Usage Section */}
              <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                <a className="relative pl-4" href="/">
                  <i className="fa fa-2x fa-arrow-left"></i>
                </a>
                <h1 className="text-center lg:text-4xl w-full ml-[-5%]">
                  {translations.overall_energy_usage}
                </h1>
              </div>

              {/* ==================== */}
              <div className="grid grid-rows-[auto,1fr] mt-2 gap-4">
                <div className="grid grid-rows-[auto,1fr] gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                      <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          className="bg-gray-200 rounded-lg shadow-md"
                        >
                          {/* Calendar Body */}
                          <rect
                            x="10"
                            y="20"
                            width="80"
                            height="70"
                            fill="white"
                            stroke="black"
                            strokeWidth="3"
                            rx="5"
                          />

                          {/* Month Display */}
                          <text
                            x="50"
                            y="47"
                            fontSize="14"
                            textAnchor="middle"
                            fill="black"
                            fontWeight="bold"
                          >
                            {month.toUpperCase()}{" "}
                            {/* Converts "Jan" to "JAN" */}
                          </text>

                          {/* Day Display */}
                          <text
                            x="50"
                            y="72"
                            fontSize="24"
                            textAnchor="middle"
                            fill="black"
                            fontWeight="bold"
                          >
                            {today.getDate() - 1}
                          </text>
                        </svg>
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">Yesterday</div>
                          <div className="teal-text text-2xl w-full mb-2">
                            {yesterdayConsumption} kWh
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                      <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          className="bg-gray-200 rounded-lg shadow-md"
                        >
                          {/* Calendar Body */}
                          <rect
                            x="10"
                            y="20"
                            width="80"
                            height="70"
                            fill="white"
                            stroke="black"
                            strokeWidth="3"
                            rx="5"
                          />

                          {/* Month Display */}
                          <text
                            x="50"
                            y="47"
                            fontSize="14"
                            textAnchor="middle"
                            fill="black"
                            fontWeight="bold"
                          >
                            {month.toUpperCase()}{" "}
                            {/* Converts "Jan" to "JAN" */}
                          </text>

                          {/* Day Display */}
                          <text
                            x="50"
                            y="72"
                            fontSize="24"
                            textAnchor="middle"
                            fill="black"
                            fontWeight="bold"
                          >
                            {today.getDate()}
                          </text>
                        </svg>
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">{translations.today}</div>
                          <div className="teal-text text-2xl w-full mb-2">
                            {dailyConsumption} kWh
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="mb-3">
                      <label htmlFor="graph-type" className="mr-2 font-medium">
                        Group by:
                      </label>
                      <select
                        id="graph-type"
                        value={graphType}
                        onChange={handleGraphTypeChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="Month">Month</option>
                        <option value="Week">Week</option>
                        <option value="Day">Day</option>
                      </select>
                    </div>
                    <div className="items-center gap-2">{chartSelection()}</div>
                  </div>
                </div>
                {/* ===================== */}
                <div className="justify-center items-center p-3 h-full">
                  <div className="grid grid-rows-[auto,1fr]">
                    <div className="flex flex-col items-center">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 w-[50%]">
                        {translations.energy_consumption_kWh}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ===================== */}
                <div className="justify-center items-center p-3 h-full">
                  <div className="grid grid-rows-[auto,1fr]">
                    <div className="flex flex-col items-center">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 w-[50%]">
                        {translations.energy_generation_W}
                      </div>
                    </div>
                    <div className="justify-center items-center p-3 gap-2">
                      <div className="items-center gap-2">
                        <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
                          <div className="justify-center items-center p-3 gap-2">
                            <div className="mb-3">
                              <label
                                htmlFor="graph-type"
                                className="mr-2 font-medium"
                              >
                                Graph Type:
                              </label>
                              <select
                                id="graph-type"
                                value={generationGraphType}
                                onChange={handleGenerationGraphTypeChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                              >
                                <option value="" disabled>Select</option>
                                <option value="Month">Month</option>
                                <option value="Week">Week</option>
                                <option value="Day">Day</option>
                              </select>
                            </div>
                            <div className="items-center gap-2">
                              {generationChartSelection()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Link to={"/electric/date"}>
                        <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                          <div className="items-center gap-4">
                            <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                              <div className="mb-2">
                                {translations.view_specific_devices}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div
                        className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col p-3 cursor-pointer"
                        onClick={generatePDF}
                      >
                        <div className="items-center gap-4">
                          <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">
                              {translations.generate_report}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectricUsagePage;
