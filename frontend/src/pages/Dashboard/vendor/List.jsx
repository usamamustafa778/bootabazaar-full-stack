import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../../../App";
import { toast } from "react-toastify";

export default function List() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const filteredProducts = response.data.products.filter(
          (product) => product.vendor.user === user?._id
        );
        console.log('Current user ID:', user?._id);
        console.log('Filtered products:', filteredProducts);
        const reversed = filteredProducts.reverse();
        setList(reversed);
        setFilteredList(reversed);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    const filtered = list.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    setFilteredList(filtered);
  };

  const removeProduct = async (id, role) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchList();
    } else {
      toast.error("User ID is missing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Keep filteredList in sync with the primary list
  useEffect(() => {
    setFilteredList(list);
  }, [list]);

  return (
    <div className="p-10 w-full h-screen overflow-y-auto">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Vendor's Product List
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Header Row (for larger screens) */}
      <div className="hidden md:grid grid-cols-[6rem_2fr_1fr_1fr_3rem] gap-4 items-center pb-2 mb-2 border-b text-sm font-semibold text-gray-500 uppercase tracking-wide">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span className="text-center">Action</span>
      </div>

      {/* Product List */}
      {filteredList.length === 0 ? (
        <p className="text-gray-600">No products found for this vendor.</p>
      ) : (
        <div className="grid gap-4">
          {filteredList.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[6rem_2fr_1fr_1fr_3rem] items-center bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>

              {/* Name */}
              <div className="font-medium text-gray-800">{item.name}</div>

              {/* Category */}
              <div className="text-gray-600 mb-1 md:mb-0">{item.category}</div>

              {/* Price */}
              <div className="text-gray-800 font-semibold">
                {currency}
                {item.price}
              </div>

              {/* Action (Remove) */}
              <div className="text-right md:text-center">
                <button
                  onClick={() => removeProduct(item._id, user?.user.role)}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors"
                  title="Remove product"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
