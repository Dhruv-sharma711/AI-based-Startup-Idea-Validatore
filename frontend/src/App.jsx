import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    problemStatement: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ideas/validate`, formData);
      setResult(response.data.validation);
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

  const renderList = (title, items) => (
    <div className="result-card">
      <h3>{title}</h3>
      <ul>
        {(items || []).map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="page">
      <h1>AI Startup Idea Validator</h1>
      <p className="subtitle">
        Submit your startup concept and get an instant AI-powered validation report.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Idea Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Ex: AI financial coach for students"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Idea Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="What does your product do? Why now?"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <label htmlFor="targetAudience">Target Audience</label>
        <input
          id="targetAudience"
          name="targetAudience"
          type="text"
          placeholder="Ex: College students with low financial literacy"
          value={formData.targetAudience}
          onChange={handleChange}
        />

        <label htmlFor="problemStatement">Problem Statement</label>
        <textarea
          id="problemStatement"
          name="problemStatement"
          placeholder="What exact pain point are you solving?"
          value={formData.problemStatement}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Validate Idea"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <section className="results">
          <div className="result-card top-line">
            <p>
              <strong>Overall Score:</strong> {result.overallScore}/100
            </p>
            <p>
              <strong>Verdict:</strong> {result.verdict}
            </p>
            <p>
              <strong>Market Potential:</strong> {result.marketPotential}
            </p>
            <p>
              <strong>Uniqueness:</strong> {result.uniqueness}
            </p>
            <p>
              <strong>Risk Level:</strong> {result.riskLevel}
            </p>
          </div>

          <div className="grid">
            {renderList("Strengths", result.strengths)}
            {renderList("Weaknesses", result.weaknesses)}
            {renderList("Recommendations", result.recommendations)}
            {renderList("Competitor Snapshot", result.competitorSnapshot)}
            {renderList("Business Model Hints", result.businessModelHints)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default App;