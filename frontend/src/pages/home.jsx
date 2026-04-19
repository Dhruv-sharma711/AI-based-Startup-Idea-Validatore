import { useEffect, useRef, useState } from "react";
import axios from "axios";

const starterIdeas = [
  {
    title: "AI Watchman",
    description:
      "An AI-powered CCTV monitoring system that detects suspicious activity, accidents, unusual crowding, and animal intrusion around homes.",
    targetAudience: "Home owners, gated communities, and small offices",
    problemStatement:
      "People want 24/7 property monitoring without paying for full-time guards.",
  },
  {
    title: "Founder Copilot",
    description:
      "A startup planning assistant that helps first-time founders validate demand, define ICP, test pricing, and build MVP roadmaps.",
    targetAudience: "Solo founders and student entrepreneurs",
    problemStatement:
      "Early-stage founders struggle to convert raw ideas into focused execution plans.",
  },
  {
    title: "Clinic Queue AI",
    description:
      "A smart appointment and triage system for clinics that predicts wait times and suggests patient flow improvements.",
    targetAudience: "Small clinics and diagnostic centers",
    problemStatement:
      "Clinics lose patients because waiting times and operations are poorly managed.",
  },
];

const scoreLabels = [
  { limit: 39, label: "Early concept", color: "#d26b5d" },
  { limit: 64, label: "Promising", color: "#c58c44" },
  { limit: 84, label: "Strong opportunity", color: "#9c834a" },
  { limit: 100, label: "High potential", color: "#5d9b65" },
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "risks", label: "Risks" },
  { id: "strategy", label: "Strategy" },
];

const heroStats = [
  { value: "3 min", label: "Fast feedback", note: "Structured analysis without extra setup." },
  { value: "100", label: "Scored output", note: "Compare multiple ideas on the same scale." },
  { value: "VC lens", label: "Decision frame", note: "Highlights risk, traction, and differentiation." },
  { value: "Actionable", label: "Next moves", note: "Suggestions you can use before building." },
];

export default function Home({ apiBaseUrl, onOpenAuth }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAudience: "",
    problemStatement: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const threadRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/ideas`)
      .then((response) => setHistory(response.data || []))
      .catch(() => setHistory([]));
  }, [apiBaseUrl]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  }, [form.description]);

  useEffect(() => {
    if (result && threadRef.current) {
      threadRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const applyStarter = (idea) => {
    setForm(idea);
    setError("");
    setResult(null);
    setSubmitted(null);
  };

  const reset = () => {
    setForm({ title: "", description: "", targetAudience: "", problemStatement: "" });
    setLoading(false);
    setError("");
    setResult(null);
    setSubmitted(null);
    setShowAdvanced(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setActiveTab("overview");
    setSubmitted({ ...form });

    try {
      const response = await axios.post(`${apiBaseUrl}/api/ideas/validate`, form);
      setResult(response.data.validation);

      if (response.data.idea) {
        setHistory((current) => [response.data.idea, ...current].slice(0, 8));
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error ||
          requestError?.response?.data?.message ||
          "Could not validate your startup idea."
      );
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.title.trim() && form.description.trim() && !loading;
  const score = result?.overallScore ?? 0;
  const scoreMeta = scoreLabels.find((item) => score <= item.limit) ?? scoreLabels[3];

  const ListCard = ({ title, items }) => (
    <article className="insight-card">
      <div className="section-tag">{title}</div>
      <ul className="insight-list">
        {(items || []).map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </article>
  );

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <section className="surface-card sidebar-panel">
          <button type="button" className="primary-button new-idea-button" onClick={reset}>
            New idea
          </button>
          <p className="sidebar-note">
            Keep the brief sharp. The better the problem, audience, and timing, the stronger the read.
          </p>
        </section>

        <section className="surface-card sidebar-panel">
          <div className="sidebar-section">
            <div className="sidebar-title">Starter prompts</div>
            <div className="sidebar-stack">
              {starterIdeas.map((idea) => (
                <button
                  key={idea.title}
                  type="button"
                  className="prompt-card"
                  onClick={() => applyStarter(idea)}
                >
                  <strong>{idea.title}</strong>
                  <span>{idea.targetAudience}</span>
                  <p>{idea.problemStatement}</p>
                </button>
              ))}
            </div>
          </div>

          {history.length > 0 ? (
            <div className="sidebar-section">
              <div className="sidebar-title">Recent ideas</div>
              <div className="sidebar-stack">
                {history.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    className="history-card"
                    onClick={() => {
                      setForm({
                        title: item.title || "",
                        description: item.description || "",
                        targetAudience: item.targetAudience || "",
                        problemStatement: item.problemStatement || "",
                      });
                      setError("");
                      setResult(null);
                      setSubmitted(null);
                    }}
                  >
                    <div className="history-card-header">
                      <strong>{item.title}</strong>
                      {item.validation?.overallScore != null ? (
                        <span className="history-score">{item.validation.overallScore}</span>
                      ) : null}
                    </div>
                    <div className="history-meta">Saved brief</div>
                    <p>{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </aside>

      <main className="dashboard-main">
        <section className="surface-card">
          <div className="dashboard-hero">
            <div className="hero-copy">
              <div className="eyebrow">Investor-style startup review</div>
              <h1>Make your idea look serious before you ask the market to care.</h1>
              <p>
                Turn a rough startup concept into a founder-ready brief with scoring, risk framing,
                positioning, and practical next steps. The interface now reads like a real product,
                not a demo.
              </p>

              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => onOpenAuth("register")}>
                  Save your workspace
                </button>
                <button type="button" className="secondary-button" onClick={() => onOpenAuth("login")}>
                  Continue with account
                </button>
              </div>
            </div>

            <div className="hero-aside">
              {heroStats.map((item) => (
                <article key={item.label} className="stat-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-highlights">
            <article className="mini-panel">
              <div className="section-tag">What you get</div>
              <h3>Signal over fluff</h3>
              <p>Strengths, weaknesses, score, and risk summary in one focused output.</p>
            </article>
            <article className="mini-panel">
              <div className="section-tag">Best input</div>
              <h3>Describe the pain clearly</h3>
              <p>A clear customer and pain point usually improves the quality of the analysis fast.</p>
            </article>
            <article className="mini-panel">
              <div className="section-tag">Use it well</div>
              <h3>Validate beyond AI</h3>
              <p>The output should guide interviews, landing pages, and MVP scoping, not replace them.</p>
            </article>
          </div>
        </section>

        <section className="surface-card workspace-stage">
          <div className="thread-area" ref={threadRef}>
            {!submitted && !loading ? (
              <div className="empty-hero animate-in">
                <div className="empty-intro">
                  <div className="eyebrow">Start with a concise idea brief</div>
                  <h2>Paste the concept. We’ll pressure-test the business logic.</h2>
                  <p>
                    Include what you are building, who feels the pain, and why this should exist now.
                    The validator will return a score and a more grounded founder view.
                  </p>

                  <div className="intro-pills">
                    <div className="intro-pill">Market potential</div>
                    <div className="intro-pill">Risk signals</div>
                    <div className="intro-pill">Positioning</div>
                    <div className="intro-pill">Launch advice</div>
                  </div>
                </div>

                <div className="starter-showcase">
                  {starterIdeas.map((idea) => (
                    <button
                      key={idea.title}
                      type="button"
                      className="prompt-card"
                      onClick={() => applyStarter(idea)}
                    >
                      <strong>{idea.title}</strong>
                      <span>{idea.targetAudience}</span>
                      <p>{idea.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="workspace-thread animate-in">
                {submitted ? (
                  <div className="bubble-row">
                    <article className="idea-bubble">
                      <div className="section-tag">Submitted brief</div>
                      <h3>{submitted.title}</h3>
                      <p>{submitted.description}</p>
                      {submitted.targetAudience || submitted.problemStatement ? (
                        <div className="idea-meta">
                          {submitted.targetAudience ? <span>Audience: {submitted.targetAudience}</span> : null}
                          {submitted.problemStatement ? (
                            <span>Problem: {submitted.problemStatement}</span>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  </div>
                ) : null}

                {loading ? (
                  <div className="thinking-row">
                    <div className="thinking-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span>Running the idea through a founder and investor lens.</span>
                  </div>
                ) : null}

                {error ? <p className="error-message">{error}</p> : null}

                {result ? (
                  <div className="result-stack animate-in">
                    <section className="score-panel">
                      <div
                        className="score-ring"
                        style={{ "--score": `${score}%`, "--score-color": scoreMeta.color }}
                      >
                        <div className="score-ring-inner">
                          <span>Score</span>
                          <strong>{score}</strong>
                        </div>
                      </div>

                      <div className="score-copy">
                        <div
                          className="pill-badge score-badge"
                          style={{
                            color: scoreMeta.color,
                            borderColor: `${scoreMeta.color}44`,
                            background: `${scoreMeta.color}14`,
                          }}
                        >
                          {scoreMeta.label}
                        </div>
                        <h3>{result.verdict}</h3>
                        <p>
                          Use this output as a strategic checkpoint. It is strongest when paired with
                          customer calls, landing-page tests, and fast pricing experiments.
                        </p>

                        <div className="metric-pills">
                          <span>
                            Market <b>{result.marketPotential}</b>
                          </span>
                          <span>
                            Uniqueness <b>{result.uniqueness}</b>
                          </span>
                          <span>
                            Risk <b>{result.riskLevel}</b>
                          </span>
                        </div>
                      </div>
                    </section>

                    <section className="tab-shell">
                      <div className="tab-row">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            className={tab.id === activeTab ? "tab active" : "tab"}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {activeTab === "overview" ? (
                        <div className="result-grid">
                          <ListCard title="Strengths" items={result.strengths} />
                          <ListCard title="Recommendations" items={result.recommendations} />
                          <ListCard title="Competitor snapshot" items={result.competitorSnapshot} />
                        </div>
                      ) : null}

                      {activeTab === "risks" ? (
                        <div className="result-grid">
                          <ListCard title="Weaknesses" items={result.weaknesses} />
                          <ListCard title="Business model hints" items={result.businessModelHints} />
                          <article className="insight-card">
                            <div className="section-tag">Risk summary</div>
                            <ul className="insight-list">
                              <li>Primary risk band: {result.riskLevel}</li>
                              <li>Sharpen the ICP before broadening the product scope.</li>
                              <li>Talk to likely buyers before automating secondary workflows.</li>
                            </ul>
                          </article>
                        </div>
                      ) : null}

                      {activeTab === "strategy" ? (
                        <div className="result-grid">
                          <ListCard title="Launch priorities" items={result.recommendations} />
                          <ListCard title="Monetization ideas" items={result.businessModelHints} />
                          <article className="insight-card">
                            <div className="section-tag">Founder notes</div>
                            <ul className="insight-list">
                              <li>Start with one narrow customer segment and one painful use case.</li>
                              <li>Test messaging with a landing page before building broad features.</li>
                              <li>Treat the score as direction, then let real customer behavior refine it.</li>
                            </ul>
                          </article>
                        </div>
                      ) : null}
                    </section>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="dock-wrap">
            <div className="surface-card input-dock">
              <form onSubmit={handleSubmit}>
                <div className="input-title-row">
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    placeholder="Startup idea title"
                    className="title-input"
                    autoComplete="off"
                  />
                  {form.title ? (
                    <button type="button" className="soft-button clear-button" onClick={reset}>
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="dock-divider" />

                <textarea
                  ref={textareaRef}
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Describe the idea, user pain, why the timing matters, and what makes it worth building."
                  className="description-input"
                  rows={4}
                />

                {showAdvanced ? (
                  <div className="advanced-panel animate-in">
                    <div>
                      <div className="field-label">Target audience</div>
                      <input
                        type="text"
                        name="targetAudience"
                        value={form.targetAudience}
                        onChange={updateField}
                        placeholder="For example: independent clinics"
                      />
                    </div>
                    <div>
                      <div className="field-label">Problem statement</div>
                      <textarea
                        name="problemStatement"
                        value={form.problemStatement}
                        onChange={updateField}
                        placeholder="What painful problem is worth solving here?"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="dock-footer">
                  <p className="dock-hint">The best reports come from clear user pain and sharp positioning.</p>

                  <div className="dock-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowAdvanced((current) => !current)}
                    >
                      {showAdvanced ? "Less context" : "Add context"}
                    </button>
                    <button type="submit" className="primary-button" disabled={!canSubmit}>
                      {loading ? <span className="spinner" aria-hidden="true" /> : null}
                      Validate idea
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
