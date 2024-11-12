import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        const quantity = cartItems[itemId]["undefined"];
        if (quantity > 0) {
          tempData.push({
            _id: itemId,
            quantity,
          });
        }
      }
      setCartData(tempData);
      setDataReady(true);
    }
  }, [products, cartItems]);

  if (!dataReady) {
    return <div>Loading your cart...</div>;
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.length > 0
          ? cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) {
                console.warn(
                  `Product with ID ${item._id} not found in products`
                );
                return null;
              }

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20"
                      src={productData.image[0]}
                      alt={productData.name}
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {(productData.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            undefined,
                            Number(e.target.value)
                          )
                    }
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <img
                    onClick={() => updateQuantity(item._id, undefined, 0)}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt="Remove item"
                  />
                </div>
              );
            })
          : window.location.reload()}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
