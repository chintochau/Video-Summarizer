// transcription page to introduce transcription services

import { Footer } from "@/components";
import Header from "@/components/common/Header";
import { LinkToDashboard } from "@/components/common/RoutingLinks";
import SeeInAction from "@/components/home/SeeInAction";
import MarketingHero from "@/components/marketingComponents/MarketingHero";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const TranscriptionPage = () => {
    const {userId} = useAuth();
  return (
    <>
      <Helmet>
        <title>Transcription - Fusion AI</title>
      </Helmet>
      <Header/>
      <MarketingHero
        title="Fusion AI Transcription"
        description="Leading Accuracy and Speed transcription at lowest cost."
        button="Get your free transcript"
        path={userId ? "/console" : "/login"}
      />
      <Footer />
    </>
  );
};

export default TranscriptionPage;
