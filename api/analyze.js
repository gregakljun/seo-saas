import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url, language } = req.body;

    const response = await fetch(url);
    const html = await response.text();
    const snippet = html.slice(0, 4000);

    const prompt = `
    You are an SEO expert. Analyze this page and suggest improvements for SEO, traction, and conversion.
    Return the result in ${language}.
    
    IMPORTANT: Return output as strict JSON in this format:
    {
      "suggestions": [
        { "text": "Improve title tag with primary keyword", "impact": 25 },
        { "text": "Optimize meta description for clicks", "impact": 20 },
        { "text": "Add alt text to images", "impact": 15 }
      ]
    }

    The sum of all "impact" values MUST equal 100.
    URL: ${url}
    HTML snippet: ${snippet}
    `;

    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const json = JSON.parse(aiResponse.choices[0].message.content);

    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
