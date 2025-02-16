import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { name, email, password };

    axios.post("http://localhost:8080/api/register", userData)
      .then(response => {
        console.log(response.data);
        alert(response.data);
        navigate("/"); // Redirect after successful registration
      })
      .catch(error => {
        console.error("There was an error registering!", error);
        alert("Error registering user.");
      });
  };

  const handleButtonClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    navigate("/");
  };

  return (
    <div className="baseBG border border-black px-4 pt-3 grid grid-rows-[5rem_1fr] flex-1 h-screen">
      <div className="flex justify-between items-center relative">
        <div className="baseGreen rounded-lg w-full flex items-center px-4 py-4">
          {/* Centered Text */}
          <h1 className="flex-grow text-center lg:text-4xl titleGold">
            <a href="/">NZ HOME</a>
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
          <h2 className="mb-4 subtitle text-white">Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={name}
                onChange={handleNameChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
                className="border rounded-[0.6rem] px-2 py-1 w-[60%]"
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

            <p className="pText text-white">
              <input type="checkbox" name="checkbox" required className="mr-2" />
              I have read and agreed to the
              <a href=" " className="terms"> Terms & Conditions of Use</a>
            </p>

            <button
              type="submit"
              className="button1 bg-green-500 text-white mt-7 w-[40%] h-[6%] rounded-[1rem] mx-auto"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
