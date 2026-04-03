const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "stepfun/step-3.5-flash:free",
    messages: [
      {
        role: "system",
        content:
          "You are an expart personal productivity coach and learning specialist. Create actionable and structured plans",
      },
      // { role: "user", content: "What is agentic AI?" },
    ],
    temperature: 0.7,
  });

  console.log(completion.choices[0].message.content);
}

main();
