import Header from "./components/common/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Route, Router, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import { ModelProvider } from "./contexts/ModelContext.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import { VideoProvider } from "./contexts/VideoContext.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import { TranscriptProvider } from "./contexts/TranscriptContext.jsx";
import YoutubeSummary from "./components/SummarizerPage/YoutubeSummary.jsx";
import { SummaryProvider } from "./contexts/SummaryContext.jsx";
import GeneralSummary from "./components/SummarizerPage/GeneralSummary.jsx";
import { QuotaProvider } from "./contexts/QuotaContext.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AuthCheckPage from "./pages/AuthCheckPage.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import SharePage from "./pages/SharePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";
import TranscriptionPage from "./pages/marketing/TranscriptionPage.jsx";
import SummarizationPage from "./pages/marketing/SummarizationPage.jsx";
import i18n from "./translations/i18n.js";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <ModelProvider>
        <VideoProvider>
          <SummaryProvider>
            <TranscriptProvider>
              <QuotaProvider>
                <ThemeProvider>
                  <Routes>
                    <Route path="/:lang" element={<LocalizedApp />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/Summarizer" element={<GeneralSummary />} />
                    <Route path="/share" element={<SharePage />}>
                      <Route path="" element={<div />} />
                      <Route path=":id" element={<div />} />
                    </Route>
                    <Route path="/summary" element={<SharePage />}>
                      <Route path="" element={<div />} />
                      <Route path=":id" element={<div />} />
                    </Route>
                    <Route path="/auth" element={<AuthCheckPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route
                      path="/transcription"
                      element={<TranscriptionPage />}
                    />
                    <Route
                      path="/summarization"
                      element={<SummarizationPage />}
                    />
                    <Route path="/console/*" element={<Dashboard />}>
                      <Route path="" element={<div />} />
                      <Route path="youtube" element={<YoutubeSummary />} />
                      <Route path="upload" element={<div />} />
                      <Route path="billing" element={<div />} />
                      <Route path="history" element={<HistoryPage />} />
                      <Route path="profile" element={<UserProfilePage />} />
                      <Route path="rag" element={<SearchPage />} />
                    </Route>
                  </Routes>
                </ThemeProvider>
              </QuotaProvider>
            </TranscriptProvider>
          </SummaryProvider>
        </VideoProvider>
      </ModelProvider>
      <Toaster />
    </>
  );
}

const LocalizedApp = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const hrefLangTags = [
    { href: "https://fusionaivideo.io", hreflang: "x-default" },
    { href: "https://fusionaivideo.io/en", hreflang: "en" },
    { href: "https://fusionaivideo.io/zh", hreflang: "zh" },
  ];

  return (
    <>
      <Helmet>
        {hrefLangTags.map((tag) => (
          <link
            key={tag.hreflang}
            rel="alternate"
            href={tag.href}
            hreflang={tag.hreflang}
          />
        ))}
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
};

export default App;
