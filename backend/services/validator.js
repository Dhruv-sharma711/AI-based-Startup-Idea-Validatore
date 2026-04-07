const DEFAULT_VALIDATION = {
  overallScore: 62,
  verdict: "Needs refinement before launch",
  marketPotential: "Moderate",
  uniqueness: "Moderate",
  riskLevel: "Medium",
  strengths: [
    "Clear user pain can be communicated quickly",
    "Potential to iterate using customer interviews",
  ],
  weaknesses: [
    "Go-to-market strategy is not yet specific",
    "Monetization details are currently broad",
  ],
  recommendations: [
    "Validate demand with 10-20 target user interviews",
    "Build a narrow MVP with one core workflow",
    "Run a pricing smoke test with a landing page",
  ],
  competitorSnapshot: [
    "Identify 3 direct and 3 indirect competitors",
    "List one key differentiator per competitor",
  ],
  businessModelHints: [
    "Consider subscription for recurring value products",
    "Pilot with a single niche before broad expansion",
  ],
};
let discoveredModelsCache = null;

const normalizeModelName = (name = "") => name.replace(/^models\//, "");

const extractJsonObject = (text) => {
  const firstCurly = text.indexOf("{");
  const lastCurly = text.lastIndexOf("}");

  if (firstCurly === -1 || lastCurly === -1 || lastCurly <= firstCurly) {
    throw new Error("No JSON object returned by AI model.");
  }

  return text.slice(firstCurly, lastCurly + 1);
};

const parseGeminiResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || "Gemini API request failed unexpectedly.";
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const parsed = JSON.parse(extractJsonObject(text));
  return parsed;
};

const buildPrompt = ({ title, description, targetAudience, problemStatement }) =>
  `
You are a startup analyst.
Analyze this startup idea and return only valid JSON.

Startup idea:
- title: ${title}
- description: ${description}
- targetAudience: ${targetAudience || "Not provided"}
- problemStatement: ${problemStatement || "Not provided"}

Return ONLY this JSON object shape with useful content:
{
  "overallScore": number between 0 and 100,
  "verdict": "short verdict",
  "marketPotential": "Low|Moderate|High",
  "uniqueness": "Low|Moderate|High",
  "riskLevel": "Low|Medium|High",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "competitorSnapshot": ["..."],
  "businessModelHints": ["..."]
}
No markdown, no extra text.
`.trim();

const discoverGenerateContentModels = async (apiKey) => {
  if (discoveredModelsCache) {
    return discoveredModelsCache;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "Unable to list Gemini models.";
    throw new Error(message);
  }

  discoveredModelsCache = (data.models || [])
    .filter((model) =>
      (model.supportedGenerationMethods || []).includes("generateContent")
    )
    .map((model) => normalizeModelName(model.name));

  return discoveredModelsCache;
};

const validateIdeaWithGemini = async (ideaInput) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ...DEFAULT_VALIDATION,
      verdict: `${DEFAULT_VALIDATION.verdict} (fallback mode without GEMINI_API_KEY)`,
    };
  }

  const prompt = buildPrompt(ideaInput);
  const preferredModel = normalizeModelName(process.env.GEMINI_MODEL);
  try {
    const discoveredModels = await discoverGenerateContentModels(apiKey);
    const staticFallbacks = [
      "gemini-2.0-flash",
      "gemini-flash-latest",
      "gemini-2.5-flash",
      "gemini-pro-latest",
    ];
    const modelCandidates = [
      preferredModel,
      ...staticFallbacks,
      ...discoveredModels,
    ].filter(Boolean);
    const uniqueCandidates = [...new Set(modelCandidates)];

    let lastError = null;

    for (const model of uniqueCandidates) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
          }),
        }
      );

      try {
        return await parseGeminiResponse(response);
      } catch (error) {
        lastError = error;
        const message = String(error.message || "");
        const shouldTryNextModel =
          message.includes("not found") ||
          message.includes("not supported") ||
          message.includes("404");

        if (!shouldTryNextModel) {
          throw error;
        }
      }
    }

    throw (
      lastError ||
      new Error(
        "No compatible Gemini model found. Update GEMINI_MODEL in backend/.env."
      )
    );
  } catch (error) {
    const message = String(error.message || "").toLowerCase();
    const isQuotaIssue =
      message.includes("quota") ||
      message.includes("rate limit") ||
      message.includes("429");

    if (isQuotaIssue) {
      return {
        ...DEFAULT_VALIDATION,
        verdict:
          "AI quota exceeded, showing fallback validation. Try again after quota reset.",
      };
    }

    throw error;
  }
};

module.exports = { validateIdeaWithGemini };
