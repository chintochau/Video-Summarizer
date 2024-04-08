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
  Footer,
} from "../components";

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
      <Footer/>
    </div>
  );
};

export default HomePage;
