import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { FaStar, FaRegStar, FaShoppingCart, FaTruck, FaUndo, FaShieldAlt } from "react-icons/fa";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
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
                  image === item ? "border-green-500" : "border-gray-200 hover:border-gray-300"
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
          <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                index < 4 ? <FaStar key={index} /> : <FaRegStar key={index} />
              ))}
            </div>
            <span className="text-gray-500">(122 reviews)</span>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold text-gray-900">
            {currency}
            {productData.price}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    item === size
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={!size}
            className={`w-full py-4 px-8 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all ${
              size
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaShoppingCart />
            Add to Cart
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <FaTruck className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-gray-500">For orders above $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUndo className="text-gray-400 text-xl" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-gray-500">7 days return policy</p>
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
            Reviews (122)
          </button>
        </div>
        
        <div className="py-8">
          {activeTab === "description" ? (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {productData.description}
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our products are carefully selected to ensure the highest quality
                and customer satisfaction. Each item undergoes rigorous quality
                control before being made available for purchase.
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
