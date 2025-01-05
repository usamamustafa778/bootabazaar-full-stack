import Container from "./common/Container";
import React from "react";
import Divider from "./common/Divider";

export default function HomeAboutUs() {
  return (
      <Container className=" text-center  mx-auto max-w-[1200px] p-16 " >
        <div className="flex flex-col items-center max-w-xl mb-5">
          <p className="text-primary font-medium text-lg">
            Welcome to bootabazaar
          </p>
          <h2 className="text-4xl font-bold text-center py-3">
            Your one-stop destination for all your gardening needs! 🌿🌻
          </h2>
          <Divider />
        </div>
        <p className="font-medium text-gray-600">
          Welcome to Boota Bazar - your one-stop destination for all your
          gardening needs! 🌿🌻 At Boota Bazar, we have reimagined the way
          gardening services and products are accessed and delivered. We take
          pride in presenting a revolutionary platform that combines the
          seamless convenience of Uber with the vast product selection of
          Amazon, creating an unparalleled experience for both gardeners and
          gardening enthusiasts alike. Are you in search of a skilled and
          reliable gardener to transform your outdoor space into a breathtaking
          oasis? Look no further! Our innovative platform connects you with a
          network of talented gardening professionals, each possessing a green
          thumb and a passion for nurturing
          {"nature's"} beauty. With just a few taps, you can find the perfect
          gardener to bring your garden dreams to life. But wait, {"there's"}{" "}
          more! Boota bazar Marketplace is not just about finding expert
          gardeners; {"it's"} also a thriving marketplace where boota-bazar
          entrepreneurs and gardening enthusiasts come together. If you have a
          green product to offer be it rare seeds, premium fertilizers, or
          state-of-the-art gardening tools our platform provides you with the
          ideal avenue to showcase and sell your items to a vast community of
          eager gardeners. At BootaBazar, we
          {"don't"} just stop at supporting gardeners and product sellers. Our
          commitment to excellence extends to curating a handpicked selection of
          top-quality gardening products sourced from our own brand. From
          eco-friendly gardening supplies to the latest in horticultural
          innovations, we offer a carefully curated range that ensures your
          gardening journey is nothing short of exceptional. Join us in our
          mission to create a greener world, one garden at a time. Whether{" "}
          {"you're"} a gardening enthusiast, a seasoned horticulturist, or an
          ambitious green entrepreneur, GreenThumb Marketplace welcomes you with
          open arms.Come,
          {"let's"} grow together! 🌱🌺
        </p>
      </Container>
  );
}
