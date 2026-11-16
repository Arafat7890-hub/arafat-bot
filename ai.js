const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

const MODELS = [
  "openrouter/free"
];

async function ask(prompt) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
  }

  const response = await client.chat.completions.create({
    model: MODELS[0],
    messages: [
      {
        role: "system",
        content: "You are Arafat Bbz AI. Give helpful, concise answers."
      },
      {
        role: "user",
        content: String(prompt)
      }
    ],
    max_tokens: 800
  });

  const text = response.choices?.[0]?.message?.content;

  if (!text || !text.trim()) {
    throw new Error("AI returned an empty response");
  }

  return text.trim();
}

module.exports = { ask };
