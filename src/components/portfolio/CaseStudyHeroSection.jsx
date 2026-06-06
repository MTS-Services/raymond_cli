import React, { memo } from "react";

const HERO_BG = "/AboutUs/whyChooseUsPhoto.webp";

const TAGS = ["Luxury Residential", "Interior Design", "Renovation"];
const TITLE = "The Skyline Penthouse";
const SUBTITLE =
  "A premium renovation project that transformed a dated 1980s penthouse into a modern, luxurious open-concept living space with breathtaking skyline views.";

const CaseStudyHeroSection = memo(() => (
  <section
    className="relative w-full overflow-hidden"
    style={{ minHeight: "500px", height: "35vw", maxHeight: "600px" }}
    aria-label="Case study hero"
  >
    <img
      src={HERO_BG}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover pointer-events-none"
    />
    <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
    <div className="relative z-10 h-full flex items-center justify-center text-center px-4 pt-20">
      <div className="flex flex-col gap-5 max-w-4xl">
        <h1 className="font-playfair text-white text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight">
          {TITLE}
        </h1>
        <p className="font-inter font-medium text-white text-lg leading-relaxed max-w-3xl mx-auto">
          {SUBTITLE}
        </p>
        <div className="flex flex-wrap gap-6 sm:gap-11 items-center justify-center">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="font-inter font-medium text-orange-peach text-base sm:text-lg lg:text-xl"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
));

CaseStudyHeroSection.displayName = "CaseStudyHeroSection";

export default CaseStudyHeroSection;
