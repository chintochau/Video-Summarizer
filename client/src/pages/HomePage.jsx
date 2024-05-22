import React from "react";
import {
  HeroSection,
  HowItWorks,
  FeaturesAndBenefits,
  SocialProof,
  PricingPlans,
  FAQs,
  FinalCTA,
  Footer,
  Why,
  ChromeExtension,
} from "../components";

const HomePage = () => {
  return (
    <div className="mx-auto">
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="why">
        <Why />
      </div>
      <div id="how">
        <HowItWorks />
      </div>
      <div id="features">
      </div>
      <div id="social-proof">
      </div>
      <div id="how-it-works">
        <ChromeExtension />
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
