
export interface Reagent {
  id: string;
  name: string;
  formula: string;
  color: string;
  state: 'solid' | 'liquid' | 'gas';
  dangerLevel: number; // 0-100
  category: 'acid' | 'base' | 'salt' | 'metal' | 'oxidizer' | 'water' | 'organic' | 'indicator';
  description?: string;
}

export interface LabState {
  currentFlask: Reagent[];
  temperature: number;
  riskLevel: number; // 0-100
  isReacting: boolean;
  warnings: string[];
  reactionResult: string;
}

export interface GameElement {
  id: number;
  type: string;
  symbol: string;
  color: string;
}

export enum AppTab {
  LAB = 'lab',
  KNOWLEDGE = 'knowledge',
  GAME = 'game'
}
