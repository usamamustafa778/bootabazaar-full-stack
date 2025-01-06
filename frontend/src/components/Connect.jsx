import React from "react";
import Container from "./common/Container";

export default function Connect() {
  return (
    <Container className=" mx-auto max-w-[1600px] py-5 lg:py-10">
      <div className="bg-connect bg-cover  bg-top w-full rounded-xl grid md:grid-cols-2 p-12">
        <div className="text-center lg:text-left text-white py-16 ">
          <h2 className="elementHeading3 text-5xl font-bold prata-regular">
            Explore Bootabazar - Where Gardens Flourish and Dreams Blossom!
          </h2>
          <p className="my-5 text-xl">
            Discover a green oasis at Bootabazaar. Connect with expert
            gardeners, explore premium products, and cultivate your gardening
            passion. Join us today and {"let's"} grow together! 🌱🌻
          </p>
        </div>
        <div></div>
      </div>
    </Container>
  );
}
