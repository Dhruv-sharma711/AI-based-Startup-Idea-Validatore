import { NavLink } from "react-router-dom";

export default function Navbar({ onOpenAuth }) {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">IV</div>
        <div className="brand-text">
          <strong>Idea Validator</strong>
          <span>AI · Founder Ready</span>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/about" className={linkClass}>About</NavLink>
        <NavLink to="/contact" className={linkClass}>Contact</NavLink>

        <button
          className="ghost-button"
          style={{ marginLeft: "12px", padding: "9px 20px" }}
          onClick={() => onOpenAuth("login")}
        >
          Login
        </button>

        <button
          className="primary-button"
          style={{ marginLeft: "6px", padding: "10px 22px", fontSize: "10px", letterSpacing: "2px" }}
          onClick={() => onOpenAuth("register")}
        >
          Sign Up
        </button>
      </nav>
    </header>
  );
}