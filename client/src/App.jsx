import Header from "./components/common/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import SummarizePage from "./pages/SummarizePage.jsx";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import { ModelProvider } from "./contexts/ModelContext.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotificationOverlay from "./components/NotificationOverlay.jsx";
import { VideoProvider } from "./contexts/VideoContext.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Summarizer from "./components/Summarizer.jsx";
import { TranscriptProvider } from "./contexts/TranscriptContext.jsx";
import YoutubeSummary from "./components/SummarizerPage/YoutubeSummary.jsx";
import ConsoleHome from "./components/SummarizerPage/ConsoleHome.jsx";
import { SummaryProvider } from "./contexts/SummaryContext.jsx";
import GeneralSummary from "./components/SummarizerPage/GeneralSummary.jsx";

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
      <div className="relative">
        {/* {announcement.visible && (
          <div className=" bg-indigo-50 flex text-center">
            <div className="mx-auto max-w-[1280px] w-[1280] text-gray-600">
              {announcement.message}
            </div>
          </div>
        )} */}
        <div className="w-full">
          <ModelProvider>
            <VideoProvider>
              <SummaryProvider>
              <TranscriptProvider>

                <Routes>
                  <Route path="/Summarizer" element={<div className="h-screen flex flex-col"><Header/><GeneralSummary /></div>} />
                  <Route path="/" element={<div>
                    <Header />
                    <HomePage />
                  </div>
                  } />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/pricing" element={<div><Header/><PricingPage /></div>} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/console/*" element={<Dashboard />} >
                    <Route path='' element={<ConsoleHome />}/>
                    <Route path='youtube' element={<YoutubeSummary />}/>
                    <Route path='upload' element={<Summarizer />} />
                    <Route path='billing' element={<div>billing</div>}/>
                    <Route path='history' element={<HistoryPage />}/>
                    <Route path='profile' element={<UserProfilePage />}/>
                  </Route>
                </Routes>
              </TranscriptProvider>
              </SummaryProvider>
            </VideoProvider>
            <NotificationOverlay />
          </ModelProvider>
        </div>
      </div>
    </>
  );
}

export default App;
