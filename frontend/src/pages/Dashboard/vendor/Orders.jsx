import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../../../App";
import { assets } from "../../../assets/assets";

const Orders = ({ token, vendorId, role }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token || !vendorId) {
      toast.error("Token or Vendor ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        { role }, // You can send additional parameters if needed
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is passed correctly
          },
        }
      );

      if (response.data.success) {
        // Filter orders to include only those with items belonging to the vendor
        const filteredOrders = response.data.orders.filter((order) =>
          order.items.some((item) => item.vendorId === vendorId)
        );

        // Reverse to show the latest orders first
        setOrders(filteredOrders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error.response || error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully.");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating status:", error.response || error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    if (token && vendorId) {
      fetchAllOrders();
    }
  }, [token, vendorId]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            key={index}
          >
            {/* Order Header */}
            <div className="border-b border-gray-100 bg-gray-50 p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img className="w-10 h-10" src={assets.parcel_icon} alt="Order" />
                <div>
                  <p className="font-semibold text-gray-800">Order #{order._id?.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{currency}{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                </div>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items Section */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">
                        {item.name} 
                        <span className="text-gray-500 text-sm ml-2">({item.size})</span>
                      </p>
                      <span className="font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Delivery Details</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium text-gray-800">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600 mt-2">{order.address.street}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-gray-600">
                    {order.address.country} - {order.address.zipcode}
                  </p>
                  <p className="text-gray-600 mt-2">
                    📞 {order.address.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
