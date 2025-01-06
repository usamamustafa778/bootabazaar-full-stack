import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545165375-1b744b9ed444?q=80&w=2070"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-12 h-[2px] bg-white"></span>
            <p className="text-white font-medium tracking-wider text-sm">
              WELCOME TO PLANTIFY
            </p>
          </div>

          <h1 className="prata-regular text-4xl md:text-6xl text-white leading-tight mb-6">
            Bring Nature Into Your Living Space
          </h1>

          <p className="text-white/90 text-lg mb-8 max-w-xl">
            Discover our curated collection of premium indoor plants, designed
            to transform your home into a natural sanctuary.
          </p>

          <Link
            to="/collection"
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all group"
          >
            Explore Collection
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
