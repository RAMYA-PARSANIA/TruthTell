import React, { useState } from "react";

// Entity type representing named entities extracted from text
interface Entity {
  entity: string;
  type: string;
}

// Gemini AI analysis structure
interface GeminiAnalysis {
  gemini_analysis: {
    predicted_classification: string;
    confidence_score: string;
    reasoning: string[];
  };
  text_classification?: {
    category: string;
    writing_style: string;
    target_audience: string;
    content_type: string;
  };
  sentiment_analysis?: {
    primary_emotion: string;
    emotional_intensity: string;
    sensationalism_level: string;
    bias_indicators: string[];
    tone: {
      formality: string;
      style: string;
    };
    emotional_triggers: string[];
  };
  entity_recognition?: {
    source_credibility: string;
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    statistics: string[];
  };
  context?: {
    main_narrative: string;
    supporting_elements: string[];
    key_claims: string[];
    narrative_structure: string;
  };
  fact_checking?: {
    verifiable_claims: string[];
    evidence_present: string;
    fact_check_score: string;
  };
}

// Detailed analysis with image instead of graph data
interface DetailedAnalysis {
  entities: Entity[];
  knowledge_graph: {
    image: string;
  }; // Base64 encoded image as data URL
  is_fake: boolean;
  gemini_analysis: GeminiAnalysis;
}

// Main response schema
interface PredictionResponse {
  ml_prediction: string;
  ml_confidence: number;
  kg_prediction: string;
  kg_confidence: number;
  gemini_prediction: string;
  gemini_confidence: string;
  detailed_analysis: DetailedAnalysis;
}

// Input model for API request
interface NewsInput {
  text: string;
}

const NLP: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: NewsInput = { text: inputText };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/nlp/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze text. Please try again later.");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTruthScore = () => {
    if (!result) return null;

    const isFake = result.detailed_analysis.is_fake;
    const scoreClass = isFake
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
    const scoreText = isFake ? "Likely False" : "Likely True";

    return (
      <div className="mb-6 text-center">
        <div
          className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${scoreClass}`}
        >
          {scoreText}
        </div>
      </div>
    );
  };

  const renderConfidenceMeters = () => {
    if (!result) return null;

    const models = [
      {
        name: "Machine Learning",
        prediction: result.ml_prediction,
        confidence: result.ml_confidence,
      },
      {
        name: "Knowledge Graph",
        prediction: result.kg_prediction,
        confidence: result.kg_confidence,
      },
      {
        name: "AI Prediction",
        prediction: result.gemini_prediction,
        confidence: parseFloat(result.gemini_confidence),
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {models.map((model, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">{model.name}</h3>
            <p className="text-sm text-gray-500">
              Prediction: {model.prediction}
            </p>
            <div className="mt-2 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  model.prediction.toLowerCase().includes("fake")
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${
                    typeof model.confidence === "number"
                      ? model.confidence
                      : parseFloat(model.confidence)
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1">
              {typeof model.confidence === "number"
                ? `${model.confidence.toFixed(1)}%`
                : `${parseFloat(model.confidence).toFixed(1)}%`}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderEntities = () => {
    if (!result) return null;

    const { entities } = result.detailed_analysis;
    if (!entities.length) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl text-white font-bold mb-4">Named Entities</h2>
        <div className="flex flex-wrap gap-2">
          {entities.map((entity, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${getEntityColor(
                entity.type
              )}`}
            >
              {entity.entity} ({entity.type})
            </span>
          ))}
        </div>
      </div>
    );
  };

  const getEntityColor = (type: string) => {
    const colors: Record<string, string> = {
      PERSON: "bg-blue-100 text-blue-800",
      ORGANIZATION: "bg-purple-100 text-purple-800",
      LOCATION: "bg-green-100 text-green-800",
      DATE: "bg-yellow-100 text-yellow-800",
      TIME: "bg-orange-100 text-orange-800",
      MONEY: "bg-emerald-100 text-emerald-800",
      PERCENT: "bg-pink-100 text-pink-800",
    };

    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const renderGeminiAnalysis = () => {
    if (!result) return null;

    const { gemini_analysis } = result.detailed_analysis;

    return (
      <div className=" mb-8">
        <h2 className="text-xl text-white font-bold mb-4">AI Analysis</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold text-lg mb-2">Classification</h3>
          <p className="mb-2">
            <span className="font-medium">Prediction:</span>{" "}
            {gemini_analysis.gemini_analysis.predicted_classification}
          </p>
          <p className="mb-4">
            <span className="font-medium">Confidence:</span>{" "}
            {gemini_analysis.gemini_analysis.confidence_score}
          </p>

          <h3 className="font-semibold text-lg mb-2">Reasoning</h3>
          <ul className="list-disc pl-5 space-y-1">
            {gemini_analysis.gemini_analysis.reasoning.map((reason, index) => (
              <li key={index} className="text-gray-700">
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {gemini_analysis.text_classification && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-semibold text-lg mb-3">Text Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p>{gemini_analysis.text_classification.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Writing Style
                </p>
                <p>{gemini_analysis.text_classification.writing_style}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Target Audience
                </p>
                <p>{gemini_analysis.text_classification.target_audience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Content Type
                </p>
                <p>{gemini_analysis.text_classification.content_type}</p>
              </div>
            </div>
          </div>
        )}

        {gemini_analysis.sentiment_analysis && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-semibold text-lg mb-3">Sentiment Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Primary Emotion
                </p>
                <p>{gemini_analysis.sentiment_analysis.primary_emotion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Emotional Intensity
                </p>
                <p>{gemini_analysis.sentiment_analysis.emotional_intensity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Sensationalism Level
                </p>
                <p>{gemini_analysis.sentiment_analysis.sensationalism_level}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Bias Indicators
              </p>
              <div className="flex flex-wrap gap-2">
                {gemini_analysis.sentiment_analysis.bias_indicators.map(
                  (bias, index) => (
                    <span
                      key={index}
                      className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm"
                    >
                      {bias}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Tone</p>
              <p>
                <span className="font-medium">Formality:</span>{" "}
                {gemini_analysis.sentiment_analysis.tone.formality}
              </p>
              <p>
                <span className="font-medium">Style:</span>{" "}
                {gemini_analysis.sentiment_analysis.tone.style}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Emotional Triggers
              </p>
              <div className="flex flex-wrap gap-2">
                {gemini_analysis.sentiment_analysis.emotional_triggers.map(
                  (trigger, index) => (
                    <span
                      key={index}
                      className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-sm"
                    >
                      {trigger}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {gemini_analysis.entity_recognition && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-semibold text-lg mb-3">Entity Recognition</h3>
            <p className="mb-4">
              <span className="font-medium">Source Credibility:</span>{" "}
              {gemini_analysis.entity_recognition.source_credibility}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">People</p>
                <ul className="list-disc pl-5">
                  {gemini_analysis.entity_recognition.people.map(
                    (person, index) => (
                      <li key={index}>{person}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Organizations
                </p>
                <ul className="list-disc pl-5">
                  {gemini_analysis.entity_recognition.organizations.map(
                    (org, index) => (
                      <li key={index}>{org}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Locations
                </p>
                <ul className="list-disc pl-5">
                  {gemini_analysis.entity_recognition.locations.map(
                    (location, index) => (
                      <li key={index}>{location}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Dates</p>
                <ul className="list-disc pl-5">
                  {gemini_analysis.entity_recognition.dates.map(
                    (date, index) => (
                      <li key={index}>{date}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Statistics
                </p>
                <ul className="list-disc pl-5">
                  {gemini_analysis.entity_recognition.statistics.map(
                    (stat, index) => (
                      <li key={index}>{stat}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {gemini_analysis.context && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-semibold text-lg mb-3">Context Analysis</h3>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">
                Main Narrative
              </p>
              <p className="text-gray-700">
                {gemini_analysis.context.main_narrative}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Supporting Elements
              </p>
              <ul className="list-disc pl-5">
                {gemini_analysis.context.supporting_elements.map(
                  (element, index) => (
                    <li key={index} className="text-gray-700">
                      {element}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Key Claims
              </p>
              <ul className="list-disc pl-5">
                {gemini_analysis.context.key_claims.map((claim, index) => (
                  <li key={index} className="text-gray-700">
                    {claim}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Narrative Structure
              </p>
              <p className="text-gray-700">
                {gemini_analysis.context.narrative_structure}
              </p>
            </div>
          </div>
        )}

        {gemini_analysis.fact_checking && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-3">Fact Checking</h3>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Verifiable Claims
              </p>
              <ul className="list-disc pl-5">
                {gemini_analysis.fact_checking.verifiable_claims.map(
                  (claim, index) => (
                    <li key={index} className="text-gray-700">
                      {claim}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">
                Evidence Present
              </p>
              <p className="text-gray-700">
                {gemini_analysis.fact_checking.evidence_present}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Fact Check Score
              </p>
              <p className="text-gray-700">
                {gemini_analysis.fact_checking.fact_check_score}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderKnowledgeGraph = () => {
    if (!result) return null;

    console.log(result);

    return (
      <div className="mb-8">
        <h2 className="text-xl text-white font-bold mb-4">Knowledge Graph</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={`data:image/png;base64,${result.detailed_analysis.knowledge_graph.image}`}
            alt="Knowledge Graph"
            className="w-full h-auto rounded"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        TruthTell NLP Fact Checker
      </h1>

      <div className="bg-zinc-900 p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="text-input"
              className="block text-neutral-100 font-medium mb-4"
            >
              Enter news text to analyze
            </label>
            <textarea
              id="text-input"
              rows={6}
              className="bg-zinc-800 w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste news article or statement here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Analyzing..." : "Analyze Text"}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {result && (
        <div className="bg-zinc-900 text-black p-6 rounded-lg">
          {renderTruthScore()}
          {renderConfidenceMeters()}
          {renderEntities()}
          {renderKnowledgeGraph()}
          {renderGeminiAnalysis()}
        </div>
      )}
    </div>
  );
};

export default NLP;
