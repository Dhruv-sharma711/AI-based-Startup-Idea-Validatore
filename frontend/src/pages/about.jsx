export default function About() {
  return (
    <div className="page-container animate-in">
      <div className="panel page-panel">
        <div className="section-tag">About</div>
        <h1 className="page-title">AI Based Startup Idea Validator</h1>
        <div className="gold-line" />
        <p className="page-subtitle">
          This app helps founders quickly pressure-test a startup concept using a
          structured, investor-style checklist — covering clarity, market potential,
          differentiation, risks, and a practical launch plan.
        </p>

        <div className="analysis-grid" style={{ marginTop: 8 }}>
          <article className="insight-card">
            <div className="section-tag">What it does</div>
            <ul className="insight-list">
              <li>Generates a clear verdict and a score out of 100.</li>
              <li>Highlights strengths, weaknesses, and execution risks.</li>
              <li>Suggests MVP scope, positioning, and next validation steps.</li>
            </ul>
          </article>

          <article className="insight-card">
            <div className="section-tag">How to use</div>
            <ul className="insight-list">
              <li>Describe your idea in the Home workspace.</li>
              <li>Be specific about the target audience and the pain point.</li>
              <li>Run validation, then iterate and compare results.</li>
            </ul>
          </article>

          <article className="insight-card">
            <div className="section-tag">Important</div>
            <ul className="insight-list">
              <li>AI output is guidance, not a guarantee.</li>
              <li>Always validate with real customers before building.</li>
              <li>If AI quota is exceeded, the app shows a fallback report.</li>
            </ul>
          </article>
        </div>

        <div className="divider" />

        {/* Extra info row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 4,
          }}
        >
          {[
            { icon: "⚡", label: "Fast Analysis", desc: "Get a full report in under 10 seconds." },
            { icon: "🎯", label: "Investor Lens", desc: "Structured like a VC due-diligence checklist." },
            { icon: "🔁", label: "Iterate Fast", desc: "Tweak and re-validate to sharpen your concept." },
            { icon: "📊", label: "Scored Output", desc: "Numeric score helps compare multiple ideas." },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-card-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r12)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 14,
                  letterSpacing: 1,
                  color: "var(--gold)",
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}