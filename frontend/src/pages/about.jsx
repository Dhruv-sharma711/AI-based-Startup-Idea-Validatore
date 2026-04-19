const featureCards = [
  {
    icon: "01",
    title: "Clear scoring",
    description: "Each idea gets an overall score plus context around market potential, uniqueness, and risk.",
  },
  {
    icon: "02",
    title: "Founder-ready feedback",
    description: "The output focuses on what to sharpen next, not just whether the idea sounds exciting.",
  },
  {
    icon: "03",
    title: "Practical next moves",
    description: "Recommendations are aimed at MVP scoping, validation sequencing, and positioning clarity.",
  },
];

const workflowCards = [
  {
    title: "Write the brief",
    description: "Describe who the product serves, what pain exists, and why the moment matters now.",
  },
  {
    title: "Review the score",
    description: "Use the structured output to spot whether the idea is muddy, risky, or surprisingly strong.",
  },
  {
    title: "Validate in the market",
    description: "Take the AI output into real interviews, landing-page tests, and pricing conversations.",
  },
];

export default function About() {
  return (
    <div className="app-page app-frame">
      <section className="surface-card page-hero animate-in">
        <div className="page-hero-copy">
          <div className="eyebrow">About the platform</div>
          <h1>Built to make startup ideas easier to challenge before they get expensive.</h1>
          <p>
            AI Based Startup Idea Validator gives founders a more disciplined first pass on concept quality.
            It is designed to feel credible, fast, and useful when you are narrowing an idea or deciding
            what to test next.
          </p>
        </div>
      </section>

      <section className="surface-card page-section animate-in">
        <div className="section-tag">What it does</div>
        <div className="feature-grid">
          {featureCards.map((item) => (
            <article key={item.title} className="feature-card">
              <div className="icon-chip" aria-hidden="true">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card page-section animate-in">
        <div className="section-tag">How to use it well</div>
        <div className="feature-grid">
          {workflowCards.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
