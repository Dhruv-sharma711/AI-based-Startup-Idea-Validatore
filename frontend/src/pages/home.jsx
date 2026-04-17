import { useEffect, useRef, useState } from "react";
import axios from "axios";

const starterIdeas = [
  {
    title: "AI Watchman",
    description: "An AI-powered CCTV monitoring system that detects suspicious activity, accidents, unusual crowding, and animal intrusion around homes.",
    targetAudience: "Home owners, gated communities, and small offices",
    problemStatement: "People want 24×7 property monitoring without paying for full-time guards.",
  },
  {
    title: "Founder Copilot",
    description: "A startup planning assistant that helps first-time founders validate market demand, define ICP, test pricing, and build MVP roadmaps.",
    targetAudience: "Solo founders and student entrepreneurs",
    problemStatement: "Early-stage founders struggle to convert raw ideas into focused execution plans.",
  },
  {
    title: "Clinic Queue AI",
    description: "A smart appointment and triage system for clinics that predicts wait times and suggests patient flow improvements.",
    targetAudience: "Small clinics and diagnostic centers",
    problemStatement: "Clinics lose patients because waiting times and operations are poorly managed.",
  },
];

const scoreLabels = [
  { limit: 39,  label: "Early Concept",     color: "#e05555" },
  { limit: 64,  label: "Promising",          color: "#d4953a" },
  { limit: 84,  label: "Strong Opportunity", color: "#c9a050" },
  { limit: 100, label: "High Potential",     color: "#7ec87e" },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "risks",    label: "Risks"    },
  { id: "strategy", label: "Strategy" },
];

export default function Home({ apiBaseUrl, onOpenAuth }) {
  const [form, setForm] = useState({ title: "", description: "", targetAudience: "", problemStatement: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [result, setResult]     = useState(null);
  const [history, setHistory]   = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const feedRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/ideas`)
      .then(r => setHistory(r.data || []))
      .catch(() => setHistory([]));
  }, [apiBaseUrl]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [form.description]);

  useEffect(() => {
    if (result && feedRef.current) {
      setTimeout(() => feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" }), 80);
    }
  }, [result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const applyStarter = (idea) => {
    setForm(idea);
    setError("");
    setResult(null);
    setSubmitted(null);
  };

  const reset = () => {
    setForm({ title: "", description: "", targetAudience: "", problemStatement: "" });
    setResult(null);
    setError("");
    setSubmitted(null);
    setShowAdvanced(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.title.trim() || !form.description.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setActiveTab("overview");
    setSubmitted({ ...form });
    try {
      const res = await axios.post(`${apiBaseUrl}/api/ideas/validate`, form);
      setResult(res.data.validation);
      if (res.data.idea) setHistory(p => [res.data.idea, ...p].slice(0, 8));
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Could not validate your startup idea.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.title.trim() && form.description.trim() && !loading;

  const score = result?.overallScore ?? 0;
  const scoreMeta = scoreLabels.find(s => score <= s.limit) ?? scoreLabels[3];

  const ListCard = ({ title, items }) => (
    <article className="insight-card">
      <div className="section-tag">{title}</div>
      <ul className="insight-list">
        {(items || []).map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </article>
  );

  return (
    <div className="iv-shell">

      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside className="iv-sidebar">
        <div className="iv-sidebar-top">
          <button className="iv-new-btn" onClick={reset}>
            <span className="iv-new-icon">+</span>
            New Idea
          </button>
        </div>

        <div className="iv-sidebar-body">
          <div className="iv-sb-label">Starter Templates</div>
          {starterIdeas.map(idea => (
            <button key={idea.title} className="iv-sb-starter" onClick={() => applyStarter(idea)}>
              <strong>{idea.title}</strong>
              <span>{idea.targetAudience}</span>
            </button>
          ))}

          {history.length > 0 && (
            <>
              <div className="iv-sb-label" style={{ marginTop: 24 }}>Recent Ideas</div>
              {history.map(item => (
                <button
                  key={item._id}
                  className="iv-sb-history"
                  onClick={() => {
                    setForm({ title: item.title || "", description: item.description || "", targetAudience: item.targetAudience || "", problemStatement: item.problemStatement || "" });
                    setResult(null); setSubmitted(null); setError("");
                  }}
                >
                  <span className="iv-sb-hist-title">{item.title}</span>
                  {item.validation?.overallScore != null && (
                    <span className="iv-sb-hist-score">{item.validation.overallScore}</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="iv-main">
        <div className="iv-feed" ref={feedRef}>
          {!submitted && !loading ? (
            <div className="iv-welcome">
              <div className="iv-welcome-mark">IV</div>
              <h2 className="iv-welcome-title">Validate your startup idea</h2>
              <p className="iv-welcome-sub">
                Describe your concept below and get an investor-style analysis — scored, structured, and founder-ready.
              </p>

              {/* ── Quick-start chips ── */}
              <div className="iv-welcome-chips">
                {starterIdeas.map(idea => (
                  <button key={idea.title} className="iv-chip" onClick={() => applyStarter(idea)}>
                    {idea.title}
                  </button>
                ))}
              </div>

              {/* ── Auth CTA ── */}
              <div style={{
                marginTop: 28,
                display: "flex", alignItems: "center", gap: 10,
                flexWrap: "wrap", justifyContent: "center",
              }}>
                <button
                  className="primary-button"
                  style={{ fontSize: 13, padding: "10px 22px", letterSpacing: "1px" }}
                  onClick={() => onOpenAuth("register")}
                >
                  🚀 Sign Up — It's Free
                </button>
                <button
                  className="ghost-button"
                  style={{ fontSize: 13, padding: "9px 20px" }}
                  onClick={() => onOpenAuth("login")}
                >
                  Log In
                </button>
              </div>

              <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10 }}>
                Save your ideas and track your validation history.
              </p>
            </div>
          ) : (
            <div className="iv-thread animate-in">

              {submitted && (
                <div className="iv-bubble-row">
                  <div className="iv-bubble-user">
                    <div className="iv-bubble-title">{submitted.title}</div>
                    <div className="iv-bubble-body">{submitted.description}</div>
                    {(submitted.targetAudience || submitted.problemStatement) && (
                      <div className="iv-bubble-meta">
                        {submitted.targetAudience && <span>Audience: {submitted.targetAudience}</span>}
                        {submitted.problemStatement && <span>Problem: {submitted.problemStatement}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loading && (
                <div className="iv-thinking">
                  <div className="iv-think-dots">
                    <span /><span /><span />
                  </div>
                  <span>Analyzing with investor lens…</span>
                </div>
              )}

              {error && <p className="error" style={{ margin: "0 0 16px" }}>{error}</p>}

              {result && (
                <div className="iv-result animate-in">
                  <div className="iv-score-bar">
                    <div className="iv-score-ring" style={{ "--score": `${score}%`, "--score-color": scoreMeta.color }}>
                      <div>
                        <span>Score</span>
                        <strong>{score}</strong>
                      </div>
                    </div>
                    <div className="iv-score-info">
                      <div className="iv-score-badge" style={{ color: scoreMeta.color, borderColor: scoreMeta.color + "44", background: scoreMeta.color + "18" }}>
                        {scoreMeta.label}
                      </div>
                      <h3 className="iv-verdict">{result.verdict}</h3>
                      <div className="iv-score-pills">
                        <span>Market <b>{result.marketPotential}</b></span>
                        <span>Uniqueness <b>{result.uniqueness}</b></span>
                        <span>Risk <b>{result.riskLevel}</b></span>
                      </div>
                    </div>
                  </div>

                  <div className="tab-row" style={{ marginBottom: 16 }}>
                    {TABS.map(t => (
                      <button key={t.id} className={t.id === activeTab ? "tab active" : "tab"} onClick={() => setActiveTab(t.id)}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === "overview" && (
                    <div className="analysis-grid">
                      <ListCard title="Strengths"           items={result.strengths} />
                      <ListCard title="Recommendations"     items={result.recommendations} />
                      <ListCard title="Competitor Snapshot" items={result.competitorSnapshot} />
                    </div>
                  )}
                  {activeTab === "risks" && (
                    <div className="analysis-grid">
                      <ListCard title="Weaknesses"           items={result.weaknesses} />
                      <ListCard title="Business Model Hints" items={result.businessModelHints} />
                      <article className="insight-card">
                        <div className="section-tag">Risk Summary</div>
                        <ul className="insight-list">
                          <li>Primary risk band: {result.riskLevel}</li>
                          <li>Sharpen your ICP before expanding features.</li>
                          <li>Run customer interviews before broad automation.</li>
                        </ul>
                      </article>
                    </div>
                  )}
                  {activeTab === "strategy" && (
                    <div className="analysis-grid">
                      <ListCard title="Launch Priorities"  items={result.recommendations} />
                      <ListCard title="Monetization Ideas" items={result.businessModelHints} />
                      <article className="insight-card">
                        <div className="section-tag">Founder Notes</div>
                        <ul className="insight-list">
                          <li>Start with one niche customer segment.</li>
                          <li>Test a landing page before full product build.</li>
                          <li>Use the score as direction, not as final truth.</li>
                        </ul>
                      </article>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── INPUT DOCK ─────────────────────────────── */}
        <div className="iv-dock">
          <form className="iv-input-box" onSubmit={handleSubmit}>
            <div className="iv-input-title-row">
              <input
                type="text" name="title" value={form.title}
                onChange={handleChange} placeholder="Idea title…"
                className="iv-title-input" autoComplete="off"
              />
              {form.title && (
                <button type="button" className="iv-clear-btn" onClick={reset} title="Clear">✕</button>
              )}
            </div>

            <div className="iv-input-divider" />

            <textarea
              ref={textareaRef} name="description" value={form.description}
              onChange={handleChange}
              placeholder="Describe your startup — what it does, who it's for, why now…"
              className="iv-desc-input" rows={2}
            />

            {showAdvanced && (
              <div className="iv-advanced animate-in">
                <div className="iv-adv-grid">
                  <div>
                    <div className="iv-adv-label">Target Audience</div>
                    <input type="text" name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="e.g. College students" className="iv-adv-input" />
                  </div>
                  <div>
                    <div className="iv-adv-label">Problem Statement</div>
                    <textarea name="problemStatement" value={form.problemStatement} onChange={handleChange} placeholder="What pain point are you solving?" className="iv-adv-input" rows={2} />
                  </div>
                </div>
              </div>
            )}

            <div className="iv-input-footer">
              <button type="button" className="iv-adv-toggle" onClick={() => setShowAdvanced(v => !v)}>
                {showAdvanced ? "− Less" : "+ More context"}
              </button>
              <button type="submit" className="iv-send-btn" disabled={!canSubmit}>
                {loading ? <Spinner /> : "⚡ Validate"}
              </button>
            </div>
          </form>
          <p className="iv-dock-hint">AI output is guidance — validate with real customers.</p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 13, height: 13,
      border: "2px solid rgba(255,255,255,0.25)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.75s linear infinite",
    }} />
  );
}