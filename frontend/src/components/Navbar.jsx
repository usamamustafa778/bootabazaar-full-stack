import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 font-medium sticky top-0 bg-white z-20 shadow-sm">
      <Link to="/">
        <img src={assets.logo} className="w-44" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-8 text-sm text-gray-600">
        <NavLink
          to="/"
          className="flex flex-col items-center gap-1 hover:text-black transition-colors"
        >
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
        </NavLink>
        <NavLink
          to="/collection"
          className="flex flex-col items-center gap-1 hover:text-black transition-colors"
        >
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
        </NavLink>
        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1 hover:text-black transition-colors"
        >
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1 hover:text-black transition-colors"
        >
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
        </NavLink>
        <NavLink
          to="/sell-on-bootabazaar"
          className="flex flex-col items-center gap-1 hover:text-black transition-colors"
        >
          <p>BECOME A SELLER</p>
          <hr className="w-2/4 border-none h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-8">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer hover:opacity-70 transition-opacity"
          alt=""
        />

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer hover:opacity-70 transition-opacity"
            src={assets.profile_icon}
            alt=""
          />

          {/* Enhanced Dropdown Menu */}
          {token && (
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute dropdown-menu right-0 z-50 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex flex-col w-48 py-2 bg-white shadow-lg rounded-lg border border-gray-100">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Link>
                <div className="my-1 border-b border-gray-100"></div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/cart"
          className="relative hover:opacity-70 transition-opacity"
        >
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-8px] bottom-[-8px] w-5 h-5 flex items-center justify-center bg-black text-white rounded-full text-xs">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
