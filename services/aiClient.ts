
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini AI 客户端初始化模块
 * 
 * 根据开发规范，API 密钥统一通过 process.env.API_KEY 获取。
 * 此文件导出的 'ai' 实例将被整个应用共享，用于调用生成内容、分析等功能。
 */

// 初始化工厂函数：确保从环境变量中正确加载 API Key
const initAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("未检测到 API_KEY 环境变量，请确保在受支持的环境中运行。");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

// 导出全局单例实例
export const ai = initAiClient();

// 如果需要动态获取最新实例（例如在使用特定高级模型前），可以使用此函数
export const getFreshAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
