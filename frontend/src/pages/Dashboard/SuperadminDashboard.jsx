import React, { useMemo } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  FaShoppingBag,
  FaUsers,
  FaChartLine,
  FaBox,
  FaStore,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaUserCheck,
} from "react-icons/fa";
import Users from "./admin/Users";
import Stores from "./admin/Stores";
import Products from "./admin/Products";
import Add from "./Add";

export default function SuperadminDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const pathname = useLocation().pathname;

  // Use useMemo if these stats won't change often (or if needed for performance)
  const stats = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: "Rs. 1,234,567",
        icon: <FaMoneyBillWave />,
        change: "+12%",
        color: "text-green-500",
      },
      {
        title: "Active Vendors",
        value: "156",
        icon: <FaStore />,
        change: "+15%",
        color: "text-blue-500",
      },
      {
        title: "Total Orders",
        value: "2,543",
        icon: <FaShoppingBag />,
        change: "+5%",
        color: "text-purple-500",
      },
      {
        title: "Active Users",
        value: "12.4k",
        icon: <FaUserCheck />,
        change: "+8%",
        color: "text-cyan-500",
      },
    ],
    []
  );

  const secondaryStats = useMemo(
    () => [
      {
        title: "Pending Approvals",
        value: "23",
        icon: <FaExclamationTriangle />,
        type: "Vendors",
        color: "text-orange-500",
      },
      {
        title: "Total Products",
        value: "8,459",
        icon: <FaBox />,
        type: "Items Listed",
        color: "text-indigo-500",
      },
      {
        title: "Platform Growth",
        value: "32%",
        icon: <FaChartLine />,
        type: "Month over Month",
        color: "text-green-500",
      },
      {
        title: "Total Users",
        value: "45.2k",
        icon: <FaUsers />,
        type: "Registered Users",
        color: "text-blue-500",
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
        <div className="p-8 w-full overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Marketplace Overview
            </h1>
            <p className="text-gray-600">
              Platform performance and key metrics
            </p>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(({ title, value, icon, change, color }, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl ${color}`}>{icon}</div>
                  <div className="text-sm font-medium text-green-500">
                    {change}
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryStats.map(
              ({ title, value, icon, type, color }, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-2xl ${color}`}>{icon}</div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {value}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{type}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <Routes>
        <Route path="users" element={<Users />} />
        <Route path="stores" element={<Stores />} />
        <Route path="products" element={<Products />} />
        <Route path="add" element={<Add />} />
        <Route path="edit/:slug" element={<Add />} />
      </Routes>
    </div>
  );
}
