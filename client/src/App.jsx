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

function App() {
  const [announcement, setAnnouncement] = useState({
    message: "",
    visible: false,
  });

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/chintochau/Fusion-AI-Announcement/main/announcement.json"
    )
      .then((response) => response.json())
      .then((data) => setAnnouncement(data))
      .catch((error) => console.error("Error fetching announcement:", error));
  }, []);

  return (
    <>
      <div className="w-full">
        <ModelProvider>
          <VideoProvider>
            <SummaryProvider>
              <TranscriptProvider>
                <QuotaProvider>
                  <Routes>
                    <Route
                      path="/Summarizer"
                      element={
                        <div className="h-screen flex flex-col">
                          <Header />
                          <GeneralSummary />
                        </div>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <>
                          <Header />
                          <HomePage />
                        </>
                      }
                    />
                    <Route path="/share" element={<SharePage />} />
                    <Route path="/auth" element={<AuthCheckPage />}></Route>
                    <Route
                      path="/login"
                      element={
                        <div>
                          <Header />
                          <LoginPage />
                        </div>
                      }
                    />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/pricing"
                      element={
                        <div>
                          <Header />
                          <PricingPage />
                        </div>
                      }
                    />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
      </div>
    </>
  );
}

export default App;
