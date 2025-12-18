
import { Reagent } from './types';

export const REAGENTS: Reagent[] = [
  { id: '1', name: '水', formula: 'H2O', color: 'bg-blue-200', state: 'liquid', dangerLevel: 0, category: 'water' },
  { id: '2', name: '盐酸', formula: 'HCl', color: 'bg-yellow-100', state: 'liquid', dangerLevel: 60, category: 'acid' },
  { id: '3', name: '氢氧化钠', formula: 'NaOH', color: 'bg-slate-100', state: 'liquid', dangerLevel: 70, category: 'base' },
  { id: '4', name: '钠', formula: 'Na', color: 'bg-slate-400', state: 'solid', dangerLevel: 95, category: 'metal' },
  { id: '5', name: '硫酸', formula: 'H2SO4', color: 'bg-orange-100', state: 'liquid', dangerLevel: 90, category: 'acid' },
  { id: '6', name: '高锰酸钾', formula: 'KMnO4', color: 'bg-purple-600', state: 'solid', dangerLevel: 50, category: 'oxidizer' },
  { id: '7', name: '硫酸铜', formula: 'CuSO4', color: 'bg-blue-600', state: 'solid', dangerLevel: 30, category: 'salt' },
  { id: '8', name: '氨水', formula: 'NH3', color: 'bg-slate-200', state: 'liquid', dangerLevel: 45, category: 'base' },
];

export const SYSTEM_PROMPT = `你是一位世界顶级的 AI 化学安全官。
你的任务是监控虚拟实验室。
当试剂混合时，你必须：
1. 识别化学反应（如果有）。
2. 计算风险评分（0-100）。
3. 如果混合物危险（例如 Na + H2O 极易爆炸），提供安全警告。
4. 解释反应背后的科学原理。
请务必使用中文返回 JSON 格式的响应。`;
