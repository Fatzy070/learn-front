import React from "react";
import Slider from "react-slick";

import slider from "../assets/slider.png";
import slider1 from "../assets/slider1.avif";
import slider2 from "../assets/slider2.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSlider = () => {
  const slides = [slider, slider1, slider2];

  const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-2 -translate-y-1/2 z-50 cursor-pointer text-white text-3xl font-bold"
    onClick={onClick}
  >
    ›
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-2 -translate-y-1/2 z-50 cursor-pointer text-white text-3xl font-bold"
    onClick={onClick}
  >
    ‹
  </div>
);

 const settings = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

  return (
   <>
  <div className="hidden lg:block h-[25rem]">
    <img 
    src={slider2}
    alt=""
    className="w-full h-full"
    />
  </div>

     <div className="w-full block lg:hidden">
      <Slider {...settings}>
        {slides.map((img, index) => (
          <div key={index} className="relative w-full">
            <img
              src={img}
              alt={`slide-${index}`}
              className="w-full h-[250px] md:h-[350px] object-cover"
            />
         
          </div>
        ))}
      </Slider>
    </div>
   </>
  );
};

export default HeroSlider;
