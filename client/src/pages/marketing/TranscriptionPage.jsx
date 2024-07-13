// transcription page to introduce transcription services

import { Footer } from "@/components";
import Header from "@/components/common/Header";
import { LinkToDashboard } from "@/components/common/RoutingLinks";
import SeeInAction from "@/components/home/SeeInAction";
import MarketingBlock from "@/components/marketingComponents/MarketingBlock";
import MarketingHero from "@/components/marketingComponents/MarketingHero";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import speakerLabel from "@/assets/speaker-labels.png";
import multipleFile from "@/assets/multiple-file.png";
import multipleOptions from "@/assets/multiple-options.png";
import multipleLanguges from "@/assets/multiple-languages.png";
import { fusionaiLink } from "@/constants";

const TranscriptionPage = () => {
  const { userId } = useAuth();
  return (
    <>
      <Helmet>
        <title>Free Video and Audio Transcription | Fusion AI</title>
        <meta
          name="description"
          content="Transcribe videos and audio files with high accuracy and speed. Get your free transcript."
        />
        <meta
          name="keywords"
          content="video transcription, audio transcription, high accuracy, high speed, free transcript"
        />
        <link rel="canonical" href={`${fusionaiLink}/transcription`} />
        <meta property="og:title" content="Free Video and Audio Transcription" />
        <meta
          property="og:description"
          content="Transcribe videos and audio files with high accuracy and speed. Get your free transcript."
        />
        <meta property="og:url" content={`${fusionaiLink}/transcription`} />
        <meta property="og:image" content={`${fusionaiLink}/fusionai-logo.png`} />
        <meta property="og:image:alt" content="Fusion AI logo" />
      </Helmet>
      <Header />
      <MarketingHero
        className="py-20 xl:py-40"
        title="Fusion AI Transcription"
        description="Leading Accuracy and Speed transcription at lowest cost."
        button="Get your free transcript"
        path={userId ? "/console" : "/login"}
      />
      <video
        autoPlay
        muted
        loop
        className="w-full md:container pb-20"
        alt="Transcription Demo video"
      >
        <source
          src="https://fusionaiwebcdn.s3.us-east-2.amazonaws.com/transcriptiondemo.mp4"
          type="video/mp4"
        />
      </video>

      <MarketingBlock
        left={
          <>
            {" "}
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4 mt-4">
              Video and Audio Transcription
            </h2>
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              Transcribe videos and audio files with high accuracy and speed.
            </p>
          </>
        }
        right={
          <div className="flex justify-center items-center">
            <img className=" max-h-[580px]" src={multipleFile}></img>
          </div>
        }
      />
      <MarketingBlock
        left={
          <>
            <img className=" max-h-[600px]" src={speakerLabel}></img>
          </>
        }
        right={
          <>
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4 mt-4">
              Identify Speakers
            </h2>{" "}
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              Identify who is speaking with high accuracy AI Detection.
            </p>
          </>
        }
      />
      <MarketingBlock
        left={
          <>
            {" "}
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4 mt-4">
              Transcribe Options on your needs
            </h2>{" "}
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              Balance accuracy and speed with multiple options.
            </p>
          </>
        }
        right={
          <>
            <div className="flex justify-center items-center ">
              <img className=" max-h-[600px]" src={multipleOptions}></img>
            </div>
          </>
        }
      />
      <MarketingBlock
        right={
          <>
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4 mt-4">
              Transcribe Audio in 10+ Languages
            </h2>
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              We support: English, Chinese, Japanese, Spanish, French, Russian,
              German, Portuguese, Korean, Italian and more.
            </p>
          </>
        }
        left={
          <>
            <div className="flex justify-center items-center">
              <img className=" max-h-[600px]" src={multipleLanguges}></img>
            </div>
          </>
        }
      />

      <MarketingHero
        className="py-20 xl:py-40"
        title="Get started for free"
        description="Our free plan shows you what Fusion AI can do — no credit card required. "
        button="Get your free transcript"
        path={userId ? "/console" : "/login"}
      />

      <Footer />
    </>
  );
};

export default TranscriptionPage;
