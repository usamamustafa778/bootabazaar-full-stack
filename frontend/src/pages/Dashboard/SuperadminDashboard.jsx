import React, { useState, useEffect, useMemo } from "react";
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
import Orders from "./admin/Orders";

export default function SuperadminDashboard() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    users: [],
    products: [],
    stores: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch all data in parallel
        const [ordersRes, usersRes, productsRes, storesRes] = await Promise.all(
          [
            fetch("http://localhost:4000/api/order/list", {
              method: "POST",
              headers,
            }),
            fetch("http://localhost:4000/api/user/profiles", {
              headers,
            }),
            fetch("http://localhost:4000/api/product/list", {
              headers,
            }),
            fetch("http://localhost:4000/api/vendor/stores-list", {
              headers,
            }),
          ]
        );

        const [orders, users, products, stores] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          productsRes.json(),
          storesRes.json(),
        ]);

        setDashboardData({
          orders: orders.orders || [],
          users: users || [],
          products: products.products || [],
          stores: stores.data || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics from the fetched data
  const calculateStats = useMemo(() => {
    const { orders, users, products, stores } = dashboardData;

    // Count active vendors (stores)
    const activeVendors = stores.length;

    // Count total orders
    const totalOrders = orders.length;

    // Count active users (excluding admins and vendors)
    const activeUsers = users.filter((user) => user.role === "user").length;

    // Count pending approvals (pending orders)
    const pendingApprovals = orders.filter(
      (order) => order.status === "pending"
    ).length;

    // Count total products
    const totalProducts = products.length;

    // Count total users
    const totalUsers = users.length;

    return {
      activeVendors,
      totalOrders,
      activeUsers,
      pendingApprovals,
      totalProducts,
      totalUsers,
    };
  }, [dashboardData]);

  const stats = useMemo(
    () => [
      {
        title: "Active Vendors",
        value: calculateStats.activeVendors.toString(),
        icon: <FaStore />,
        change: `${calculateStats.activeVendors > 0 ? "+" : ""}${
          calculateStats.activeVendors
        }`,
        color: "text-blue-500",
      },
      {
        title: "Total Orders",
        value: calculateStats.totalOrders.toString(),
        icon: <FaShoppingBag />,
        change: `${calculateStats.totalOrders > 0 ? "+" : ""}${
          calculateStats.totalOrders
        }`,
        color: "text-purple-500",
      },
      {
        title: "Active Users",
        value: calculateStats.activeUsers.toString(),
        icon: <FaUserCheck />,
        change: `${calculateStats.activeUsers > 0 ? "+" : ""}${
          calculateStats.activeUsers
        }`,
        color: "text-cyan-500",
      },
    ],
    [calculateStats]
  );

  const secondaryStats = useMemo(
    () => [
      {
        title: "Pending Approvals",
        value: calculateStats.pendingApprovals.toString(),
        icon: <FaExclamationTriangle />,
        type: "Orders",
        color: "text-orange-500",
      },
      {
        title: "Total Products",
        value: calculateStats.totalProducts.toLocaleString(),
        icon: <FaBox />,
        type: "Items Listed",
        color: "text-indigo-500",
      },
      {
        title: "Total Users",
        value: calculateStats.totalUsers.toString(),
        icon: <FaUsers />,
        type: "Registered Users",
        color: "text-blue-500",
      },
    ],
    [calculateStats]
  );

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <DashboardSidebar />

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

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          ) : (
            <>
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
                    <h3 className="text-gray-500 text-sm font-medium">
                      {title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

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
                      <h3 className="text-gray-500 text-sm font-medium">
                        {title}
                      </h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {value}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">{type}</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}

      <Routes>
        <Route path="users" element={<Users />} />
        <Route path="stores" element={<Stores />} />
        <Route path="products" element={<Products />} />
        <Route path="add" element={<Add />} />
        <Route path="edit/:slug" element={<Add />} />
        <Route path="orders" element={<Orders />} />
      </Routes>
    </div>
  );
}
