import Header from "@/components/common/Header";
import { aboutPageContents, fusionaiLink } from "@/constants";
import React from "react";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>{aboutPageContents.title}</title>
        <meta name="title" content={aboutPageContents.title} />
        <meta name="description" content={aboutPageContents.seoDescription} />
        <meta name="og:title" content={aboutPageContents.title} />
        <meta
          name="og:description"
          content={aboutPageContents.seoDescription}
        />
        <meta name="og:url" content={aboutPageContents.url} />
        <meta name="og:type" content={aboutPageContents.type} />
        <meta name="og:image" content={aboutPageContents.image} />
        <link rel="canonical" href={`${fusionaiLink}/about`} />
      </Helmet>
      <Header title="About" />
      <div className="container text-left">
        <div id="about-section">
          <h1
            className="text-4xl font-bold text-gray-800 dark:text-gray-100"
            style={{ marginTop: "3rem" }}
          >
            {aboutPageContents.title}
          </h1>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ marginTop: "1rem" }}
          >
            {aboutPageContents.description}
          </p>
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-100"
            style={{ marginTop: "3rem" }}
          >
            {aboutPageContents.introduction.headline}
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ marginTop: "1rem" }}
          >
            {aboutPageContents.introduction.description}
          </p>
        </div>
        <div id="story">
          <h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-100"
            style={{ marginTop: "3rem" }}
          >
            {aboutPageContents.story.headline}
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ marginTop: "1rem" }}
          >
            {aboutPageContents.story.description}
          </p>
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-100"
            style={{ marginTop: "3rem" }}
          >
            {aboutPageContents.technology.headline}
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ marginTop: "1rem" }}
          >
            {aboutPageContents.technology.description}
          </p>
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-100"
            style={{ marginTop: "3rem" }}
          >
            {aboutPageContents.team.headline}
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-300"
            style={{ marginTop: "1rem" }}
          >
            {aboutPageContents.team.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
