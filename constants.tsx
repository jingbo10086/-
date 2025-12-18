
import { Reagent } from './types';

export const REAGENTS: Reagent[] = [
  // 酸类 (Acids)
  { id: 'a1', name: '稀盐酸', formula: 'HCl', color: 'bg-yellow-50', state: 'liquid', dangerLevel: 30, category: 'acid' },
  { id: 'a2', name: '浓硫酸', formula: 'H2SO4', color: 'bg-orange-200', state: 'liquid', dangerLevel: 95, category: 'acid' },
  { id: 'a3', name: '浓硝酸', formula: 'HNO3', color: 'bg-yellow-100', state: 'liquid', dangerLevel: 90, category: 'acid' },
  { id: 'a4', name: '醋酸', formula: 'CH3COOH', color: 'bg-slate-50', state: 'liquid', dangerLevel: 20, category: 'acid' },
  { id: 'a5', name: '磷酸', formula: 'H3PO4', color: 'bg-blue-50', state: 'liquid', dangerLevel: 40, category: 'acid' },
  
  // 碱类 (Bases)
  { id: 'b1', name: '氢氧化钠', formula: 'NaOH', color: 'bg-white', state: 'solid', dangerLevel: 80, category: 'base' },
  { id: 'b2', name: '氢氧化钾', formula: 'KOH', color: 'bg-white', state: 'solid', dangerLevel: 85, category: 'base' },
  { id: 'b3', name: '氨水', formula: 'NH3·H2O', color: 'bg-slate-100', state: 'liquid', dangerLevel: 40, category: 'base' },
  { id: 'b4', name: '氢氧化钙', formula: 'Ca(OH)2', color: 'bg-slate-200', state: 'solid', dangerLevel: 20, category: 'base' },
  { id: 'b5', name: '氢氧化钡', formula: 'Ba(OH)2', color: 'bg-slate-50', state: 'solid', dangerLevel: 60, category: 'base' },

  // 金属 (Metals)
  { id: 'm1', name: '金属钠', formula: 'Na', color: 'bg-zinc-400', state: 'solid', dangerLevel: 98, category: 'metal' },
  { id: 'm2', name: '金属钾', formula: 'K', color: 'bg-zinc-500', state: 'solid', dangerLevel: 100, category: 'metal' },
  { id: 'm3', name: '镁条', formula: 'Mg', color: 'bg-slate-300', state: 'solid', dangerLevel: 30, category: 'metal' },
  { id: 'm4', name: '铝粉', formula: 'Al', color: 'bg-gray-200', state: 'solid', dangerLevel: 20, category: 'metal' },
  { id: 'm5', name: '锌粒', formula: 'Zn', color: 'bg-gray-400', state: 'solid', dangerLevel: 15, category: 'metal' },
  { id: 'm6', name: '铁粉', formula: 'Fe', color: 'bg-zinc-700', state: 'solid', dangerLevel: 10, category: 'metal' },
  { id: 'm7', name: '铜片', formula: 'Cu', color: 'bg-orange-600', state: 'solid', dangerLevel: 5, category: 'metal' },

  // 盐类 (Salts)
  { id: 's1', name: '氯化钠', formula: 'NaCl', color: 'bg-white', state: 'solid', dangerLevel: 0, category: 'salt' },
  { id: 's2', name: '硫酸铜', formula: 'CuSO4', color: 'bg-blue-500', state: 'solid', dangerLevel: 40, category: 'salt' },
  { id: 's3', name: '氯化钡', formula: 'BaCl2', color: 'bg-white', state: 'solid', dangerLevel: 75, category: 'salt' },
  { id: 's4', name: '硝酸银', formula: 'AgNO3', color: 'bg-slate-100', state: 'solid', dangerLevel: 65, category: 'salt' },
  { id: 's5', name: '碳酸钠', formula: 'Na2CO3', color: 'bg-white', state: 'solid', dangerLevel: 10, category: 'salt' },
  { id: 's6', name: '碳酸氢钠', formula: 'NaHCO3', color: 'bg-white', state: 'solid', dangerLevel: 5, category: 'salt' },
  { id: 's7', name: '氯化铁', formula: 'FeCl3', color: 'bg-orange-800', state: 'solid', dangerLevel: 50, category: 'salt' },
  { id: 's8', name: '碘化钾', formula: 'KI', color: 'bg-white', state: 'solid', dangerLevel: 20, category: 'salt' },

  // 氧化剂 (Oxidizers)
  { id: 'o1', name: '高锰酸钾', formula: 'KMnO4', color: 'bg-purple-900', state: 'solid', dangerLevel: 70, category: 'oxidizer' },
  { id: 'o2', name: '过氧化氢', formula: 'H2O2', color: 'bg-cyan-50', state: 'liquid', dangerLevel: 55, category: 'oxidizer' },
  { id: 'o3', name: '氯酸钾', formula: 'KClO3', color: 'bg-white', state: 'solid', dangerLevel: 80, category: 'oxidizer' },
  { id: 'o4', name: '二氧化锰', formula: 'MnO2', color: 'bg-black', state: 'solid', dangerLevel: 10, category: 'oxidizer' },

  // 有机物 (Organics)
  { id: 'org1', name: '乙醇', formula: 'C2H5OH', color: 'bg-blue-50/50', state: 'liquid', dangerLevel: 45, category: 'organic' },
  { id: 'org2', name: '苯', formula: 'C6H6', color: 'bg-yellow-50/30', state: 'liquid', dangerLevel: 90, category: 'organic' },
  { id: 'org3', name: '葡萄糖', formula: 'C6H12O6', color: 'bg-white', state: 'solid', dangerLevel: 0, category: 'organic' },

  // 指示剂 (Indicators)
  { id: 'ind1', name: '酚酞', formula: 'C20H14O4', color: 'bg-pink-100', state: 'liquid', dangerLevel: 10, category: 'indicator' },
  { id: 'ind2', name: '石蕊溶液', formula: 'Litmus', color: 'bg-purple-500', state: 'liquid', dangerLevel: 5, category: 'indicator' },
  { id: 'ind3', name: '甲基橙', formula: 'C14H14N3NaO3S', color: 'bg-orange-500', state: 'liquid', dangerLevel: 15, category: 'indicator' },

  // 水 (Water)
  { id: 'w1', name: '蒸馏水', formula: 'H2O', color: 'bg-blue-100', state: 'liquid', dangerLevel: 0, category: 'water' },
];

export const SYSTEM_PROMPT = `你是一位世界顶级的 AI 化学安全官。
你的任务是监控虚拟实验室。
当试剂混合时，你必须：
1. 识别化学反应（如果有）。
2. 计算风险评分（0-100）。
3. 如果混合物危险，提供安全警告。
4. 解释反应背后的科学原理。
5. 必须推测反应后的混合物颜色，返回一个符合 Tailwind CSS 的背景颜色类名（例如 'bg-red-500'）。
请务必使用中文返回 JSON 格式的响应。`;
