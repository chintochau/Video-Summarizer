import { whyContents } from "@/constants";
import React from "react";
import * as images from "@/assets";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

const Why = () => {
  const { t } = useTranslation();
  const reasons = t("whyContents.why", { returnObjects: true });

  return (
    <div className=" xl:bg-indigo-50 xl:py-20 xl:px-4">
      <div className="container bg-white/60 rounded-3xl py-4 md:py-20">
        <h2 className="text-4xl font-bold text-left sm:text-center sm:pb-8 text-cyan-700/70 ">
          {t("whyContents.headline")}
        </h2>
        <Separator className="mt-10 md:my-2" />
        <div className="md:flex-row md:flex gap-x-8 ">
          {reasons.map((feature, index) => {
            const imgSrc = images[feature.image];
            return (
              <div
                className="flex flex-col justify-start md:items-center md:text-center  "
                key={index}
              >
                <h3 className="mt-4 md:hidden text-2xl md:text-3xl font-bold text-cyan-500">
                  {feature.subheader}
                </h3>
                <img
                  src={imgSrc}
                  alt={feature.subheader}
                  className=" object-cover w-full md:w-96 lg:w-full lg:px-8 aspect-[4/3]"
                />
                <h3 className="hidden md:block text-xl md:text-3xl font-bold text-cyan-500">
                  {feature.subheader}
                </h3>
                <p className="text-sm md:text-lg text-gray-600 mt-4 max-w-2xl text-left font-roboto md:text-justify">
                  {feature.description}
                </p>
                <Separator className="my-2 md:hidden" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Why;
