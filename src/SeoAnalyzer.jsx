import { useState } from "react";
import { supabase } from "./supabaseClient";
import ReactMarkdown from "react-markdown";

export default function SeoAnalyzer({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Save SEO report in Supabase
  async function saveReport(userId, url, suggestions) {
    const { error } = await supabase
      .from("seo_reports")
      .insert([{ user_id: userId, url, suggestions }]);

    if (error) console.error(error);
  }

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);

    if (user) {
      await saveReport(user.id, url, data.suggestions);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#4F46E5",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#111827" }}>
            SEO Suggestions
          </h2>
          <div style={{ lineHeight: "1.6", color: "#374151" }}>
            <ReactMarkdown>{result.suggestions}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
