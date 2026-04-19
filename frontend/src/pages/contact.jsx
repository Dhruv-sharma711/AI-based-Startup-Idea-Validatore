import { useMemo, useState } from "react";

const contactTopics = [
  {
    icon: "FR",
    title: "Feature requests",
    description: "Share what would make the validator more useful for real founders and operators.",
  },
  {
    icon: "BG",
    title: "Bug reports",
    description: "If something looks off in the UI or flow, send the exact issue and how to reproduce it.",
  },
  {
    icon: "CO",
    title: "Collaborations",
    description: "Reach out if you want to extend the validator, test it with users, or partner on improvements.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const supportEmail = "support@ideavalidator.app";

  const canSubmit = useMemo(
    () => form.name.trim() && form.email.trim() && form.message.trim(),
    [form]
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const subject = encodeURIComponent("Startup Idea Validator - Contact");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n`
    );

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="app-page app-frame">
      <section className="surface-card page-hero animate-in">
        <div className="page-hero-copy">
          <div className="eyebrow">Contact</div>
          <h1>Send feedback that helps the validator feel sharper and more trustworthy.</h1>
          <p>
            Feature ideas, design polish, bug reports, and founder workflow suggestions are all useful here.
            The contact experience should feel as polished as the product itself.
          </p>
        </div>
      </section>

      <section className="surface-card page-section animate-in">
        <div className="contact-layout">
          <form className="contact-form-shell" onSubmit={handleSubmit}>
            <div className="section-tag">Send a message</div>

            <div className="form-grid">
              <div>
                <label htmlFor="contact-name">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Dhruv Sharma"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="dhruv@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={7}
                value={form.message}
                onChange={updateField}
                placeholder="Tell us what should be improved, fixed, or expanded."
                required
              />
            </div>

            <div className="dock-actions">
              <button type="submit" className="primary-button" disabled={!canSubmit}>
                Send message
              </button>
              <p className="form-note">
                {submitted
                  ? `If your email app did not open, send your note directly to ${supportEmail}.`
                  : `This opens your default email client and drafts a message to ${supportEmail}.`}
              </p>
            </div>
          </form>

          <div className="contact-side">
            {contactTopics.map((item) => (
              <article key={item.title} className="contact-mini">
                <div className="icon-chip" aria-hidden="true">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
