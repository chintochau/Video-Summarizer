import Header from "./components/common/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Route, Router, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
        <ModelProvider>
          <VideoProvider>
            <SummaryProvider>
              <TranscriptProvider>
                <QuotaProvider>
                  <Routes>
                    <Route path="/Summarizer" element={<GeneralSummary />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/share" element={<SharePage />} />
                    <Route path="/auth" element={<AuthCheckPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/about" element={<AboutPage />} />
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
                </QuotaProvider>
              </TranscriptProvider>
            </SummaryProvider>
          </VideoProvider>
        </ModelProvider>
        <Toaster />
    </>
  );
}

export default App;
