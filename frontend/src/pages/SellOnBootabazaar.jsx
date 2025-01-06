import React, { useState } from "react";
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

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "vendor",
      });

      if (response.data) {
        toast.success("Seller Registration Request Successful!");
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Start Selling on Bootabazaar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your Business Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
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
