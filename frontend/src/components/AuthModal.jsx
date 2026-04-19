import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AuthModal({ apiBaseUrl, onClose, defaultTab = "register" }) {
  const [tab, setTab] = useState(defaultTab);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const setField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setError("");
    setSuccess(false);
    setLoginSuccess(null);
    setForm({ firstName: "", lastName: "", email: "", password: "" });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${apiBaseUrl}/api/register`, form);
      setSuccess(true);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiBaseUrl}/api/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLoginSuccess(response.data.user);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmitRegister =
    form.firstName.trim() && form.email.trim() && form.password.trim() && !loading;
  const canSubmitLogin = form.email.trim() && form.password.trim() && !loading;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(event) => {
        if (event.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div className="surface-card auth-modal" role="dialog" aria-modal="true" aria-label="Authentication">
        <div className="auth-modal-header">
          <div className="auth-modal-title">
            <img className="modal-mark modal-mark-image" src="/logo-mark.svg" alt="Idea Validator logo" />
            <div>
              <h3>{tab === "register" ? "Create your workspace" : "Welcome back"}</h3>
              <p className="modal-subtitle">
                {tab === "register"
                  ? "Save ideas, compare scores, and build with a cleaner founder workflow."
                  : "Sign in to continue reviewing your startup ideas."}
              </p>
            </div>
          </div>

          <button type="button" className="soft-button modal-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="tab-row" style={{ marginTop: "22px" }}>
          <button
            type="button"
            className={tab === "register" ? "tab active" : "tab"}
            onClick={() => switchTab("register")}
          >
            Register
          </button>
          <button
            type="button"
            className={tab === "login" ? "tab active" : "tab"}
            onClick={() => switchTab("login")}
          >
            Login
          </button>
        </div>

        {tab === "register" && success ? (
          <div className="success-shell animate-in">
            <div className="success-badge" aria-hidden="true">
              + 
            </div>
            <div>
              <h3>Account created</h3>
              <p className="modal-subtitle">
                Welcome, {form.firstName}. Your workspace is ready for idea validation.
              </p>
            </div>
            <button type="button" className="primary-button" onClick={onClose}>
              Start validating
            </button>
          </div>
        ) : null}

        {tab === "login" && loginSuccess ? (
          <div className="success-shell animate-in">
            <div className="success-badge" aria-hidden="true">
              OK
            </div>
            <div>
              <h3>Signed in</h3>
              <p className="modal-subtitle">
                You are back in as {loginSuccess.firstName}. Pick up where you left off.
              </p>
            </div>
            <button type="button" className="primary-button" onClick={onClose}>
              Continue
            </button>
          </div>
        ) : null}

        {tab === "register" && !success ? (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-form-grid">
              <div>
                <label htmlFor="register-first-name">First Name</label>
                <input
                  id="register-first-name"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={setField}
                  placeholder="Aarav"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="register-last-name">Last Name</label>
                <input
                  id="register-last-name"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={setField}
                  placeholder="Sharma"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={setField}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={form.password}
                onChange={setField}
                placeholder="Use a strong password"
                autoComplete="new-password"
              />
              <p className="helper-text">
                Aim for at least 8 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            {error ? <p className="error-message">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={!canSubmitRegister}>
              {loading ? <span className="spinner" aria-hidden="true" /> : null}
              Create account
            </button>

            <p className="auth-footer">
              Already have an account?
              <button type="button" className="soft-button switch-link" onClick={() => switchTab("login")}>
                Log in
              </button>
            </p>
          </form>
        ) : null}

        {tab === "login" && !loginSuccess ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={setField}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={setField}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </div>

            {error ? <p className="error-message">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={!canSubmitLogin}>
              {loading ? <span className="spinner" aria-hidden="true" /> : null}
              Sign in
            </button>

            <p className="auth-footer">
              New here?
              <button
                type="button"
                className="soft-button switch-link"
                onClick={() => switchTab("register")}
              >
                Create account
              </button>
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
}
