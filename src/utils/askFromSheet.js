import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



export default async function askFromSheet(userQuery, sheetData) {


    console.log(userQuery);
    console.log(JSON.stringify(sheetData, null, 2));


  try {
    const prompt = `
You are a helpful data assistant.

Your job is to answer the user's question using ONLY the provided Google Sheet data.

Rules:
1. Use only the information available in the sheet data.
2. Do not invent or assume information.
3. If the answer is not available in the sheet data, say:
   "I couldn't find that information in the available data."
4. Give a clear and concise answer.
5. Understand the user's question even if it contains spelling mistakes or informal language.

Google Sheet Data:
${JSON.stringify(sheetData, null, 2)}

User Question:
${userQuery}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate answer.");
  }
}