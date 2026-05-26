import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

async function run() {
  try {
    const result = await model.generateContent(
      "Give me a study quote"
    );

    console.log(result.response.text());

  } catch (error) {
    console.error("Error:", error);
  }
}

run();