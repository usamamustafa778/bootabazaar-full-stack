import React, { useMemo, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaStore,
  FaChartLine,
  FaShoppingBag,
} from "react-icons/fa";
import Add from "./Add";
import List from "./vendor/List";
import Orders from "./vendor/Orders";
import Customers from "./vendor/Customers";
import DashboardSidebar from "./DashboardSidebar";

export default function VendorDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const pathname = useLocation().pathname;

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
  });
  const [error, setError] = useState("");
  const [hasStore, setHasStore] = useState(true); // We'll update this based on API response

  // Check if vendor has a store
  useEffect(() => {
    if (user?.role === "vendor") {
      setShowStoreModal(true);
    }
  }, [user]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/api/vendor/create-store",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user._id,
            storeName: storeData.storeName,
            storeDescription: storeData.storeDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create store");
      }

      const data = await response.json();
      setHasStore(true);
      setShowStoreModal(false);
      // You might want to store the store data in localStorage or state
      localStorage.setItem("store", JSON.stringify(data));
    } catch (error) {
      console.error("Error creating store:", error);
      setError("Failed to create store. Please try again.");
    }
  };

  // Use useMemo if these stats won't change often (or if needed for performance)
  const stats = useMemo(
    () => [
      {
        title: "Total Sales",
        value: "Rs. 12,345",
        icon: <FaChartLine />,
        change: "+12%",
      },
      {
        title: "Active Orders",
        value: "25",
        icon: <FaShoppingBag />,
        change: "+5%",
      },
      {
        title: "Total Products",
        value: "148",
        icon: <FaBox />,
        change: "+2%",
      },
      {
        title: "Total Customers",
        value: "2.4k",
        icon: <FaUsers />,
        change: "+8%",
      },
    ],
    []
  );

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Store Creation Modal */}
      {showStoreModal && !hasStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <FaStore className="text-blue-500 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">
                Create Your Store
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  required
                  value={storeData.storeName}
                  onChange={(e) =>
                    setStoreData({ ...storeData, storeName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  placeholder="Enter your store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Description
                </label>
                <textarea
                  required
                  value={storeData.storeDescription}
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      storeDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                  rows="3"
                  placeholder="Describe your store"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition-colors duration-200"
              >
                Create Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      {pathname === "/dashboard" && (
        <div className="p-10 w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name || "Vendor"}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(({ title, value, icon, change }, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl text-gray-600">{icon}</div>
                  <div className="text-sm font-medium text-green-500">
                    {change}
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Routes>
        <Route path="add" element={<Add token={token} />} />
        <Route path="list" element={<List token={token} user={user} />} />
        <Route
          path="orders"
          element={
            <Orders token={token} vendorId={user?._id} role={user?.role} />
          }
        />
        <Route path="customers" element={<Customers token={token} />} />
      </Routes>
    </div>
  );
}
