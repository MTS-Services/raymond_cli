import React, { memo } from "react";
import AnimatedButton from "../shared/AnimatedButton";

const HERO_BG = "/BuildAndRenovate/heroBgNewConstruction.webp";

const HeroSection = memo(() => (
  <section
    className="relative w-full overflow-hidden"
    aria-label="New Construction hero"
    style={{ minHeight: "380px", height: "35vw", maxHeight: "520px" }}
  >
    <img
      src={HERO_BG}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover pointer-events-none"
    />
    <div
      className="absolute inset-0 bg-black/50 pointer-events-none"
      aria-hidden="true"
    />
    <div className="relative z-10 h-full flex items-center pt-20">
      <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center gap-6">
        <h1 className="text-white font-bold text-[30px] sm:text-[42px] lg:text-[56px] leading-tight max-w-4xl">
          Discover Future Living Spaces
        </h1>
        <p className="text-white font-medium text-lg leading-relaxed max-w-xl">
          Explore upcoming and under-construction projects
        </p>
        <AnimatedButton
          href="#projects"
          className="inline-flex items-center justify-center bg-cta-orange hover:bg-orange-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors duration-150"
        >
          Explore Projects
        </AnimatedButton>
      </div>
    </div>
  </section>
));

HeroSection.displayName = "HeroSection";

export default HeroSection;
