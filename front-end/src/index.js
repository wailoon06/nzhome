import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import App from "./App";
import "./index.css";

const Root = () => (
  <Router>
    <App />

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </Router>
);

// Use createRoot in React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
