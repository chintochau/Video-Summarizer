import Header from "./Components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import Footer from "./Components/Footer.jsx";
import SummarizePage from "./pages/SummarizePage.jsx";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import { ModelProvider } from "./contexts/ModelContext.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import NotificationOverlay from "./Components/NotificationOverlay.jsx";

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

  const { currentUser } = useAuth();

  return (
    <>
      <div className="relative">
        {announcement.visible && (
          <div className=" bg-indigo-50 flex text-center">
            <div className="mx-auto max-w-[1280px] w-[1280] text-gray-600">
              {announcement.message}
            </div>
          </div>
        )}
        <Header />
        <div className="w-full top-[73px] min-h-[calc(100vh-73px)]  ">
          <ModelProvider>
            <Routes>
              <Route path="/Summarizer" element={<SummarizePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Routes>
            <NotificationOverlay />
          </ModelProvider>
        </div>
      </div>
    </>
  );
}

export default App;
