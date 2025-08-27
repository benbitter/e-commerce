import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Store/Slices/user.js"
import { io } from "socket.io-client";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // <-- new state for server error

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/v1/auth/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log("Login successful:", response.data);
          const socket = await io("http://localhost:3001", {
            query: {
              userId: response.data._id
            }
          });
          await socket.connect();
          socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            dispatch(setUser({ userInfo: response.data, socketid: socket.id }));
            navigate("/");
          });
          navigate("/");
        } else {
          setEmail("");
          setPassword("");
          setLoginError("❌ Wrong credentials");
        }
      } catch (error) {
        console.error("Login failed:", error);
        setEmail("");
        setPassword("");
        setLoginError("❌ Wrong credentials");
      }
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Server Error */}
        {loginError && (
          <p className="text-red-600 text-center mb-4">{loginError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
