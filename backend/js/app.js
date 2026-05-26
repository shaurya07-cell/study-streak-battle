import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAgkxzhpl0jQ74r2iW3zFcGrYw1Hw6HI8o");

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