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
import { ReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";

const MeetingPage = () => {
  const { userId } = useAuth();

  return (

  <div>
    <Header/>
  <ReactMediaRecorder
    screen
    audio
    render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
      <div className="flex flex-col container">
        <p className=" mx-auto">Status {status}</p>
        <div className="flex mx-auto">
          <Button onClick={startRecording}>Start Recording</Button>
          <Button onClick={stopRecording}>Stop Recording</Button>
        </div>
        <video src={mediaBlobUrl} controls autoPlay loop />
      </div>
    )}
  />
</div>
  )
  return (
    <>
      <Helmet></Helmet>
      <Header />
      <MarketingHero
        className="py-20 xl:py-40"
        title=" Meetings Notes"
        description=" Jot down your meetings for you."
        button=" Start Now"
        path={userId ? "/console" : "/login"}
      />

      <MarketingBlock
        left={
          <>
            <h2 className="md:text-4xl text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 md:mb-4">
              Record Your Meeting
            </h2>
            <p className="md:text-xl text-base text-gray-600 dark:text-gray-300 font-light">
              Record your live meeting with just one click.
            </p>
          </>
        }
        right={
          <div className="flex justify-center items-center">
            <img className=" max-h-[480px] mx-auto" src={""}></img>
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
              <img
                className=" max-h-[480px] mx-auto"
                src={multipleSummaryOptions}
              ></img>
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

export default MeetingPage;
