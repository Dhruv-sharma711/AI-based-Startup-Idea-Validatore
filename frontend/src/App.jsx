import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Home from "./pages/home.jsx";
import AuthModal from "./components/AuthModal.jsx";

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [authModal, setAuthModal] = useState(null);

  const openAuth = (tab = "register") => setAuthModal(tab);
  const closeAuth = () => setAuthModal(null);

  return (
    <div className="app-frame">
      <Navbar onOpenAuth={openAuth} />

      <Routes>
        <Route
          path="/"
          element={<Home apiBaseUrl={apiBaseUrl} onOpenAuth={openAuth} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {authModal ? (
        <AuthModal apiBaseUrl={apiBaseUrl} defaultTab={authModal} onClose={closeAuth} />
      ) : null}
    </div>
  );
}

export default App;
