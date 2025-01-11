import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "../../components/Title";
import axios from "axios";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id;
            allOrdersItem.push(item);
          });
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orderData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
          <Link
            to="/collection"
            className="mt-6 inline-flex items-center px-6 py-3 bg-black text-white font-medium hover:bg-secondary transition-all group"
          >
            Browse Collection
            <svg
              className="w-4 h-4 ml-1"
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
      ) : (
        <div className="space-y-6">
          {orderData?.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-md overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={item?.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-4">
                        <p className="font-medium">
                          {currency}
                          {item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      <p>
                        Ordered on{" "}
                        <span className="text-gray-500">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                      <p>
                        Payment Method:{" "}
                        <span className="text-gray-500">
                          {item.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-4 items-start md:items-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status.toLowerCase() === "delivered"
                          ? "bg-green-500"
                          : item.status.toLowerCase() === "processing"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <p className="text-sm font-medium">{item.status}</p>
                  </div>
                  <button
                    onClick={() => getTracking(item.orderId)}
                    className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Track Order
                  </button>
                </div>
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
  );
};

export default UserOrders;
