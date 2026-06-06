import React, { memo } from "react";
import AnimatedButton from "../shared/AnimatedButton";

const HERO_BG = "/BuildAndRenovate/heroBgRenovation.webp";

const RenovationServiceHero = memo(() => (
  <section
    className="relative w-full overflow-hidden"
    style={{ minHeight: "380px", height: "35vw", maxHeight: "520px" }}
    aria-label="Renovation hero"
  >
    <img
      src={HERO_BG}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 size-full object-cover pointer-events-none"
    />
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ background: "rgba(0,0,0,0.55)" }}
    />
    <div className="relative z-10 h-full flex items-center pt-20">
      <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center">
        <h1 className="text-white font-bold text-[30px] sm:text-[42px] lg:text-[56px] leading-tight mb-4 max-w-2xl">
          Transform Your Space
        </h1>
        <p className="text-white/85 font-medium text-lg leading-relaxed mb-8 max-w-xl">
          Professional renovation services tailored to your needs
        </p>
        <AnimatedButton
          href="#quote"
          className="inline-flex items-center justify-center bg-cta-orange hover:bg-orange-600 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-300"
        >
          Get a Quote
        </AnimatedButton>
      </div>
    </div>
  </section>
));

RenovationServiceHero.displayName = "RenovationServiceHero";

export default RenovationServiceHero;
