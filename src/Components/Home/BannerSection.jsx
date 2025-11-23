import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { FaLeaf, FaSeedling } from "react-icons/fa";

import "swiper/css";

import "swiper/css/pagination";

import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

const sliderData = [
  {
    title: "Our mission is to stand by people.",
    slogan: "Ideas Unite. Futures are Built. 🌍",
    image: "https://i.ibb.co.com/YFJRfSwN/images-3.jpg", // সামাজিক উন্নয়নের ইভেন্টের জন্য একটি নতুন ইমেজ URL দিন
    color: "from-blue-700/90",
  },
  {
    title: "Global Progress Forum",
    slogan: "Connecting Minds for Community Impact. 🤝",
    image: "https://i.ibb.co.com/x8X90kt2/G4bs-CK5-W0-AAj9-A6.jpg", // সামাজিক উন্নয়নের ইভেন্টের জন্য একটি নতুন ইমেজ URL দিন
    color: "from-indigo-600/90",
  },
  {
    title: "Plant Trees, Save the Environment",
    slogan: "Driving Sustainable Development, One Event at a Time. 🌱",
    image: "https://i.ibb.co.com/j9XjxNbS/IMG-20190724-103607-Copy-Copy.jpg", // সামাজিক উন্নয়নের ইভেন্টের জন্য একটি নতুন ইমেজ URL দিন
    color: "from-purple-600/90",
  },
];

const BannerSection = () => {
  return (
    <div className="h-[65vh] md:h-[80vh] w-full ">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        effect={"fade"}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="mySwiper w-full h-full"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center p-4`}
              >
                <div className="text-center text-white max-w-3xl animate-fadeIn">
                  <FaSeedling className="text-6xl mx-auto mb-4 text-green-300 drop-shadow-lg" />
                  <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl leading-tight">
                    {slide.title}
                  </h1>
                  <p className="my-4 text-xl md:text-3xl font-medium italic drop-shadow-lg">
                    {slide.slogan}
                  </p>

                  <Link to="/upcoming-events">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-xl transform hover:scale-105 cursor-pointer ">
                      Explore Upcoming Events
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSection;
