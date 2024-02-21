import Header from "./Components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import Footer from "./Components/Footer.jsx";
import SummarizePage from "./pages/SummarizePage.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="relative ">
        <Header />
        <div className="w-full top-[73px] min-h-[calc(100vh-73px)]  ">
          <Routes>
            <Route path="/Summarizer" element={<SummarizePage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
