import React, { memo } from "react";
import { useSEO } from "../hooks/useSEO";
import PropertiesCTA from "../components/shared/PropertiesCTA";
import CaseStudyHeroSection from "../components/portfolio/CaseStudyHeroSection";
import CaseStudyProjectSection from "../components/portfolio/CaseStudyProjectSection";
import CaseStudyGallerySection from "../components/portfolio/CaseStudyGallerySection";
import CaseStudyFeaturesSection from "../components/portfolio/CaseStudyFeaturesSection";

const CaseStudy = memo(() => {
  useSEO({
    title: "Case Study -- The Skyline Penthouse | Skyridge Group",
    description:
      "A premium renovation project transforming a 1980s penthouse into a modern luxury space. Read the full case study by Skyridge Group.",
  });

  return (
    <div className="min-h-screen bg-primary-50 pb-14 lg:pb-20">
      <CaseStudyHeroSection />
      <CaseStudyProjectSection />
      <CaseStudyGallerySection />
      <CaseStudyFeaturesSection />
      <div className="mt-14 lg:mt-20">
        <PropertiesCTA />
      </div>
    </div>
  );
});

CaseStudy.displayName = "CaseStudy";

export default CaseStudy;
