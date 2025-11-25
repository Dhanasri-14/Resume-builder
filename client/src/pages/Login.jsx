
import React, { useState } from "react";
import { User2Icon, Lock, Mail } from "lucide-react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = useState(urlState || "login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ---------------------------
  // Submit Login/Register
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`/api/users/${state}`, formData);

      dispatch(login({ token: data.token, user: data.user }));
      localStorage.setItem("token", data.token);

      toast.success(data.message);

      navigate("/app/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ---------------------------
  // Input change
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------------
  // Toggle login <-> register
  // ---------------------------
  const toggleState = () => {
    setState((prev) => (prev === "login" ? "register" : "login"));

    // Reset form fields
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>

        {/* NAME – Only for Sign Up */}
        {state === "register" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={toggleState}
          className="text-gray-500 text-sm mt-4 mb-10 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account? Click here"
            : "Already have an account? Click here"}
        </p>
      </form>
    </div>
  );
};

export default Login;






