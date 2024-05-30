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
import SeeInAction from "@/components/home/SeeInAction";
import Header from "@/components/common/Header";

const HomePage = () => {
  return (
    <div className="mx-auto">
      <Header />
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="inAction">
        <SeeInAction/>
      </div>
      <div id="why">
        <Why />
      </div>
      <div id="features">
        <HowItWorks />
      </div>
      <div id="pricing">
        <PricingPlans home />
      </div>
      <div id="how-it-works">
        <ChromeExtension />
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
