import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import App from "./App";
import LandingPage from "./LandingPage";
import "./index.css";

import WidgetsEnergy from "./components/widgetsEnergy";
import RoomsRobots from "./components/roomsRobots";
import Devices from "./components/devices";
import Users from "./components/users";

import RoomPage from "./components/pages/RoomPage";
import DeviceDetailsPage from "./components/pages/DeviceDetailsPage";
import UserPage from "./components/pages/UserPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import LanguagePage from "./components/pages/LanguagePage";
import AddUserPage from "./components/pages/AddUserPage";
import InternetUsagePage from "./components/pages/InternetUsagePage";
import ElectricUsagePage from "./components/pages/ElectricUsagePage";
import UserSettingPage from "./components/pages/UserSettingPage";
import AllUserPage from "./components/pages/AllUserPage";
import ChangePasswordPage from "./components/pages/ChangePasswordPage";
import SelectRobotPage from "./components/pages/SelectRobotPage";
import VacuumBotsPage from "./components/pages/VacuumBotsPage";
import NotificationPage from "./components/pages/NotificationPage";
import ActionSchedulePage from "./components/pages/ActionSchedulePage";
import LODevicesPage from "./components/pages/LODevicesPage";
import AddNewDevicePage from "./components/pages/AddNewDevicePage";
import NewDeviceDetailsPage from "./components/pages/NewDeviceDetailsPage";
import TestConnectionPage from "./components/pages/TestConnectionPage";
import CameraPage from "./components/pages/CameraPage";
import AllRoomPage from "./components/pages/AllRoomPage";
import CalendarPage from "./components/pages/CalendarPage";
import CalendarReport from "./components/pages/calendarReport";
import RoomsNewPage from "./components/pages/RoomsNewPage";
import RoomsNewAccessPage from "./components/pages/RoomsNewAccessPage";
import ViewSpecificDevicePage from "./components/pages/ViewSpecificDevicePage";
import ViewSpecificDeviceDatePage from "./components/pages/ViewSpecificDeviceDatePage";
import ViewSpecificDeviceReportPage from "./components/pages/ViewSpecificDeviceReportPage";
import RoomsDevicesPage from "./components/pages/RoomsDevicesPage";
import RoomEnergyUsagePage from "./components/pages/RoomEnergyUsagePage";
import RoomDeviceSetActionPage from "./components/pages/RoomDeviceSetActionPage";

import translationsMap from "./components/locales/translationsMap";

const Root = () => {
  const hasStarted = localStorage.getItem("started");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={hasStarted === "true" ? <App /> : <LandingPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/room/:name" element={<RoomPage />} />
        <Route
          path="/devices/:type/:name/details"
          element={<DeviceDetailsPage />}
        />
        <Route path="/user/:name" element={<UserPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profile/languages" element={<LanguagePage />} />
        <Route path="/profile/AddUser" element={<AddUserPage />} />
        <Route path="/internet" element={<InternetUsagePage />} />
        <Route path="/electric" element={<ElectricUsagePage />} />
        <Route path="/electric/date" element={<ViewSpecificDeviceDatePage />} />
        <Route
          path="/electric/:date/devices"
          element={<ViewSpecificDevicePage />}
        />
        <Route
          path="/electric/:date/:name/report"
          element={<ViewSpecificDeviceReportPage />}
        />
        <Route path="/settings" element={<UserSettingPage />} />
        <Route path="/users" element={<AllUserPage />} />
        <Route path="/change&password" element={<ChangePasswordPage />} />
        <Route path="/robots" element={<SelectRobotPage />} />
        <Route path="/robots/vacuum/:name" element={<VacuumBotsPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/devices" element={<LODevicesPage />} />
        <Route
          path="/devices/:type/:name/details/setAction"
          element={<ActionSchedulePage />}
        />
        <Route path="/devices/new" element={<AddNewDevicePage />} />
        <Route path="/devices/new/:name" element={<NewDeviceDetailsPage />} />
        <Route
          path="/devices/new/:name/test"
          element={<TestConnectionPage />}
        />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/rooms" element={<AllRoomPage />} />
        {/* <Route path="/electric/rooms/:name" element={<AllRoomPage />} /> */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/report" element={<CalendarReport />} />
        <Route path="/rooms/new" element={<RoomsNewPage />} />
        <Route
          path="/rooms/:roomTitle/access"
          element={<RoomsNewAccessPage />}
        />
        <Route
          path="/rooms/devices/:roomTitle"
          element={<RoomsDevicesPage />}
        />
        <Route
          path="/rooms/summary/:roomTitle"
          element={<RoomEnergyUsagePage />}
        />{" "}
        <Route
          path="/rooms/summary/:roomTitle/setAction"
          element={<RoomDeviceSetActionPage />}
        />
      </Routes>
    </Router>
  );
};

// Use createRoot in React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
