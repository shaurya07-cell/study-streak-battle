
import { GoogleGenerativeAI } from "@google/generative-ai";
require("dotenv").config();

console.log(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

async function run() {
  const result = await model.generateContent(
    "Give me a study quote"
  );

  console.log(result.response.text());
}

run();