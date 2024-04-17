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
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="features">
        <HowItWorks />
      </div>
      <div id="features">
        <FeaturesAndBenefits />
      </div>
      <div id="social-proof">
        <SocialProof />
      </div>
      <div id="pattern-interruption">
        <PatternInterruption />
      </div>
      <div id="pricing">
        <PricingPlans home />
      </div>
      <div id="faq">
        <FAQs />
      </div>
      <div id="final-cta">
        <FinalCTA />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
