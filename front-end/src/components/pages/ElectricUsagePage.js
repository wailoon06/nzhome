import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";

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
                        <img
                          src=""
                          alt=""
                          className="border border-black rounded-lg mb-4 mx-auto"
                          style={{ height: "100px", width: "100px" }}
                        />
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">{translations.today}</div>
                          <div className="teal-text text-2xl w-full mb-2">
                            10.5 kWh
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                      <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                        <img
                          src=""
                          alt=""
                          className="border border-black rounded-lg mb-4 mx-auto"
                          style={{ height: "100px", width: "100px" }}
                        />
                        <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                          <div className="mb-2">{translations.today}</div>
                          <div className="teal-text text-2xl w-full mb-2">
                            10.5 kWh
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="justify-center items-center p-3 gap-2">
                    <div className="items-center gap-2">
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-cols justify-center items-center p-3">
                        <img
                          alt="eg"
                          src="https://www.excel-easy.com/examples/images/line-chart/line-chart.png"
                        ></img>
                      </div>
                    </div>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-center items-center p-3">
                      {/* Dynamically added blocks */}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today}</div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today}</div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3">
                        <div className="grid sm:grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-4">
                          <img
                            src=""
                            alt=""
                            className="border border-black rounded-lg mb-4 mx-auto"
                            style={{ height: "100px", width: "100px" }}
                          />
                          <div className="grid grid-rows-2 teal-text text-sm sm:text-base w-full mb-2 text-center">
                            <div className="mb-2">{translations.today} </div>
                            <div className="teal-text text-2xl w-full mb-2">
                              10.5 kWh
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* More blocks will automatically adjust */}
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
                          <img
                            alt="eg"
                            src="https://www.excel-easy.com/examples/images/line-chart/line-chart.png"
                          ></img>
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
                            <div className="mb-2">Generate Report</div>
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
