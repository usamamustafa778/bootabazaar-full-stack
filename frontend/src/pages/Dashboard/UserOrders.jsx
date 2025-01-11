import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "../../components/Title";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UserOrders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        const reversedOrders = [...response.data.orders].reverse();

        reversedOrders.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              if (item) {
                allOrdersItem.push({
                  ...item,
                  status: order.status || "Processing",
                  payment: order.payment || false,
                  paymentMethod: order.paymentMethod || "N/A",
                  date: order.date || new Date().getTime(),
                  orderId: order._id,
                  totalAmount: order.amount || 0,
                  address: order.address || null,
                });
              }
            });
          }
        });
        setorderData(allOrdersItem);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const getTracking = async (orderId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/order/tracking/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTrackingInfo(response.data.tracking);
        setSelectedOrderId(orderId);
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const TrackingModal = ({ tracking, onClose }) => {
    if (!tracking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Tracking</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">Current Status: {tracking.status}</p>
              {tracking.estimatedDelivery && (
                <p className="text-sm text-gray-600">
                  Estimated Delivery:{" "}
                  {new Date(tracking.estimatedDelivery).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Tracking History</h4>
              {tracking.updates
                .slice()
                .reverse()
                .map((update, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-gray-200 pl-4 py-2"
                  >
                    <p className="font-medium text-sm">{update.status}</p>
                    {update.comment && (
                      <p className="text-sm text-gray-600">{update.comment}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-16">
          <Title text1={"MY"} text2={"ORDERS"} />
          <p className="text-gray-600 mt-4 max-w-2xl text-lg">
            Track your orders, view order details, and manage your purchases all
            in one place.
          </p>
        </div>

        {orderData.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="max-w-md mx-auto px-6">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                No Orders Yet
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                Ready to start shopping? Check out our latest collection and
                find something you'll love!
              </p>
              <Link
                to="/collection"
                className="inline-flex items-center px-8 py-4 bg-black text-white font-medium hover:bg-secondary transition-all duration-300 rounded-full group shadow-md hover:shadow-xl"
              >
                Explore Collection
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orderData?.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <h3
                        onClick={() => navigate(`/product/${item.slug}`)}
                        className="text-xl hover:underline font-semibold text-gray-800 hover:text-secondary cursor-pointer transition-colors"
                      >
                        {item.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-end gap-5">
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            item.status.toLowerCase() === "delivered"
                              ? "bg-green-500"
                              : item.status.toLowerCase() === "processing"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                        <span className="font-medium text-gray-800">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Order ID:{" "}
                        <span className="font-medium text-gray-800">
                          #{item.orderId.slice(-6)}
                        </span>
                      </div>
                      <button
                        onClick={() => getTracking(item.orderId)}
                        className="w-fit hover:underline rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Track Order
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="flex items-start gap-8 flex-1">
                      <div className="w-36 h-36 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={item?.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Price</span>
                            <span className="font-semibold">
                              {currency}
                              {item.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Total</span>
                            <span className="font-semibold text-lg">
                              {currency}
                              {item.totalAmount}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Order Date</span>
                            <span className="font-semibold">
                              {new Date(item.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment</span>
                            <span
                              className={`font-semibold ${
                                item.payment ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {item.payment ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Method</span>
                            <span className="font-semibold">
                              {item.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.address && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="font-medium text-gray-700">
                          Delivery Address
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.address.name}
                          </p>
                          <p className="text-gray-600 mt-1">
                            {item.address.address}
                          </p>
                          <p className="text-gray-600">
                            {item.address.city}, {item.address.state}{" "}
                            {item.address.pincode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {item.address.phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {trackingInfo && (
          <TrackingModal
            tracking={trackingInfo}
            onClose={() => {
              setTrackingInfo(null);
              setSelectedOrderId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserOrders;
