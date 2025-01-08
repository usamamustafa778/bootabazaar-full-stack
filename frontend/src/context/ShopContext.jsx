import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId) => {
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }

    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] = cartData[itemId] + 1;
    } else {
      cartData[itemId] = 1;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        {
          itemId,
          userId: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCartItems(cartData);
      } else {
        toast.error(response.data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding item to cart");
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] && typeof cartItems[itemId] === "number") {
        totalCount += cartItems[itemId];
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) {
      toast.error("You need to log in to update cart.");
      return;
    }

    let cartData = structuredClone(cartItems);

    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        {
          itemId,
          quantity,
          userId: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        if (quantity > 0) {
          cartData[itemId] = quantity;
        } else {
          delete cartData[itemId];
        }
        setCartItems(cartData);
      } else {
        toast.error(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating cart");
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    // try {
    //   const response = await axios.post(
    //     `${backendUrl}/api/cart/get`,
    //     {
    //       userId: token,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   if (response.data.success) {
    //     setCartItems(response.data.cartData);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error(error.response?.data?.message || "Error fetching cart");
    // }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
