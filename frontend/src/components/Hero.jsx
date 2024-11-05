import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className=" font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed mt-4">
            From Our Garden to Yours
          </h1>
          <p className="text-[#414141]/80">
            Shop fresh plants that inspire growth and calm.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Link
              to="/collection"
              className="font-semibold text-sm md:text-base hover:text-black transition-all hover:underline"
            >
              SHOP NOW
            </Link>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img className="w-full sm:w-1/2 p-10" src={assets.hero_img} alt="" />
    </div>
  );
};

export default Hero;
