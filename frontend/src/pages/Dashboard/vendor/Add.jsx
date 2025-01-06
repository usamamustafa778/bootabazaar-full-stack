import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import { backendUrl } from "../../../App";
import { toast } from "react-toastify";
import axios from "axios";

const Add = ({ token, user }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Plants");
  const [subCategory, setSubCategory] = useState("Indoor Plants");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Debug logging
      console.log("Image states:", { image1, image2, image3, image4 });

      // Modified image handling with size validation
      const maxSize = 5 * 1024 * 1024; // 5MB max size
      const handleImage = (image, fieldName) => {
        if (image instanceof File) {
          if (image.size > maxSize) {
            throw new Error(`${fieldName} is too large. Maximum size is 5MB`);
          }
          console.log(`Appending ${fieldName}:`, image.name, image.size);
          formData.append(fieldName, image);
        }
      };

      // Process each image
      handleImage(image1, "image1");
      handleImage(image2, "image2");
      handleImage(image3, "image3");
      handleImage(image4, "image4");

      // Log FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Retrieve user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const vendor = userData?.user?._id; // Access the nested `_id` field

      if (!vendor) {
        toast.error("Vendor ID not found. Please log in again.");
        return;
      }

      // Basic validation for required fields
      if (!name || !description || !price) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Rest of the form data
      formData.append("vendor", vendor);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      console.log("Sending request to:", `${backendUrl}/api/product/add`);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          // Add timeout and better error handling
          timeout: 30000, // 30 seconds timeout
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload Progress:", percentCompleted + "%");
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Detailed error logging
      console.error("Upload Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      // More specific error handling
      if (error.response?.status === 500) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Unknown server error";
        console.error("Server Error Details:", errorMessage);
        toast.error(`Server Error: ${errorMessage}`);
      } else if (error.code === "ECONNABORTED") {
        toast.error(
          "Upload timed out. Please try with a smaller image or check your connection."
        );
      } else if (error.message.includes("Network Error")) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full max-w-4xl p-10 space-y-8 h-screen overflow-y-scroll"
    >

      {/* Product Details Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">
         Add New Product
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm hover:bg-white/20 min-h-[160px]"
              placeholder="Describe your product..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
            >
              <option value="Plants">Plants</option>
              <option value="Gardening Tools">Gardening Tools</option>
              <option value="Pots and Containers">Pots and Containers</option>
              <option value="Soil and Fertilizers">Soil and Fertilizers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Category
            </label>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
            >
              {category === "Plants" ? (
                <>
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Outdoor Plants">Outdoor Plants</option>
                  <option value="Flowering Plants">Flowering Plants</option>
                  <option value="Succulents">Succulents</option>
                  <option value="Herbs">Herbs</option>
                </>
              ) : category === "Gardening Tools" ? (
                <>
                  <option value="Pruning Tools">Pruning Tools</option>
                  <option value="Watering Tools">Watering Tools</option>
                  <option value="Planting Tools">Planting Tools</option>
                </>
              ) : category === "Pots and Containers" ? (
                <>
                  <option value="Plastic Pots">Plastic Pots</option>
                  <option value="Ceramic Pots">Ceramic Pots</option>
                  <option value="Hanging Pots">Hanging Pots</option>
                  <option value="Planters">Planters</option>
                </>
              ) : (
                <>
                  <option value="Potting Soil">Potting Soil</option>
                  <option value="Organic Fertilizers">
                    Organic Fertilizers
                  </option>
                  <option value="Compost">Compost</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-3 bg-white/10 border border-gray-400/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm hover:bg-white/20"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="w-5 h-5 text-primary border-gray-400/50 rounded-lg focus:ring-primary bg-white/10"
          />
          <label
            className="text-sm font-medium text-gray-700 cursor-pointer"
            htmlFor="bestseller"
          >
            Add to bestseller
          </label>
        </div>
      </div>

        {/* Image Upload Section */}
        <div className="border-b border-gray-700/20 pb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Product Images
        </h2>
        <div className="flex flex-wrap gap-6">
          {[image1, image2, image3, image4].map((image, idx) => (
            <label
              htmlFor={`image${idx + 1}`}
              key={idx}
              className="cursor-pointer group"
            >
              <div className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center overflow-hidden backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:border-primary">
                <img
                  className="w-full h-full object-cover"
                  src={!image ? assets.upload_area : URL.createObjectURL(image)}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => {
                  if (idx === 0) setImage1(e.target.files[0]);
                  else if (idx === 1) setImage2(e.target.files[0]);
                  else if (idx === 2) setImage3(e.target.files[0]);
                  else setImage4(e.target.files[0]);
                }}
                type="file"
                id={`image${idx + 1}`}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg hover:shadow-blue-500/25"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
