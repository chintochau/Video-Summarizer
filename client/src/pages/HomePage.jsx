import React from "react";
import {
  HeroSection,
  Features,
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
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://fusionaivideo.io" />
        <meta
          name="description"
          content="Fusion AI: Fast, accurate AI transcription and summarization for YouTube and personal videos."
        />
      </Helmet>
      <Header />
      <div id="hero-section">
        <HeroSection />
      </div>
      <div id="inAction">
        <SeeInAction />
      </div>
      <div id="why">
        <Why />
      </div>
      <div id="features">
        <Features />
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
    </>
  );
};

export default HomePage;
