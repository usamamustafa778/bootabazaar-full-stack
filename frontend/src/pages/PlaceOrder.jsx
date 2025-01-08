import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simplify formData to only include address fields
  const [formData, setFormData] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      name: user.firstName ? `${user.firstName} ${user.lastName}` : "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.zipcode || "",
    };
  });

  useEffect(() => {
    fetchCartAndProducts();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        firstName: user.firstName || prevData.firstName,
        lastName: user.lastName || prevData.lastName,
        email: user.email || prevData.email,
        phone: user.phone || prevData.phone,
        address: user.address || prevData.address,
        street: user.street || prevData.street,
        city: user.city || prevData.city,
        state: user.state || prevData.state,
        zipcode: user.zipcode || prevData.zipcode,
        country: user.country || prevData.country,
      }));
    }
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      // First fetch cart data
      const cartResponse = await fetch("http://localhost:4000/api/cart/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const cartData = await cartResponse.json();

      // Then fetch all products
      const productsResponse = await fetch(
        "http://localhost:4000/api/product/list",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const productsData = await productsResponse.json();

      // Create a map of products by ID for easy lookup
      const productsMap = productsData.products.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {});

      // Combine cart quantities with product details
      const cartItems = Object.entries(cartData.cartData || {}).map(
        ([productId, quantity]) => {
          const product = productsMap[productId];
          return {
            _id: productId,
            quantity: quantity,
            name: product?.name || "Product Not Found",
            price: product?.price || 0,
            image: product?.image[0] || "/placeholder-image.jpg",
          };
        }
      );

      setCartItems(cartItems);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart and products:", error);
      setLoading(false);
      setCartItems([]);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const orderData = {
        userId: user._id,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          vendorId: item.vendorId,
        })),
        amount: calculateTotal(),
        address: formData,
        paymentMethod: method.toUpperCase(),
        payment: method === "stripe" ? true : false,
        date: Date.now(),
      };

      if (method === "cod") {
        const response = await axios.post(
          "http://localhost:4000/api/order/place",
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          // Clear cart after successful order
          await fetch("http://localhost:4000/api/cart/clear", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          navigate("/orders");
          toast.success("Order placed successfully!");
          navigate("/dashboard");
        } else {
          toast.error(response.data.message);
        }
      } else if (method === "stripe") {
        const responseStripe = await axios.post(
          "http://localhost:4000/api/order/stripe",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (responseStripe.data.success) {
          const { session_url } = responseStripe.data;
          window.location.replace(session_url);
        } else {
          toast.error(responseStripe.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Please complete your order details
          </p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column - Customer Information */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="mb-8">
              <Title text1="DELIVERY" text2="INFORMATION" />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="address"
                  placeholder="Complete Address"
                  value={formData.address}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={onChangeHandler}
                  required
                />
                <InputField
                  name="pincode"
                  placeholder="PIN Code"
                  value={formData.pincode}
                  onChange={onChangeHandler}
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 border-b py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <h3 className="font-medium text-sm text-gray-900">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-end gap-3">
                          <p className="text-gray-500">x{item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900 w-24 text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="space-y-2 pt-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-3">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="mb-6">
                <Title text1="PAYMENT" text2="METHOD" />
              </div>

              <div className="space-y-4">
                <PaymentOption
                  selected={method === "stripe"}
                  onClick={() => setMethod("stripe")}
                  label="PAY WITH STRIPE"
                />
                <PaymentOption
                  selected={method === "cod"}
                  onClick={() => setMethod("cod")}
                  label="CASH ON DELIVERY"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-black text-white py-4 rounded-lg font-medium
                         hover:bg-black/90 transition-all disabled:bg-gray-400
                         disabled:cursor-not-allowed"
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Processing..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
             focus:ring-black/20 focus:border-transparent transition-all
             placeholder-gray-400"
  />
);

// Payment Option Component
const PaymentOption = ({ selected, onClick, icon, label }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border
              transition-all hover:border-black ${
                selected ? "border-black bg-gray-50" : "border-gray-200"
              }`}
  >
    <div
      className={`w-4 h-4 border-2 rounded-full flex items-center justify-center
                ${selected ? "border-black" : "border-gray-300"}`}
    >
      {selected && <div className="w-2 h-2 bg-black rounded-full" />}
    </div>
    {icon ? icon : <p className="font-medium text-gray-700 mx-4">{label}</p>}
  </div>
);

export default PlaceOrder;
