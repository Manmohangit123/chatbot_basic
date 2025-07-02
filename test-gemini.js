const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function runTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("🔑 Gemini API Key from .env:", apiKey);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent("Hello, Gemini!");
    console.log("✅ Gemini Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error from Gemini:", error);
  }
}

runTest();
