import React from "react";
import Title from "./Title";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className=" text-center mt-24">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <Title text1={"Subscribe now"} text2={"& get 20% off"} />
        <p className="mt-4 text-gray-600 leading-relaxed">
          Subscribe to our newsletter and stay updated with the latest products,
          exclusive offers, and gardening tips. Join our growing community
          today!
        </p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 bg-white"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
