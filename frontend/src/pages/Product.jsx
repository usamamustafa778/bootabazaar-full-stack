import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { slug } = useParams();
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          itemId: productData._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Item added to cart successfully");
      } else {
        toast.error(data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding item to cart");
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/product/${slug}`
      );
      if (response.data.status) {
        setProductData(response.data.product);
        console.log(response.data.product);
        setImage(response.data.product.image[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error loading product details");
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  return productData?.name ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Overview Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Image */}
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => setImage(item)}
                className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                  image === item
                    ? "border-green-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={item}
                  alt={`${productData.name} - view ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {productData.name}
          </h1>

          {/* Vendor Information */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Sold by:</h3>
              <span className="text-primary">{productData.vendor.storeName}</span>
              {productData.vendor.isVerified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {productData.vendor.storeDescription}
            </p>
          </div>

          {/* Price and Stock */}
          <div className="space-y-2">
            <div className="text-4xl font-bold text-gray-900">
              Rs {productData.price.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                productData.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm text-gray-600">
                {productData.stock > 0 
                  ? `${productData.stock} in stock` 
                  : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">Category</p>
                <p>{productData.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Sub Category</p>
                <p>{productData.subCategory}</p>
              </div>
              {productData.sizes?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-gray-500">Available Sizes</p>
                  <p>{productData.sizes.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <div className="prose prose-sm">
              {productData.description.split('\r\n').map((line, index) => (
                <p key={index} className="text-gray-600">
                  • {line}
                </p>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={productData.stock === 0}
            className={`w-full py-4 px-8 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all ${
              productData.stock > 0
                ? 'bg-secondary hover:bg-primary'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart />
            {productData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Features/Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <FaTruck className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-gray-500">For orders above Rs 5000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUndo className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-gray-500">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium">Secure Shopping</p>
                <p className="text-sm text-gray-500">100% Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-8 py-4 font-medium transition-all ${
              activeTab === "description"
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-8 py-4 font-medium transition-all ${
              activeTab === "reviews"
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews (0)
          </button>
        </div>

        <div className="py-8">
          {activeTab === "description" ? (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {productData.description}
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our products are carefully selected to ensure the highest
                quality and customer satisfaction. Each item undergoes rigorous
                quality control before being made available for purchase.
              </p>
            </div>
          ) : (
            <div className="text-gray-600">
              Reviews content will be displayed here...
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
};

export default Product;
