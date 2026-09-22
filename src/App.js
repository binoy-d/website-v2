import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/buttons.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ReactBreakpoints from "react-breakpoints";
import ContactButtons from "./components/ContactButtons/ContactButtons";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Nav/NavBar";
import HomePage from "./pages/HomePage";
import HighlightsPage from "./pages/HighlightsPage";
import { ContentProvider } from "./content/ContentContext";
import { applyTheme } from "./theme";

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
};

function App() {
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <div id="app-root">
      <ReactBreakpoints breakpoints={breakpoints}>
        <ContentProvider>
          <NavBar />
          <ContactButtons />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/highlights" element={<HighlightsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </ContentProvider>
      </ReactBreakpoints>
    </div>
  );
}

export default App;
