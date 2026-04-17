import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import AuthModal from "./components/AuthModal.jsx";   // ← new

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Auth modal state — lifted here so Navbar & Home can both open it
  const [authModal, setAuthModal] = useState(null); // null | "register" | "login"

  const openAuth  = (tab = "register") => setAuthModal(tab);
  const closeAuth = () => setAuthModal(null);

  return (
    <>
      {/* Pass openAuth so Navbar can put a Sign Up button */}
      <Navbar onOpenAuth={openAuth} />

      <Routes>
        <Route path="/"       element={<Home apiBaseUrl={API_BASE_URL} onOpenAuth={openAuth} />} />
        <Route path="/about"  element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global auth modal — rendered once, above everything */}
      {authModal && (
        <AuthModal
          apiBaseUrl={API_BASE_URL}
          defaultTab={authModal}
          onClose={closeAuth}
        />
      )}
    </>
  );
}

export default App;