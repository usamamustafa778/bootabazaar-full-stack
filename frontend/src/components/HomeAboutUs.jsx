import Container from "./common/Container";
import React from "react";
import Divider from "./common/Divider";
import Title from "./Title";

export default function HomeAboutUs() {
  return (
    <Container className="text-center mx-auto max-w-[1200px] py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Title text1={"ABOUT"} text2={"US"} />
        <p className="mt-4 text-gray-600 leading-relaxed">
          Your one-stop destination for all your gardening needs! 🌿🌻
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-left">
          <p className="font-medium text-gray-600 leading-relaxed">
            Welcome to Boota Bazar - your one-stop destination for all your
            gardening needs! At Boota Bazar, we have reimagined the way
            gardening services and products are accessed and delivered. We take
            pride in presenting a revolutionary platform that combines the
            seamless convenience of Uber with the vast product selection of
            Amazon.
          </p>

          <p className="font-medium text-gray-600 leading-relaxed">
            Are you in search of a skilled and reliable gardener to transform
            your outdoor space into a breathtaking oasis? Look no further! Our
            innovative platform connects you with a network of talented
            gardening professionals, each possessing a green thumb and a passion
            for nurturing nature's beauty.
          </p>

          <p className="font-medium text-gray-600 leading-relaxed">
            Boota Bazar Marketplace is not just about finding expert gardeners;
            it's also a thriving marketplace where entrepreneurs and gardening
            enthusiasts come together. Whether you're offering rare seeds,
            premium fertilizers, or state-of-the-art gardening tools, our
            platform provides the ideal avenue to showcase your products.
          </p>
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735"
            alt="Beautiful garden with flowers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mt-8 text-left">
        <p className="font-medium text-gray-600 leading-relaxed">
          At BootaBazar, we don't just stop at supporting gardeners and product
          sellers. Our commitment to excellence extends to curating a handpicked
          selection of top-quality gardening products sourced from our own
          brand. From eco-friendly gardening supplies to the latest in
          horticultural innovations, we offer a carefully curated range that
          ensures your gardening journey is nothing short of exceptional.
        </p>

        <p className="font-medium text-gray-600 leading-relaxed mt-4">
          Join us in our mission to create a greener world, one garden at a
          time. Whether you're a gardening enthusiast, a seasoned
          horticulturist, or an ambitious green entrepreneur, Boota Bazar
          welcomes you with open arms. Come, let's grow together! 🌱🌺
        </p>
      </div>
    </Container>
  );
}
