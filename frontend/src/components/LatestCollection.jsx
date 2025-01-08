import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products);
  }, [products]);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="mt-4 text-gray-600 leading-relaxed">
          Discover our newest arrivals, carefully curated for the modern
          lifestyle. Each piece tells a story of quality and contemporary
          design.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 gap-y-8">
        {latestProducts.map((item, index) => (
          <div className="transform transition-transform duration-300 hover:scale-105">
            <ProductItem
              key={index}
              slug={item.slug}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
