import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          role: "user",
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Your account is registered successfully.");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          toast.success("You are logged in.");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left side - Image */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-20 p-12 flex items-end">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to PlantStore</h2>
              <p className="text-lg">
                Bring nature into your home with our curated collection
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="text-center">
              <h2 className="prata-regular text-3xl text-gray-900 mb-2">
                {currentState}
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                {currentState === "Login"
                  ? "Welcome back! Please enter your details"
                  : "Create an account to get started"}
              </p>
            </div>

            {currentState === "Sign Up" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                onChange={(e) => setPasword(e.target.value)}
                value={password}
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600 hover:text-black cursor-pointer">
                Forgot your password?
              </p>
              <p
                onClick={() =>
                  setCurrentState(
                    currentState === "Login" ? "Sign Up" : "Login"
                  )
                }
                className="text-gray-600 hover:text-black cursor-pointer"
              >
                {currentState === "Login" ? "Create account" : "Login Here"}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-primary transition-colors duration-200"
            >
              {currentState === "Login" ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
