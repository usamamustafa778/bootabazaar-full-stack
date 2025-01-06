import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

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
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image Upload Section */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, idx) => (
            <label htmlFor={`image${idx + 1}`} key={idx}>
              <img
                className="w-20"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=""
              />
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
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* Category Dropdown */}
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Plants">Plants</option>
            <option value="Gardening Tools">Gardening Tools</option>
            <option value="Pots and Containers">Pots and Containers</option>
            <option value="Soil and Fertilizers">Soil and Fertilizers</option>
          </select>
        </div>

        {/* SubCategory Dropdown */}
        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
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
                <option value="Organic Fertilizers">Organic Fertilizers</option>
                <option value="Compost">Compost</option>
              </>
            )}
          </select>
        </div>

        {/* Price Input */}
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="25"
          />
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
