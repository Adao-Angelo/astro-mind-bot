import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { prompts } from "./prompt";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("The API key (Gemini_api_Key) is not defined in .env.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function ai(input: string, user: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      ` ${prompts.input} User message--->${input}`
    );

    return result.response.text();
  } catch (error: any) {
    console.error("Error when generating content:", error.message);

    if (error.status === 429) {
      console.log("quota exceeded. waiting before trying again ...");
      await new Promise((resolve) => setTimeout(resolve, 60000));
      return ai(input, user);
    }

    return "Error when processing the request.";
  }
}
