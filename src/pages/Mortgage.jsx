import React, { memo } from "react";
import { useSEO } from "../hooks/useSEO";
import PropertiesCTA from "../components/shared/PropertiesCTA";
import HeroSection from "../components/mortgage/HeroSection";
import MortgageCalcSection from "../components/mortgage/MortgageCalcSection";
import RefinanceCalcSection from "../components/mortgage/RefinanceCalcSection";
import LoanTypesSection from "../components/mortgage/LoanTypesSection";
import ApplicationFormSection from "../components/mortgage/ApplicationFormSection";

const Mortgage = memo(() => {
  useSEO({
    title: "Mortgage Solutions | Skyridge Group",
    description:
      "Calculate your mortgage payment instantly. Explore fixed-rate, adjustable-rate, and first-time buyer loans. Get pre-approved with Skyridge Group today.",
    keywords: [
      "mortgage calculator",
      "refinance calculator",
      "home loan",
      "mortgage rate",
      "first-time buyer",
      "skyridge group",
    ],
  });

  return (
    <div className="bg-white min-h-screen py-14 lg:py-20">
      <HeroSection />
      <MortgageCalcSection />
      <RefinanceCalcSection />
      <LoanTypesSection />
      <ApplicationFormSection />
      <PropertiesCTA />
    </div>
  );
});

Mortgage.displayName = "Mortgage";

export default Mortgage;
