import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ slug, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="group relative block overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out"
      to={`/product/${slug}`}
    >
      <div className="relative w-full pb-[100%]">
        <div
          className="absolute inset-0 bg-gray-50 bg-center bg-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
          style={{ backgroundImage: `url(${image[0]})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 ease-in-out" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50">
              Quick View
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
          {name}
        </h3>
        <p className="text-base font-bold text-gray-900">
          <span className="text-sm font-normal text-gray-500 mr-1">
            {currency}
          </span>
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
