import { useMemo, useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(
    () => form.name.trim() && form.email.trim() && form.message.trim(),
    [form]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent("Startup Idea Validator — Contact");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n`
    );
    window.location.href = `mailto:${form.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="page-container animate-in">
      <div className="panel page-panel">
        <div className="section-tag">Contact</div>
        <h1 className="page-title">Let's improve your validator</h1>
        <div className="gold-line" />
        <p className="page-subtitle">
          Send feature requests, report bugs, or share ideas to make the reports
          more founder-friendly. We read every message.
        </p>

        <form className="contact-form" onSubmit={onSubmit}>
          <div className="two-column">
            <div>
              <label htmlFor="name">Your Name</label>
              <input
                id="name" name="name" value={form.name} onChange={onChange}
                placeholder="e.g. Dhruv Sharma" required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" name="email" value={form.email}
                onChange={onChange} placeholder="e.g. dhruv@example.com" required
              />
            </div>
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message" name="message" rows={6} value={form.message}
              onChange={onChange}
              placeholder="Tell us what you want to add or change..."
              required
            />
          </div>

          <div className="form-footer">
            <button className="primary-button" type="submit" disabled={!canSubmit}>
              Send Message →
            </button>
            <span className="contact-note">
              {submitted
                ? "If your email app didn't open, copy and send manually."
                : "Opens your email client via mailto."}
            </span>
          </div>
        </form>

        <div className="divider" />

        {/* Contact info row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "💡", label: "Feature Requests", desc: "Tell us what's missing." },
            { icon: "🐛", label: "Bug Reports", desc: "Found a glitch? Let us know." },
            { icon: "🤝", label: "Partnerships", desc: "Want to collaborate?" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                minWidth: 160,
                background: "var(--bg-card-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r12)",
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  letterSpacing: 1,
                  color: "var(--gold)",
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}