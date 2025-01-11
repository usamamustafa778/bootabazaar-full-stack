import React, { useState, useEffect } from "react";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/product/list", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/api/product/remove`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        const data = await response.json();

        if (data.success) {
          setProducts(products.filter((product) => product._id !== id));
        } else {
          throw new Error(data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user);

  return (
    <div className="p-8 w-full h-screen overflow-y-scroll">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaBox className="text-primary text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Products Management
              </h2>
              <p className="text-gray-500 text-sm">Manage store products</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/add")}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaBox className="text-lg" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center p-4 bg-gray-50 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-600">PRODUCT</span>
          <span className="text-sm font-semibold text-gray-600">STORE</span>
          <span className="text-sm font-semibold text-gray-600">CATEGORY</span>
          <span className="text-sm font-semibold text-gray-600">PRICE</span>
          <span className="text-sm font-semibold text-gray-600">STOCK</span>
          <span className="text-sm font-semibold text-gray-600">ACTIONS</span>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FaBox className="text-5xl mx-auto" />
            </div>
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map(
              (product) =>
                product?.vendor?._id === user?._id && (
                  <div
                    key={product._id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center p-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Product Info */}
                    <div className="space-y-1">
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image[0] || product.image}
                              alt={product.name}
                              className="w-full border border-gray-200 h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FaBox className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div>
                          <div>{product.name}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {product.description.slice(0, 25)}...
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Store */}
                    <div className="text-gray-600">
                      {product.vendor?.storeName || "N/A"}
                    </div>

                    {/* Category */}
                    <div className="text-gray-600">{product.category}</div>

                    {/* Price */}
                    <div className="font-medium text-gray-800">
                      Rs. {product.price.toFixed(2)}
                    </div>

                    {/* Stock */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit/${product.slug}`)
                        }
                        className="p-1.5 text-gray-600 hover:text-secondary hover:bg-primary/10 rounded-lg transition-colors duration-150"
                        title="Edit product"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        title="Delete product"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
