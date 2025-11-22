import React from "react";

import BannerSection from "../Components/Home/BannerSection";
import FeatureSection from "../Components/Home/FeatureSection";
import GallerySection from "../Components/Home/GallerySection";
import NewsLetterSection from "../Components/Home/NewsLetterSection";

const HomePage = () => {
  return (
    <div>
      <BannerSection />
      <FeatureSection />
      <GallerySection />
      <NewsLetterSection />
    </div>
  );
};

export default HomePage;
