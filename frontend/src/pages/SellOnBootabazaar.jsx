import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaChartBar,
  FaBullhorn,
  FaCreditCard,
  FaCube,
  FaMobileAlt,
  FaGraduationCap,
  FaStar,
  FaTools,
  FaHeadset,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const LoginForm = ({ data, setData, onSubmit, loading, onSwitch }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Welcome Back!</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-secondary hover:text-green-700 font-medium"
        >
          Sign up here
        </button>
      </p>
    </form>
  );
};

const SignupForm = ({ data, setData, onSubmit, loading, onSwitch }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Create Account</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Create a password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={data.confirmPassword}
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Confirm your password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-secondary hover:text-green-700 font-medium"
        >
          Sign in here
        </button>
      </p>
    </form>
  );
};

const PersonalInfoForm = ({ data, setData, onSubmit, loading }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Personal Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={user.name}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={user.email}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
          disabled
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Continue to Store Setup"}
      </button>
    </form>
  );
};

const StoreForm = ({ data, setData, onSubmit, loading, onBack }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Store Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Name
        </label>
        <input
          type="text"
          value={data.storeName}
          onChange={(e) => setData({ ...data, storeName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Your Store Name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Description
        </label>
        <textarea
          value={data.storeDescription}
          onChange={(e) =>
            setData({ ...data, storeDescription: e.target.value })
          }
          rows="4"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your store"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Logo
        </label>
        <input
          type="file"
          onChange={(e) => setData({ ...data, storeImage: e.target.files[0] })}
          className="w-full"
          accept="image/*"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Banner
        </label>
        <input
          type="file"
          onChange={(e) => setData({ ...data, storeBanner: e.target.files[0] })}
          className="w-full"
          accept="image/*"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-2/3 bg-secondary text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating Store..." : "Create Store"}
        </button>
      </div>
    </form>
  );
};

const RegisterModal = ({ isOpen, onClose }) => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState(token ? "personal" : "login");
  const [loading, setLoading] = useState(false);

  // Form data state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    role: "vendor",
  });

  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
    storeImage: null,
    storeBanner: null,
  });

  // Handle login form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        loginData
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful!");
        setFormType("personal");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup form
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: "vendor",
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Registration successful!");
        setFormType("personal");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle personal information form
  const updateUserRole = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "user") return true;

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "vendor",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            token: token,
          },
        }
      );

      if (response.data.success) {
        const updatedUser = { ...user, role: "vendor" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Account upgraded to vendor successfully!");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upgrade account to vendor"
      );
      return false;
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const roleUpdateSuccess = await updateUserRole();
    setLoading(false);

    if (roleUpdateSuccess) {
      setStep(2);
    }
  };

  // Handle store information form
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("storeName", storeData.storeName);
      formDataToSend.append("storeDescription", storeData.storeDescription);
      if (storeData.storeImage)
        formDataToSend.append("storeImage", storeData.storeImage);
      if (storeData.storeBanner)
        formDataToSend.append("storeBanner", storeData.storeBanner);

      const response = await axios.post(
        `${backendUrl}/api/store/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Store created successfully!");
        onClose();
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate form based on formType and step
  const renderForm = () => {
    if (step === 1) {
      switch (formType) {
        case "login":
          return (
            <LoginForm
              data={loginData}
              setData={setLoginData}
              onSubmit={handleLoginSubmit}
              loading={loading}
              onSwitch={() => setFormType("signup")}
            />
          );
        case "signup":
          return (
            <SignupForm
              data={signupData}
              setData={setSignupData}
              onSubmit={handleSignupSubmit}
              loading={loading}
              onSwitch={() => setFormType("login")}
            />
          );
        case "personal":
          return (
            <PersonalInfoForm
              data={personalData}
              setData={setPersonalData}
              onSubmit={handlePersonalSubmit}
              loading={loading}
            />
          );
        default:
          return null;
      }
    } else {
      return (
        <StoreForm
          data={storeData}
          setData={setStoreData}
          onSubmit={handleStoreSubmit}
          loading={loading}
          onBack={() => setStep(1)}
        />
      );
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full relative overflow-hidden flex shadow-xl">
        {/* Left side - Image and text */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-black/50 to-secondary/50">
            <div className="p-8 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4">Join our community</h3>
                <p className="text-green-100">
                  {step === 1
                    ? "Join our community of plant sellers and reach customers worldwide."
                    : "Almost there! Let's create your store profile."}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaChartBar className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">
                    Access to millions of customers
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaTools className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">Powerful seller tools</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaHeadset className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white">24/7 Seller support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Forms */}
        <div className="w-full md:w-1/2 p-8">{renderForm()}</div>
      </div>
    </div>
  );
};

const SellOnBootabazaar = ({ token }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary via-green-800 to-secondary text-white">
        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3')`,
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10 px-4 py-36 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center font-heading">
            Turn Your Green Thumb Into Gold
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 text-center">
            Join the fastest-growing marketplace for garden enthusiasts and
            plant lovers
          </p>
          <button
            onClick={openModal}
            className="bg-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-lg"
          >
            Become a Seller
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl bg-green-50">
              <div className="text-4xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-gray-600">Active Sellers</div>
            </div>
            <div className="p-6 rounded-xl bg-green-50">
              <div className="text-4xl font-bold text-secondary mb-2">2M+</div>
              <div className="text-gray-600">Products Sold</div>
            </div>
            <div className="p-6 rounded-xl bg-green-50">
              <div className="text-4xl font-bold text-secondary mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="p-6 rounded-xl bg-green-50">
              <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 font-heading">
          Why Choose Bootabazaar?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChartBar className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 font-heading">
              Rapid Growth
            </h3>
            <p className="text-gray-600">
              Access millions of garden enthusiasts actively looking for
              products like yours
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTools className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 font-heading">
              Powerful Tools
            </h3>
            <p className="text-gray-600">
              Get advanced analytics, inventory management, and marketing tools
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeadset className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 font-heading">
              Expert Support
            </h3>
            <p className="text-gray-600">
              Dedicated support team to help you succeed at every step
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 font-heading">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 font-heading">
                Register as a Seller
              </h3>
              <p className="text-gray-600">
                Quick registration process with simple verification steps
              </p>
              <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-green-200"></div>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 font-heading">
                List Your Products
              </h3>
              <p className="text-gray-600">
                Easy-to-use interface for adding products and managing inventory
              </p>
              <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-green-200"></div>
            </div>
            <div>
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 font-heading">
                Start Selling
              </h3>
              <p className="text-gray-600">
                Receive orders and grow your business with our marketing tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 font-heading">
            Features That Set Us Apart
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Analytics",
                description:
                  "Track your sales, customer behavior, and inventory in real-time with our advanced analytics dashboard",
                icon: <FaChartBar className="w-6 h-6 text-secondary" />,
              },
              {
                title: "Marketing Tools",
                description:
                  "Built-in SEO optimization, promotional tools, and social media integration to boost your sales",
                icon: <FaBullhorn className="w-6 h-6 text-secondary" />,
              },
              {
                title: "Secure Payments",
                description:
                  "Multiple payment options and secure transaction processing to ensure smooth operations",
                icon: <FaCreditCard className="w-6 h-6 text-secondary" />,
              },
              {
                title: "Inventory Management",
                description:
                  "Easy-to-use tools for managing your product listings, stock levels, and variants",
                icon: <FaCube className="w-6 h-6 text-secondary" />,
              },
              {
                title: "Mobile App",
                description:
                  "Manage your store on the go with our dedicated mobile application",
                icon: <FaMobileAlt className="w-6 h-6 text-secondary" />,
              },
              {
                title: "Training Resources",
                description:
                  "Access to comprehensive guides, tutorials, and webinars to help you succeed",
                icon: <FaGraduationCap className="w-6 h-6 text-secondary" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller Success Stories */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 font-heading">
            Seller Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                business: "Green Thumb Gardens",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3",
                quote:
                  "Since joining Bootabazaar, my plant business has grown by 300%. The platform's tools and support made scaling easy.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                business: "Urban Botanics",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3",
                quote:
                  "The analytics tools helped me understand my customers better. My sales have doubled in just 6 months!",
                rating: 5,
              },
              {
                name: "Emma Davis",
                business: "Succulent Success",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3",
                quote:
                  "Bootabazaar's seller support is incredible. They're always there to help with any questions I have.",
                rating: 5,
              },
            ].map((story, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{story.name}</h3>
                    <p className="text-secondary">{story.business}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{story.quote}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(story.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 font-heading">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How do I start selling on Bootabazaar?",
                answer:
                  "Simply click on the 'Become a Seller' button, fill out the registration form, and once approved, you can start listing your products.",
              },
              {
                question: "What are the fees for selling?",
                answer:
                  "We charge a competitive commission rate on each sale. There are no monthly fees or listing fees to get started.",
              },
              {
                question: "How do I get paid?",
                answer:
                  "Payments are processed every week for all completed orders. We support multiple payment methods including direct bank transfer.",
              },
              {
                question: "What kind of support do you provide?",
                answer:
                  "We offer 24/7 seller support, comprehensive training materials, and dedicated account managers for high-volume sellers.",
              },
              {
                question: "Can I sell internationally?",
                answer:
                  "Yes, you can sell to customers worldwide. We provide tools to manage shipping rates and delivery options for different regions.",
              },
              {
                question: "How do you handle returns?",
                answer:
                  "We have a streamlined returns process that's fair for both sellers and buyers. Our support team helps manage all return requests.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-primary/90 via-green-800/95 to-secondary/90 py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 font-heading text-white">
            Ready to Start Your Success Story?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of successful sellers on Bootabazaar
          </p>
          <button
            onClick={openModal}
            className="bg-white text-secondary px-12 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Modal */}
      <RegisterModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default SellOnBootabazaar;
