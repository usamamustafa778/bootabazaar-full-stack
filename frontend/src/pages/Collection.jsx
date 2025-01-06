import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FaFilter, FaChevronDown } from "react-icons/fa";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Title text1={"ALL"} text2={"COLLECTIONS"} />
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="relavent">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden w-full flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-sm"
          >
            <span className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <span className="font-medium">Filters</span>
            </span>
            <FaChevronDown
              className={`transform transition-transform duration-200 ${
                showFilter ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Filter Content */}
          <div
            className={`${
              showFilter ? "block" : "hidden"
            } lg:block space-y-6 bg-white rounded-lg p-6 shadow-sm`}
          >
            {/* Categories */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-3">
                {[
                  "Plants",
                  "Gardening Tools",
                  "Pots and Containers",
                  "Soil and Fertilizers",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      onChange={toggleCategory}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Type</h3>
              <div className="space-y-3">
                {[
                  "Indoor Plants",
                  "Outdoor Plants",
                  "Flowering Plants",
                  "Succulents",
                  "Herbs",
                  "Pruning Tools",
                  "Watering Tools",
                  "Planting Tools",
                  "Plastic Pots",
                  "Ceramic Pots",
                  "Hanging Pots",
                  "Planters",
                  "Potting Soil",
                  "Organic Fertilizers",
                  "Compost",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      onChange={toggleSubCategory}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filterProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
