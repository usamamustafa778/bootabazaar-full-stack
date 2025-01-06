import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import HomeAboutUs from "../components/HomeAboutUs";
import Connect from "../components/Connect";
import { faqs } from "../../localData";
import Accordian from "../components/common/Accordian";

const Home = () => {
  return (
    <div>
      <Hero />
      <HomeAboutUs />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <Connect />
      <Accordian options={faqs} />
      <NewsletterBox />
    </div>
  );
};

export default Home;
