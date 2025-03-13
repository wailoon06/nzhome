import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import translationsMap from "../locales/translationsMap";

function LoginPage() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);


  // Language
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const translations = translationsMap[language] || translationsMap["en"];


  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Post email and password from user for verification
    axios
      .post("http://localhost:8080/api/login", { email, password })
      .then((response) => {
        console.log(response.data);
        alert("Login Sucessfully!");

        // Store token in local storage
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Navigate to landing page
        navigate("/");
        localStorage.setItem("started", "false");
        window.location.reload();

      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          alert(error.response.data.toString());
        } else {
          alert("Error logging in: " + error.message);
        }

        // Reload when there is error
        window.location.reload();
        
      });

      setLoading(false);
  }

  return (
    <div className="baseBG border border-black px-4 pt-3 grid grid-rows-[5rem_1fr] flex-1 h-screen">
      <div className="flex justify-between items-center relative">
        <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
          {/* Centered Text */}
          <h1 className="flex-grow text-center lg:text-4xl titleGold">
            <a href="/">{translations.title}</a>
          </h1>
        </div>
      </div>

      <div className="baseGreen rounded-lg w-[30%] mt-10 mb-12 mx-auto">
        <div className="text-center">
          <img
            src="./image/NZHome.png"
            alt="NZ Home Logo"
            className="w-2/5 mx-auto -mb-6"
          />
          <h2 className="mb-4 subtitle text-white">Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                ref={emailRef}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
                autocomplete="email"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <p className="pText mr-[40%] text-white">
              <a href="/change&password" className="terms">
                {" "}
                {translations.forgot_password}
              </a>
            </p>

            <button
              type="submit"
              className="button1 bg-green-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
              // onClick={handleButtonClick}
              disabled={loading}
            >
              {translations.sign_in}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t" />
              <span className="mx-4 text-white">{translations.or}</span>
              <hr className="flex-grow border-t" />
            </div>

            <Link to={`/register`}>
              <button
                type="button"
                className="button2 bg-blue-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
              >
                {translations.register}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// email check
  // const handleButtonClick = async (event) => {
  //   event.preventDefault(); // Prevent default form submission
  //   const theEmail = emailRef.current.value; // Get this from input field

  //   try {
  //     const { data: exists } = await axios.get(`/api/users/exists`, {
  //       params: { theEmail },
  //     });

  //     if (exists) {
  //       alert("Email already exists!");
  //     } else {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error("Error checking email:", error);
  //   }
  // };

  {/* <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div> */}
