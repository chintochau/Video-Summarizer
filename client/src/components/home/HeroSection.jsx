import React from "react";
import { Button } from "../ui/button";
import { Container } from "../common/Container";
import { HashLink } from "react-router-hash-link";
import chromeIcon from "../../assets/chrome-icon.png";
import { chromeStoreLink } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { LinkToDashboard } from "../common/RoutingLinks";
import { useTranslation, Trans } from "react-i18next";

const HeroSection = () => {
  const lngs = {
    en: { nativeName: "English" },
    fr: { nativeName: "Français" },
    zh: { nativeName: "繁體中文" },
  };

  const { t } = useTranslation();

  const openChromeExtension = () => {
    window.open(chromeStoreLink);
  };

  const { currentUser } = useAuth();

  return (
    <div className="w-full bg-gray-900">
      <Container className="pt-16 pb-10 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl text-5xl font-display font-medium tracking-tight text-gray-100 sm:text-7xl">
          <Trans i18nKey="hero.headline1">
            Understand any
            <span className="relative whitespace-nowrap text-cyan-500">
              Long Videos
            </span>
            <br />
          </Trans>
          <p className="pt-2">{t("hero.headline2")}</p>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg  text-gray-200 font-normal font-roboto">
          {t("hero.description")}
        </p>

        <Button
          href="/register"
          size="lg"
          className="text-xl my-16 px-4 bg-gradient-to-tl from-indigo-800 to-cyan-500 hover:from-indigo-700 hover:to-cyan-200
        "
        >
          <LinkToDashboard>
            {currentUser ? t("hero.cta1") : t("hero.cta2")}
          </LinkToDashboard>
        </Button>

        <p
          id="chrome-extension"
          className="text-lg text-slate-200 font-normal font-roboto pt-10"
        >
          {t("hero.ctaChrome")}
        </p>

        <div className="mt-2 flex justify-center gap-x-6">
          <Button
            onClick={openChromeExtension}
            className=" bg-cyan-500/70 hover:bg-cyan-800"
          >
            <img
              src={chromeIcon}
              alt="Chrome Extension Icon"
              className="w-6 h-6 mr-2"
            />
            {t("hero.chromeStore")}
          </Button>
          <HashLink to="/#how-it-works">
            <Button variant="outline">
              <svg
                aria-hidden="true"
                className="h-3 w-3 flex-none fill-cyan-800 group-active:fill-current mr-2"
              >
                <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
              </svg>
            {t("hero.howItWorks")}
            </Button>
          </HashLink>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
