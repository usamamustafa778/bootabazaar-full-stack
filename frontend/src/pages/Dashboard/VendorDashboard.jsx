import React, { useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { FaShoppingBag, FaUsers, FaChartLine, FaBox } from "react-icons/fa";
import Add from "./vendor/Add";
import List from "./vendor/List";
import Orders from "./vendor/Orders";
import Customers from "./vendor/Customers";
import DashboardSidebar from "./DashboardSidebar";

export default function VendorDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const pathname = useLocation().pathname;

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
