import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Add = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:4000/api/vendor/stores-list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        const data = await response.json();
        setStores(data?.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Failed to fetch stores");
        setStores([]);
      }
    };

    fetchStores();
  }, []);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Plants");
  const [subCategory, setSubCategory] = useState("Indoor Plants");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;

      try {
        const response = await axios.get(`${backendUrl}/api/product/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const product = response.data.product;
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price?.toString() || "");
        setCategory(product.category || "Plants");
        setSubCategory(product.subCategory || "Indoor Plants");
        setBestseller(Boolean(product.bestseller));
        setSizes(product.sizes || []);
        setStock(product.stock?.toString() || "");
        setSelectedStore(product?.vendor?._id || "");
        setProductId(product._id || "");
        if (product.image?.length > 0) {
          const imageSetters = [setImage1, setImage2, setImage3, setImage4];
          product.image.forEach((imageUrl, index) => {
            if (imageSetters[index]) {
              imageSetters[index](imageUrl || null);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [slug, token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formData = new FormData();

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

      handleImage(image1, "image1");
      handleImage(image2, "image2");
      handleImage(image3, "image3");
      handleImage(image4, "image4");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const vendor = user?._id;

      if (!vendor) {
        toast.error("Vendor ID not found. Please log in again.");
        return;
      }

      if (!name || !description || !price || !stock) {
        toast.error("Please fill in all required fields");
        return;
      }

      formData.append("vendor", selectedStore);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", stock);

      const url = slug
        ? `${backendUrl}/api/product/update/${productId}`
        : `${backendUrl}/api/product/add`;

      const method = slug ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload Progress:", percentCompleted + "%");
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard/products");
      }
    } catch (error) {
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
    } finally {
      setIsProcessing(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full max-w-4xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        {slug ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="flex flex-wrap gap-4">
        {[image1, image2, image3, image4].map((image, idx) => (
          <label
            htmlFor={`image${idx + 1}`}
            key={idx}
            className="cursor-pointer group"
          >
            <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden bg-white/10 hover:bg-white/20 transition-all">
              <img
                className="w-full h-full object-cover"
                src={
                  !image
                    ? assets.upload_area
                    : image instanceof File
                    ? URL.createObjectURL(image)
                    : image
                }
                alt=""
              />
            </div>
            <input
              onChange={(e) => {
                const setImage = [setImage1, setImage2, setImage3, setImage4][
                  idx
                ];
                setImage(e.target.files[0]);
              }}
              type="file"
              id={`image${idx + 1}`}
              hidden
              accept="image/*"
            />
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.role === "admin" && !slug && (
          <select
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store._id} value={store._id}>
                {store.storeName}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Price Rs."
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          min="0"
          required
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          min="0"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="Plants">Plants</option>
          <option value="Gardening Tools">Gardening Tools</option>
          <option value="Pots and Containers">Pots and Containers</option>
          <option value="Soil and Fertilizers">Soil and Fertilizers</option>
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
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

      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
        required
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
          className="w-4 h-4"
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="ml-auto w-fit px-10 py-2 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isProcessing && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {slug ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default Add;
