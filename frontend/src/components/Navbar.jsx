import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar({ onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="topbar">
      <div className="brand">
        <img className="brand-mark brand-mark-image" src="/logo-mark.svg" alt="Idea Validator logo" />
        <div className="brand-text">
          <strong>Idea Validator</strong>
          <span>Founder-grade startup feedback</span>
        </div>
      </div>

      <button
        type="button"
        className="soft-button menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      <div className={`nav-wrap ${menuOpen ? "open" : ""}`}>
        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button type="button" className="secondary-button" onClick={() => onOpenAuth("login")}>
            Login
          </button>
          <button type="button" className="primary-button" onClick={() => onOpenAuth("register")}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
