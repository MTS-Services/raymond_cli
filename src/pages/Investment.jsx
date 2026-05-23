import React, { memo, useState, useCallback } from "react";
import { useSEO } from "../hooks/useSEO";
import PropertiesCTA from "../components/shared/PropertiesCTA";
import InvestmentHeroSection from "../components/investment/InvestmentHeroSection";
import InvestmentOpportunitiesSection from "../components/investment/InvestmentOpportunitiesSection";
import InvestmentProcessSection from "../components/investment/InvestmentProcessSection";
import InvestmentContactSection from "../components/investment/InvestmentContactSection";

const Investment = memo(() => {
  const [prefilledInterest, setPrefilledInterest] = useState("");

  const handleInvestNow = useCallback((title) => {
    setPrefilledInterest(title);
    setTimeout(() => {
      const el = document.getElementById("invest-contact-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  useSEO({
    title: "Investment Opportunities",
    description:
      "Explore premium real estate investment opportunities with Skyridge Group. Earn 18-24% average annual ROI through residential development, new construction, and more.",
    keywords: [
      "real estate investment",
      "investment opportunities",
      "ROI",
      "residential development",
      "high-growth markets",
      "skyridge group investment",
    ],
  });

  return (
    <div className="min-h-screen bg-white  py-14 lg:py-20">
      <InvestmentHeroSection />
      <InvestmentOpportunitiesSection onInvestNow={handleInvestNow} />
      <InvestmentProcessSection />
      <InvestmentContactSection prefilledInterest={prefilledInterest} />

      <PropertiesCTA />
    </div>
  );
});

Investment.displayName = "Investment";

export default Investment;
