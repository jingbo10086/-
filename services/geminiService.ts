
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { Reagent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeSafety = async (flaskReagents: Reagent[]) => {
  if (flaskReagents.length === 0) return null;

  const reagentList = flaskReagents.map(r => `${r.name} (${r.formula})`).join(", ");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下化学物质被混合在烧杯中：${reagentList}。请分析安全性并说明反应。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reaction: { type: Type.STRING, description: "对观察到的反应的简短描述" },
            riskScore: { type: Type.NUMBER, description: "0-100 的风险分数" },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "安全警告列表" },
            explanation: { type: Type.STRING, description: "科学原理的详细解释" },
            newColor: { type: Type.STRING, description: "反应后混合物的 Tailwind 颜色类名" }
          },
          required: ["reaction", "riskScore", "warnings", "explanation"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini 分析错误:", error);
    return null;
  }
};

export const getKnowledgeCard = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `用通俗易懂且有趣的方式向学生解释 ${topic}。包括一个关键的化学方程式。请使用中文回答。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            equation: { type: Type.STRING },
            funFact: { type: Type.STRING }
          },
          required: ["title", "explanation", "equation", "funFact"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};
