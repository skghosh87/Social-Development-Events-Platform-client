import React from "react";
import HeroSection from "../Components/Home/HeroSection";
import CoreFeature from "../Components/Home/CoreFeature";
import Moments from "../Components/Home/Moments";
import NewsLetter from "../Components/Home/NewsLetter";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CoreFeature />
      <Moments />
      <NewsLetter />
    </div>
  );
};

export default HomePage;
