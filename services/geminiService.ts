
import { Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { Reagent } from "../types";
/** 
 * 调用点标注：
 * 所有的 Gemini API 调用现在都统一引用自 aiClient.ts
 */
import { ai } from "./aiClient";

/**
 * 实验室安全分析服务
 * 功能：实时识别混合试剂的化学反应、风险等级及安全警告
 */
export const analyzeSafety = async (flaskReagents: Reagent[], temperature: number = 25) => {
  if (flaskReagents.length === 0) return null;

  const reagentList = flaskReagents.map(r => `${r.name} (${r.formula})`).join(", ");
  
  try {
    /** 
     * 调用点：使用统一的 ai 实例调用 models.generateContent
     * 模型：gemini-3-flash-preview (适用于基础文本分析任务)
     */
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `以下化学物质被混合在烧杯中：${reagentList}。
      当前实验室温度设定为：${temperature}°C。
      请根据混合物和温度分析安全性，说明是否存在热分解、爆炸风险或反应加速。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reaction: { type: Type.STRING, description: "对观察到的反应的简短描述" },
            riskScore: { type: Type.NUMBER, description: "0-100 的风险分数" },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "安全警告列表" },
            explanation: { type: Type.STRING, description: "科学原理的详细解释（请务必提到温度的影响）" },
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

/**
 * 知识百科服务
 * 功能：为学生提供化学概念的趣味解释与方程式记忆辅助
 */
export const getKnowledgeCard = async (topic: string) => {
  try {
    /** 
     * 调用点：使用统一的 ai 实例获取百科知识
     */
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
    console.error("Gemini 知识卡片获取失败:", error);
    return null;
  }
};
