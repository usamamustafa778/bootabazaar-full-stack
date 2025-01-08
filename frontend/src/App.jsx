import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import SellOnBootabazaar from "./pages/SellOnBootabazaar";
import UserOrders from "./pages/Dashboard/UserOrders";
import VendorDashboard from "./pages/Dashboard/VendorDashboard";
import SuperadminDashboard from "./pages/Dashboard/SuperadminDashboard";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs.";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();

  // Check if the current path starts with "/dashboard"
  const isDashboardPath = pathname.startsWith("/dashboard");

  // Example logic:
  // Only show Navbar/Footer if you're NOT on a dashboard route,
  // OR you're on a dashboard route but the user is a normal "user".
  const isUserRole = user?.role === "user";
  const shouldShowNavbar = !isDashboardPath || isUserRole;
  const shouldShowFooter = !isDashboardPath || isUserRole;

  return (
    <div className="bg-gray-50">
      <ToastContainer />

      {/* Conditional Navbar */}
      {shouldShowNavbar && <Navbar />}

      <SearchBar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sell-on-bootabazaar" element={<SellOnBootabazaar />} />

        {/* Dashboard routes - use "/dashboard/*" for nesting */}
        <Route
          path="/dashboard/*"
          element={
            user?.role === "user" ? (
              <UserOrders />
            ) : user?.role === "vendor" ? (
              <VendorDashboard />
            ) : user?.role === "admin" ? (
              <SuperadminDashboard />
            ) : (
              <Login />
            )
          }
        />
      </Routes>

      {/* Conditional Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default App;
