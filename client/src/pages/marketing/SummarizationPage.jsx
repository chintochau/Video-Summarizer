
import { Footer } from "@/components";
import Header from "@/components/common/Header";
import SeeInAction from "@/components/home/SeeInAction";
import MarketingBlock from "@/components/marketingComponents/MarketingBlock";
import MarketingHero from "@/components/marketingComponents/MarketingHero";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Helmet } from "react-helmet-async";
import multipleFile from "@/assets/multiple-file.png";
import multipleLanguges from "@/assets/multiple-languages.png";
import multipleLLM from "@/assets/multiple-llm.png";
import multipleSummaryOptions from "@/assets/multiple-summary-options.png";
import { fusionaiLink } from "@/constants";

const SummarizationPage = () => {
  const { userId } = useAuth();
  return (
    <>
      <Helmet>
        <title>Free Audio and Video Summarization | Fusion AI</title>
        <meta

          name="description"
          content="Summarize videos and audio files with high accuracy and speed. "
        />
        <meta
          name="keywords"
          content="video summarization, audio summarization, high accuracy, high speed, free summary"
        />
        <link rel="canonical" href={`${fusionaiLink}/summarization`} />
        <meta property="og:title" content="Free Audio and Video Summarization" />
        <meta
          property="og:description"
          content="Summarize videos and audio files with high accuracy and speed. "
        />
        
        <meta property="og:url" content={`${fusionaiLink}/summarization`} />
        <meta property="og:image" content={`${fusionaiLink}/fusionai-logo.png`} />
        <meta property="og:image:alt" content="Fusion AI logo" />
        <meta property="og:type" content="website" />

        <meta property="twitter:title" content="Free Audio and Video Summarization" />
        <meta
          property="twitter:description"
          content="Summarize videos and audio files with high accuracy and speed. "
        />
        <meta property="twitter:url" content={`${fusionaiLink}/summarization`} />
        <meta property="twitter:image" content={`${fusionaiLink}/fusionai-logo.png`} />
        <meta property="twitter:image:alt" content="Fusion AI logo" />
        <meta property="twitter:card" content="summary_large_image" />


      </Helmet>
      <Header />
      <MarketingHero
        className="py-20 xl:py-40"
        title="Video Summarization"
        description="Summarize videos and audio files with high accuracy and speed. "
        button="Get Free Summary Now"
        path={userId ? "/console" : "/login"}
      />
      
      <SeeInAction/>

      <MarketingBlock
        left={
          <>
            {" "}
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4">
              Video and Audio Summarization
            </h2>
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              Summarize videos and audio files with high accuracy and speed.
            </p>
          </>
        }
        right={
          <div className="flex justify-center items-center">
            <img className=" max-h-[480px] mx-auto" src={multipleFile}></img>
          </div>
        }
      />
      <MarketingBlock
        left={
          <>
            <img className=" max-h-[480px] mx-auto" src={multipleLLM}></img>
          </>
        }
        right={
          <>
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4">
              Multiple AI Models 
            </h2>{" "}
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              We support: GPT-4o, GPT-3.5, Claude 3, Claude 3.5 and more.
            </p>
          </>
        }
      />
      <MarketingBlock
        left={
          <>
            {" "}
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4">
              Various Summary Options
            </h2>{" "}
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              We provide multiple summary options on your needs. 
            </p>
          </>
        }
        right={
          <>
            <div className="flex justify-center items-center ">
              <img className=" max-h-[480px] mx-auto" src={multipleSummaryOptions}></img>
            </div>
          </>
        }
      />
      <MarketingBlock
        right={
          <>
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4">
              Summary in 10+ Languages
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
              <img className=" max-h-[480px]" src={multipleLanguges}></img>
            </div>
          </>
        }
      />

      <MarketingHero
        className="py-20 xl:py-40"
        title="Get started for free"
        description="Our free plan shows you what Fusion AI can do — no credit card required. "
        button="Get Free Summary Now"
        path={userId ? "/console" : "/login"}
      />

      <Footer />
    </>
  );
};

export default SummarizationPage;
