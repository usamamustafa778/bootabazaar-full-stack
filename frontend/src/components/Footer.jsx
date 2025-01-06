import React from "react";
import { assets } from "../assets/assets";
import Container from "./common/Container";

const Footer = () => {
  return (
    <>
      <Container className="mx-auto">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40">
          <div>
            <img src={assets.logo} className="mb-5 w-48" alt="" />
            <p className="w-full md:w-2/3 text-gray-600">
              Welcome to Boota Bazar - your one-stop destination for all your
              gardening needs! At Boota Bazar, we have reimagined the way
              gardening services and products are accessed and delivered. We
              take pride in presenting a revolutionary platform that combines
              the seamless convenience of Uber with the vast product selection
              of Amazon.
            </p>
          </div>

          <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Home</li>
              <li>About us</li>
              <li>Delivery</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>+92-313-622-4778</li>
              <li>contact@bootabazaar.com</li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="w-full">
        <hr />
        <p className="py-5 text-lg font-bold text-white text-center w-full bg-secondary">
          Copyright 2024@ bootabazaar.com - All Right Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
