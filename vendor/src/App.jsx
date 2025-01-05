import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [vendorId, setVendorId] = useState(
    localStorage.getItem("vendorId") || ""
  );
  const userData = JSON.parse(localStorage.getItem("userData"));

  // Synchronize token and vendorId with localStorage
  useEffect(() => {
    localStorage.setItem("token", userData?.token);
    localStorage.setItem("vendorId", userData?.user?._id);
  }, [token, vendorId]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} setVendorId={setVendorId} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route
                  path="/list"
                  element={<List token={token} user={userData} />}
                />
                <Route
                  path="/orders"
                  element={
                    <Orders
                      token={token}
                      vendorId={userData?.user?._id}
                      role={userData?.user?.role}
                    />
                  }
                />
                <Route
                  path="/customers"
                  element={<Customers token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
