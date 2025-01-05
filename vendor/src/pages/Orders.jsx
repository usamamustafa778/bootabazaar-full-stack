import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";

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

  console.log("Token in  vendor Order", token);
  return (
    <div>
      <h3>Vendor Orders Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
