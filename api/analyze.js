import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ works in Vercel
});

export default async function handler(req, res) {
  try {
    const { url } = req.body;

    const response = await fetch(url);
    const html = await response.text();

    const snippet = html.slice(0, 4000); // avoid token overload

    const prompt = `
      You are an SEO expert. Analyze this page and suggest improvements
      for SEO, traction, and conversion optimization.

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
    res.status(500).json({ error: err.message });
  }
}
