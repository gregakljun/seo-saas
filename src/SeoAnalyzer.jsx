import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function SeoAnalyzer({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 👇 your saveReport function here
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

    // 👇 Save analysis to Supabase
    if (user) {
      await saveReport(user.id, url, data.suggestions);
    }

    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="results">
          <h2>SEO Suggestions</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
