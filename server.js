require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Confirm environment key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file.");
  process.exit(1); // Exit early if key is missing
}

// ✅ Initialize Gemini with API Key
console.log("🔑 Gemini API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("📩 Incoming message:", userMessage);

  // ✅ Handle empty input
  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ reply: "Message cannot be empty." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(userMessage);
    const response = result.response;

    if (!response || typeof response.text !== "function") {
      console.error("⚠️ Gemini returned invalid or empty response:", response);
      return res.status(500).json({ reply: "AI gave an empty response." });
    }

    const reply = response.text();
    console.log("🤖 Gemini Reply:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("❌ Gemini API Error:", error);

    // ✅ Extra debugging if error includes a response (from fetch or HTTP layer)
    if (error?.response?.status) {
      console.error("🛑 HTTP Status:", error.response.status);
      const body = await error.response.text?.();
      console.error("🧾 Gemini Response Text:", body);
    }

    res.status(500).json({ reply: "AI failed to respond. Try again." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
