import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // server-side only
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    // Fetch the HTML from the URL
    const response = await fetch(url);
    const html = await response.text();

    // Limit length to avoid token overflow
    const snippet = html.slice(0, 4000);

    // AI prompt
    const prompt = `
      You are an SEO expert. Analyze this page and suggest improvements
      for SEO, user traction, and conversion optimization.

      URL: ${url}
      HTML: ${snippet}
    `;

    const aiResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      suggestions: aiResponse.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
