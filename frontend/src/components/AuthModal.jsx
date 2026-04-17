import { useEffect, useRef, useState } from "react";
import axios from "axios";

/* ─── inline styles — cream / burgundy / tan heritage theme ── */
const S = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 900,
    background: "rgba(26,8,16,0.55)",
    backdropFilter: "blur(12px) saturate(1.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px",
    animation: "fadeIn 0.22s ease both",
  },
  box: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-tan)",
    borderRadius: "var(--r16)",
    width: "100%", maxWidth: "420px",
    boxShadow: "0 32px 80px rgba(139,26,42,0.22), 0 1px 0 rgba(255,255,255,0.9) inset",
    animation: "fadeUp 0.3s cubic-bezier(0.4,0,0.2,1) both",
    overflow: "hidden",
    position: "relative",
  },
  boxAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: "3px",
    background: "linear-gradient(90deg, var(--red), var(--tan), transparent)",
    pointerEvents: "none",
  },
  header: {
    padding: "22px 24px 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  mark: {
    width: 40, height: 40,
    background: "linear-gradient(135deg, var(--red), var(--red-dark))",
    border: "1.5px solid rgba(154,122,56,0.4)",
    borderRadius: "var(--r8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-head)",
    fontSize: 12, color: "#F5E8A0", letterSpacing: "1px",
    flexShrink: 0,
    boxShadow: "0 2px 12px rgba(139,26,42,0.30)",
  },
  closeBtn: {
    background: "transparent", border: "none",
    color: "var(--text-3)", fontSize: 16, cursor: "pointer",
    padding: "4px 8px", borderRadius: "var(--r4)",
    lineHeight: 1, transition: "color 0.15s",
    marginTop: -2,
  },
  tabs: {
    display: "flex", gap: 4,
    padding: "18px 24px 0",
  },
  body: {
    padding: "20px 24px 28px",
  },
  inputWrap: {
    marginBottom: 14,
  },
  lbl: {
    display: "block",
    fontFamily: "var(--font-head)",
    fontSize: 9, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "2px",
    color: "var(--tan-dark)",
    marginBottom: 6,
  },
  row: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    background: "linear-gradient(90deg, transparent, var(--border-tan), transparent)",
    margin: "18px 0 16px"
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 12, color: "var(--text-3)",
    fontStyle: "italic",
  },
  switchBtn: {
    background: "transparent", border: "none",
    color: "var(--red)", fontFamily: "var(--font-head)",
    fontSize: 10, cursor: "pointer", letterSpacing: "1px",
    textTransform: "uppercase",
    padding: 0, textDecoration: "underline",
  },
  success: {
    display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center",
    padding: "8px 0 12px",
    gap: 14,
  },
  successIcon: {
    width: 60, height: 60,
    background: "var(--red-muted)", border: "1.5px solid rgba(139,26,42,0.22)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 26,
  },
};

export default function AuthModal({ apiBaseUrl, onClose, defaultTab = "register" }) {
  const [tab, setTab] = useState(defaultTab);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setError("");
  };

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setSuccess(false);
    setLoginSuccess(null);
    setForm({ firstName: "", lastName: "", email: "", password: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true); setError("");
    try {
      await axios.post(`${apiBaseUrl}/api/register`, form);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${apiBaseUrl}/api/login`, {
        email: form.email, password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoginSuccess(res.data.user);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  const canSubmitRegister = form.firstName.trim() && form.email.trim() && form.password.trim() && !loading;
  const canSubmitLogin = form.email.trim() && form.password.trim() && !loading;

  return (
    <div style={S.overlay} ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div style={S.box} role="dialog" aria-modal="true" aria-label="Authentication">
        {/* Top accent bar */}
        <div style={S.boxAccent} />

        {/* Header */}
        <div style={S.header}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={S.mark}>IV</div>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 14, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--red-dark)" }}>
                {tab === "register" ? "Create Account" : "Welcome Back"}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontStyle: "italic", color: "var(--text-3)", marginTop: 2 }}>
                {tab === "register" ? "Join Idea Validator" : "Sign in to your account"}
              </div>
            </div>
          </div>
          <button style={S.closeBtn} onClick={onClose} aria-label="Close"
            onMouseEnter={e => e.target.style.color = "var(--red)"}
            onMouseLeave={e => e.target.style.color = "var(--text-3)"}
          >✕</button>
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {["register", "login"].map(t => (
            <button
              key={t}
              className={t === tab ? "tab active" : "tab"}
              onClick={() => switchTab(t)}
            >
              {t === "register" ? "Register" : "Login"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={S.body}>

          {/* ── REGISTER TAB ── */}
          {tab === "register" && (
            success ? (
              <div style={S.success} className="animate-in">
                <div style={S.successIcon}>🎉</div>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 15, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red-dark)", marginBottom: 8 }}>
                    You're registered!
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.7 }}>
                    Welcome, <strong style={{ color: "var(--red)", fontStyle: "normal" }}>{form.firstName}</strong>. Start validating your startup ideas below.
                  </div>
                </div>
                <button className="primary-button" onClick={onClose} style={{ fontSize: 10, padding: "11px 26px" }}>
                  Start Validating →
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <div style={S.row}>
                  <div>
                    <label style={S.lbl} htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName" name="firstName" type="text"
                      value={form.firstName} onChange={handleChange}
                      placeholder="e.g. Arjun" autoComplete="given-name"
                      style={{ marginTop: 0 }}
                    />
                  </div>
                  <div>
                    <label style={S.lbl} htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName" name="lastName" type="text"
                      value={form.lastName} onChange={handleChange}
                      placeholder="e.g. Sharma" autoComplete="family-name"
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </div>

                <div style={S.inputWrap}>
                  <label style={S.lbl} htmlFor="email">Email *</label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                    style={{ marginTop: 0 }}
                  />
                </div>

                <div style={S.inputWrap}>
                  <label style={S.lbl} htmlFor="password">Password *</label>
                  <input
                    id="password" name="password" type="password"
                    value={form.password} onChange={handleChange}
                    placeholder="8+ chars, upper, lower, number, symbol"
                    autoComplete="new-password"
                    style={{ marginTop: 0 }}
                  />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontStyle: "italic", color: "var(--text-4)", marginTop: 5, lineHeight: 1.5 }}>
                    Must include uppercase, lowercase, number &amp; special character.
                  </div>
                </div>

                {error && <p className="error" style={{ marginTop: 0, marginBottom: 14 }}>{error}</p>}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!canSubmitRegister}
                  style={{ width: "100%", justifyContent: "center", fontSize: 10, padding: "13px", letterSpacing: "2.5px" }}
                >
                  {loading ? <Spinner /> : "Create Account →"}
                </button>

                <div style={S.footer}>
                  Already have an account?{" "}
                  <button style={S.switchBtn} type="button" onClick={() => switchTab("login")}>
                    Log in
                  </button>
                </div>
              </form>
            )
          )}

          {/* ── LOGIN TAB ── */}
          {tab === "login" && (
            loginSuccess ? (
              <div style={S.success} className="animate-in">
                <div style={S.successIcon}>👋</div>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 15, letterSpacing: "2px", textTransform: "uppercase", color: "var(--red-dark)", marginBottom: 8 }}>
                    Welcome back!
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "var(--text-2)", lineHeight: 1.7 }}>
                    Logged in as <strong style={{ color: "var(--red)", fontStyle: "normal" }}>{loginSuccess.firstName}</strong>. Ready to validate ideas?
                  </div>
                </div>
                <button className="primary-button" onClick={onClose} style={{ fontSize: 10, padding: "11px 26px" }}>
                  Let's Go →
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <div style={S.inputWrap}>
                  <label style={S.lbl} htmlFor="login-email">Email *</label>
                  <input
                    id="login-email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                    style={{ marginTop: 0 }}
                  />
                </div>

                <div style={S.inputWrap}>
                  <label style={S.lbl} htmlFor="login-password">Password *</label>
                  <input
                    id="login-password" name="password" type="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Your password"
                    autoComplete="current-password"
                    style={{ marginTop: 0 }}
                  />
                </div>

                {error && <p className="error" style={{ marginTop: 0, marginBottom: 14 }}>{error}</p>}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!canSubmitLogin}
                  style={{ width: "100%", justifyContent: "center", fontSize: 10, padding: "13px", letterSpacing: "2.5px" }}
                >
                  {loading ? <Spinner /> : "Sign In →"}
                </button>

                <div style={S.footer}>
                  New here?{" "}
                  <button style={S.switchBtn} type="button" onClick={() => switchTab("register")}>
                    Create an account
                  </button>
                </div>
              </form>
            )
          )}

        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 13, height: 13,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#FAF7F0",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.75s linear infinite",
    }} />
  );
}