import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // ⬅️ Swiper সঠিক ভাবে ইমপোর্ট করা হয়েছে
import Container from "../Container"; // ধরে নিলাম এই কম্পোনেন্টটি বিদ্যমান
import { Autoplay, Navigation } from "swiper/modules";

// প্রয়োজনীয় CSS ইমপোর্ট যোগ করুন
import "swiper/css";
import "swiper/css/navigation";

const galleryPhotos = [
  "https://i.ibb.co.com/Ngg3Nk2D/image.jpg",
  "https://i.ibb.co.com/Jw3k9YVZ/WSSAUWIN-kip-C-621x414-Live-Mint.webp",
  "https://i.ibb.co.com/gFJ0VKZT/images.jpg",
  "https://i.ibb.co.com/sJWLH4yQ/Tree-Planting-Campaigns-CSR-ESG-NGO-Sustainability-Earth5-R-Mumbai-1.jpg",
  "https://i.ibb.co.com/PZqK5qS1/images-2.jpg",
];

const GallerySection = () => {
  return (
    <div>
      <section className="py-10 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 border-b-2 border-blue-500 inline-block mx-auto pb-1">
            Moments of Impact
          </h2>

          {/* Swiper Slider ব্যবহার করে গ্যালারি তৈরি */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="mySwiper"
          >
            {galleryPhotos.map((photo, index) => (
              <SwiperSlide key={index}>
                <div className="h-64 rounded-lg overflow-hidden shadow-lg border-4 border-white transition duration-300 hover:shadow-2xl">
                  <img
                    src={photo}
                    alt={`Event Gallery Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>
    </div>
  );
};

export default GallerySection;
