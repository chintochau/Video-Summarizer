import React from "react";
import {
  HeroSection,
  HowItWorks,
  FeaturesAndBenefits,
  PatternInterruption,
  SocialProof,
  PricingPlans,
  FAQs,
  FinalCTA,
} from "../Components";

const HomePage = () => {
  return (
    <div className="mx-auto">
      <HeroSection />
      <HowItWorks />
      <FeaturesAndBenefits />
      <SocialProof />
      <PatternInterruption />
      <PricingPlans home/>
      <FAQs />
      <FinalCTA />
    </div>
  );
};

export default HomePage;
