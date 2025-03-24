import React, { useEffect,useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import translationsMap from "../locales/translationsMap";
import Sidebar from "./Sidebar";
import MainContentHeader from "./MainContentHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CalendarPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const today = new Date();
  const [events, setEvents] = useState([]);
  const [eventDate, setEventDate] = useState(null); // Date object for event selection
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomNames, setRoomNames] = useState([]);
  const [devicesByRoom, setDevicesByRoom] = useState({});
  const [userEvents, setUserEvents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  
  
  const navigate = useNavigate();
  
  // States for time components
  const [selectedHour, setSelectedHour] = useState(today.getHours());
  const [selectedMinute, setSelectedMinute] = useState(today.getMinutes());

  // Generate options for dropdowns
  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (value) => (
        <option key={value} value={value}>
          {value.toString().padStart(2, "0")}
        </option>
      )
    );
  };

  // Switch
  const [onOff, setOnOff] = useState("Off");

  const toggleSwitch = () => {
      setOnOff((prev) => (prev === "On" ? "Off" : "On")); // Toggle between "On" and "Off"
    };  

  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [favorites, setFavorites] = useState([]); // Favorite devices
  const [selectedDevices, setSelectedDevices] = useState([]); // Selected devices

  // Modal Handlers
  const [devices, setDevices] = useState([]); // Store fetched devices

  const openModal = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User is not logged in.");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/getAllDevice", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract device ID and name
      const devicesList = response.data.map(device => ({
        id: device.deviceid,  // Include the device ID
        name: device.deviceName,
        picture: device.picture,
        room: device.room
      }));

      // Step 2: Extract unique rooms from devices
      const uniqueRooms = [...new Set(
        devicesList
          .filter(device => device.room && device.room.roomid) // Filter out devices without rooms
          .map(device => device.room.roomid)
      )];

      // Step 3: Check permissions for each unique room
      const authorizedRoomIds = [];
      
      for (const roomId of uniqueRooms) {
        try {
          // Use your existing validatePermission endpoint
          await axios.post(
            "http://localhost:8080/api/validatePermission",
            { roomid: roomId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // If we get here without an error, the user has permission for this room
          authorizedRoomIds.push(roomId);
        } catch (err) {
          // If we get a 403 error, the user doesn't have permission for this room
          // Just continue to the next room
          console.log(`No permission for room ${roomId}`);
        }
      }
      // Step 4: Filter devices to only those in rooms the user has access to
      const authorizedDevices = devicesList.filter(device => {
        // Include devices without rooms (Unassigned) or in authorized rooms
        return !device.room || !device.room.roomid || authorizedRoomIds.includes(device.room.roomid);
      });
      
      setDevices(authorizedDevices);
      console.log(authorizedDevices);

       // Step 5: Organize authorized devices by room
       const deviceRooms = {};
       const rooms = [];
       
       // Group devices by room
       authorizedDevices.forEach(device => {
         const roomName = device.room && device.room.roomName ? device.room.roomName : "Unassigned";
         
         if (!deviceRooms[roomName]) {
           deviceRooms[roomName] = [];
           rooms.push(roomName);
         }
         
         deviceRooms[roomName].push(device);
       });
       
       // Sort room names alphabetically
       rooms.sort((a, b) => {
         // Keep "Unassigned" at the end
         if (a === "Unassigned") return 1;
         if (b === "Unassigned") return -1;
         return a.localeCompare(b);
       });
       
       setRoomNames(rooms);
       console.log(rooms);
       setDevicesByRoom(deviceRooms);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching devices:", error.response?.status, error.message);
    }
};

  
  const closeModal = () => setIsOpen(false);
  
  // Toggle Favorite
  const toggleFavorite = (deviceName) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(deviceName)
          ? prevFavorites.filter((name) => name !== deviceName) // Remove from favorites
          : [...prevFavorites, deviceName] // Add to favorites
    );
  };

  // Toggle Selected State for Modal
  const toggleSelected = (deviceName) => {
    setSelectedDevices(
      (prevSelected) =>
        prevSelected.includes(deviceName)
          ? prevSelected.filter((name) => name !== deviceName) // Remove from selected
          : [...prevSelected, deviceName] // Add to selected
    );
  };


  //add event
  const addEvent = async () => {
    console.log("addEvent function called"); // Check if this appears in the console
    console.log("eventDate:", eventDate);
    console.log("eventTitle:", eventTitle);

    if (!eventDate || !eventTitle) {
      // alert("Event date and title are required.");
      setErrorMessage("Event date and title are required.");//added
        
      setTimeout(() => {//added
        setErrorMessage("");
      }, 4000);
      return;
    }
  
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Check if token is retrieved correctly

      const eventDetails = new Date(eventDate);
      eventDetails.setHours(selectedHour, selectedMinute);
      console.log("selected hour:", selectedHour); // Check if token is retrieved correctly
      console.log("selected min:", selectedMinute); // Check if token is retrieved correctly
      console.log("eventDetails:", eventDetails.toISOString); // Check if token is retrieved correctly
      const adjustedDate = new Date(eventDetails.getTime() + (8 * 60 * 60 * 1000));

      console.log("Correct UTC Time:", adjustedDate.toISOString());
      const selectedDeviceIds = devices
      .filter(device => selectedDevices.includes(device.name)) // Check if selectedDevices contains device name
      .map(device => device.id); // Extract deviceid

      console.log("Devices:", devices); // Check if devices array is populated
      console.log("Selected Devices:", selectedDevices); // Check if selectedDevices has values
      console.log("Selected Device IDs:", selectedDeviceIds); // Verify extracted device IDs

      const eventData = {
        date: adjustedDate.toISOString(),
        title: eventTitle,
        description: eventDescription,
        onOff: onOff === "On" ? "On" : "Off",
        devices: selectedDeviceIds
      };
      console.log("Sending event data:", eventData); // Log event data before sending
  
      const response = await axios.post(
        "http://localhost:8080/api/addEvent",
        eventData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response:", response); // Log response from the API
  
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: response.data.eventId,
          date: adjustedDate,
          title: eventTitle,
          description: eventDescription,
          onOff: onOff === "On" ? "On" : "Off", // Ensure correct string format
          devices: favorites.filter((device) =>
            selectedDevices.includes(device.deviceid)
          ),
        },
      ]);
  
      // Reset input fields
      setEventDate(null);
      setSelectedHour(new Date().getHours());
      setSelectedMinute(new Date().getMinutes());
      setEventTitle("");
      setEventDescription("");
      setOnOff("Off");
      setSelectedDevices([]);

      // alert("Successfully created!");
      // Show success message(added)
      setSuccessMessage("Event successfully created!");
      
      // Auto-clear success message after 3 seconds(added)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);  

      fetchUpcomingEvents(); 

    } catch (err) {
      console.error("API error:", err); // Log the error
  
      if (err.response?.status === 403) {
        console.log("Session expired!");
        // alert("Session expired!");
        // localStorage.removeItem("token");
        // localStorage.removeItem("selectedDevice");
        // navigate("/login");
        setErrorMessage("Session expired. Please log in again.");//added
        
        setTimeout(() => {//added
          localStorage.clear();
          navigate("/login");
        }, 5000);
      }
  
      // setError("An unexpected error occurred");
      setErrorMessage("Failed to create event. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  //fetch upcoming event
  const fetchUpcomingEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }
      setLoading(true); // Show loader

      // Fetch user events from backend
      const response = await fetch("http://localhost:8080/api/getUserEvents", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
  
      let events = await response.json();
      console.log("All Events:", events); // Debugging log
  
      // Get current time
      const now = new Date();
  
      // Filter events that occur after the current time
      const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
      setUserEvents(upcomingEvents);
      console.log("Upcoming Events:", upcomingEvents);
      return upcomingEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally
    {
      setLoading(false); // Hide loader
    }
  };
  
  useEffect(() => {
    fetchUpcomingEvents(); // Fetch events when component mounts
  }, []);
  
  // Delete an event by ID
  const deleteEvent = async (title) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User is not logged in.");
        return;
      }
  
      console.log("Deleting event:", title);
  
      const response = await axios.delete(`http://localhost:8080/api/deleteEvent`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { title }  // Send title as a query parameter
      });
  
      console.log(response.data);
      fetchUpcomingEvents();
  
      setEvents((prevEvents) =>
        prevEvents.filter(event => event.title !== title)
      );

      // Show success message
    setSuccessMessage(`Event "${title}" successfully deleted!`);
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
    }
  };
  
  

  // translation
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const translations = translationsMap[language] || translationsMap["en"];

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

        {/* Success Message Display (added) */}
        {successMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-[10000]">
            {successMessage}
          </div>
        )}

        {/* Error Message Display (added) */}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-[10000]">
            {errorMessage}
          </div>
        )}

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
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    {translations.calendar}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4">
                  <div className="container-calendar grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Section */}
                    <div
                      id="right"
                      className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <div className="calendar-wrapper grid grid-rows-[auto] gap-4">
                        <DatePicker
                          selected={eventDate}
                          onChange={(date) => setEventDate(date)}
                          inline
                          dateFormat="yyyy-MM-dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />

                        {/* Time Selection */}
                        <div className="time-selection flex items-center space-x-4 flex items-center justify-center">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {translations.hour}:
                            </label>
                            <select
                              value={selectedHour}
                              onChange={(e) =>
                                setSelectedHour(parseInt(e.target.value))
                              }
                              className="border border-gray-300 rounded p-2"
                            >
                              {generateOptions(0, 23)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {translations.minute}:
                            </label>
                            <select
                              value={selectedMinute}
                              onChange={(e) =>
                                setSelectedMinute(parseInt(e.target.value))
                              }
                              className="border border-gray-300 rounded p-2"
                            >
                              {generateOptions(0, 59)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - DatePicker */}
                    <div id="left" className="bg-gray-100 p-4 rounded-lg shadow-md">
                      <div id="reminder-section">
                        <h3 className="text-xl font-semibold mb-3">{translations.upEvent}</h3>
                        {loading ? <p>Loading events...</p> : (
                        <ul id="reminderList" className="max-h-96 overflow-y-auto space-y-2 border rounded-md p-2">
                          {userEvents
                            .filter((event) => new Date(event.date) >= new Date()) // Show only upcoming events
                            .map((event) => (
                              <li
                                key={event.id}
                                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                              >
                                <div>
                                  {/* Event Title */}
                                  <strong className="block text-sm font-bold">{event.title}</strong>

                                  {/* Event Description & Date */}
                                  <span className="text-sm text-gray-600">
                                    {event.description} on{" "}
                                    {new Date(event.date).toLocaleDateString()} at{" "}
                                    {new Date(event.date).toLocaleTimeString()}
                                  </span>

                                  {/* device Status */}
                                  {event.onOff === "On" && (
                                    <div className="text-sm text-green-600 mt-2">
                                      <strong>Turn on {event.deviceName}</strong> 
                                    </div>
                                  )}

                                  {event.onOff === "Off" && (
                                    <div className="text-sm text-red-600 mt-2">
                                      <strong>Turn off {event.deviceName}</strong>
                                    </div>
                                  )}


                                  {/* Conditionally Render Devices */}
                                  {event.devices && event.devices.length > 0 && (
                                    <div className="mt-2">
                                      <strong className="block text-sm font-bold">
                                        Selected Devices:
                                      </strong>
                                      <ul className="list-disc pl-4">
                                        {event.devices.map((device, index) => (
                                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                            {/* Device Image */}
                                            <img
                                              src={device.picture}
                                              alt={device.name}
                                              className="w-8 h-8 rounded-md object-cover"
                                            />
                                            {/* Device Name */}
                                            <span>{device.name}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Delete Button */}
                                <button
                                  className="delete-event text-red-500 hover:text-red-700 text-sm"
                                  onClick={() => deleteEvent(event.title)}
                                >
                                  Delete
                                </button>

                              </li>
                            ))}
                        </ul>
                      )}
                      </div>

                    </div>
                  </div>

                  {/* Event Form */}
                  <div className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-cols-[auto, 1fr, auto] gap-4">
                    <div className="grid grid-rows-[auto] space-y-3">
                      <h3 className="text-xl font-semibold mb-3">
                        {translations.add_event}
                      </h3>
                      <input
                        type="text"
                        placeholder={translations.event_title}
                        className="w-full border border-gray-300 rounded p-2"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                      <textarea
                        placeholder={translations.event_description}
                        className="w-full border border-gray-300 rounded p-2"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                      ></textarea>

                      {/* ======================== */}
                      <div className="flex items-center space-x-4">
                        {/* Switch */}
                        <div
                          className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            onOff === "On" ? "bg-green-500" : "bg-gray-400"
                          }`}
                          onClick={toggleSwitch}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                              onOff === "On" ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                        {/* Label */}
                        <span className="text-lg font-medium">
                          {onOff === "On" ? translations?.on ?? "On" : translations?.off ?? "Off"}
                        </span>
                      </div>
                      {/* ======================== */}

                      <div className="grid grid-rows-[auto] border border-gray-300 bg-white rounded-lg">
                        <div className="grid grid-cols-2">
                          {/* Left Section */}
                          <h3 className="text-xl font-semibold m-5">
                            {translations.select_device}
                          </h3>

                          {/* Right Section */}
                          <div className="p-4 flex justify-end items-center">
                            {/* Trigger Button */}
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                              onClick={openModal}
                            >
                              {translations.view_all}
                            </button>

                            {/* Modal */}
                            {isOpen && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                                  {/* Header */}
                                  <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">View All Items</h2>
                                    <button
                                      className="text-gray-500 hover:text-gray-700 transition"
                                      onClick={closeModal}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>


                                  {/* Content */}
                                  <div className="overflow-y-auto max-h-96">
                                    <ul className="space-y-4">
                                    {devices.map((device, index) => (
                                      <li
                                        key={device.id || `${device.name}-${index}`} // Ensure uniqueness
                                        className={`p-4 rounded-lg shadow-sm transition flex justify-between items-center ${
                                          selectedDevices.includes(device.name)
                                            ? "bg-blue-200"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                      >
                                        <div className="relative w-full">
                                          <span>
                                            {device.name} {device.room?.roomName ? `(${device.room.roomName})` : "(Unassigned)"}
                                          </span>

                                          {/* Green Check Mark for Selected Devices */}
                                          {selectedDevices.includes(device.name) && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                              <i className="fas fa-check"></i>
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => toggleFavorite(device.name)}
                                          className={`text-sm px-3 py-1 rounded-md ${
                                            favorites.includes(device.name) ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                                          }`}
                                        >
                                          {favorites.includes(device.name) ? translations.favorited : translations.favorite}
                                        </button>

                                        <button
                                          onClick={() => toggleSelected(device.name)}
                                          className={`text-sm px-3 py-1 rounded-md ml-2 ${
                                            selectedDevices.includes(device.name) ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                                          }`}
                                        >
                                          {selectedDevices.includes(device.name) ? translations.deselect : translations.select}
                                        </button>
                                      </li>
                                    ))}

                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 justify-center items-center p-3">
                          {/* Dynamically added blocks for Selected Devices */}
                          {selectedDevices.map((selectedDevice) => {
                            const device = devices.find(d => d.name === selectedDevice);

                            return (
                              <div
                                key={selectedDevice}
                                className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-between items-center p-3 cursor-pointer min-h-[200px] w-40"
                                onClick={() => toggleSelected(selectedDevice)}
                              >
                                {device ? (
                                  <img
                                    src={device.picture}
                                    alt={device.name}
                                    className="border border-black rounded-lg mb-4 mx-auto object-contain"
                                    style={{ height: "100px", width: "100px" }}
                                  />
                                ) : (
                                  <p>No Image Available</p>
                                )}
                                <span className="text-center whitespace-nowrap">{device.name}</span>
                              </div>
                            );
                          })}

                          {/* Message if no selected devices */}
                          {selectedDevices.length === 0 && (
                            <p className="text-gray-500 col-span-4 text-center">
                              {translations.no_selected_devices}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ======================== */}

                      <button
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        onClick={addEvent}
                      >
                        {translations.add_event}
                      </button>
                    </div>

                    {/* <div className="space-y-3">
                      <h3 className="text-xl font-semibold mb-3">
                        {translations.generate_report}
                      </h3>
                      <a href="/calendar/report">
                        <div className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col bg-white p-3 rounded-lg">
                          <div className="items-center gap-4">
                            <div className="teal-text text-sm sm:text-base w-full mb-2 text-center">
                              <div className="mb-2">
                                {translations.choose_date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div> */}
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

export default CalendarPage;
