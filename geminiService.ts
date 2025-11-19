import { GoogleGenAI } from "@google/genai";
import { ChannelStats, Language } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePostContent = async (topic: string, tone: string, lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing.";

  try {
    const prompt = `
      Role: Executive Social Media Strategist.
      Language: ${lang === 'ru' ? 'Russian' : 'English'}.
      Task: Write a Telegram post about "${topic}".
      Tone: ${tone} but professional and business-oriented.
      
      Format:
      - Headline (Standard capitalization)
      - Main point (Clear and concise)
      - Call to Action (Engaging)
      - Use standard sentence case for better readability.
      - Max 150 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return lang === 'ru' ? "Ошибка генерации." : "Generation error.";
  }
};

export const analyzeChannelStats = async (stats: ChannelStats[], lang: Language): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key missing.";

  try {
    const statsString = JSON.stringify(stats);
    const prompt = `
      Analyze these Telegram channel stats (last 7 days):
      ${statsString}

      Language: ${lang === 'ru' ? 'Russian' : 'English'}.
      Output Style: Professional Executive Summary.
      
      Format Requirements:
      1. Use standard capitalization (not all caps).
      2. Short, actionable insights.
      3. Focus on growth opportunities.
      4. Max 3 bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No data available.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return lang === 'ru' ? "Анализ недоступен." : "Analysis unavailable.";
  }
};

export const matchAdContent = async (channelDescription: string, adContent: string, lang: Language): Promise<{ score: number, reason: string }> => {
  const ai = getClient();
  if (!ai) return { score: 0, reason: "API Key missing" };

  try {
    const prompt = `
      Act as an Advertising Auditor.
      Language: ${lang === 'ru' ? 'Russian' : 'English'}.
      Compare Channel: "${channelDescription}"
      With Ad: "${adContent}"

      Output strictly JSON:
      {
        "score": number (0-100),
        "reason": "Short professional verdict (sentence case)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    const result = JSON.parse(text);
    return { score: result.score, reason: result.reason };
  } catch (error) {
    console.error("Gemini matching error:", error);
    return { score: 50, reason: "Audit failed." };
  }
};