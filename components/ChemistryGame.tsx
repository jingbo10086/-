
import React, { useState, useEffect } from 'react';

const ELEMENTS = [
  { symbol: 'H', color: 'bg-blue-400', name: '氢' },
  { symbol: 'O', color: 'bg-red-400', name: '氧' },
  { symbol: 'C', color: 'bg-slate-700', name: '碳' },
  { symbol: 'N', color: 'bg-purple-400', name: '氮' },
];

const ChemistryGame: React.FC = () => {
  const [grid, setGrid] = useState<any[][]>([]);
  const [score, setScore] = useState(0);
  const GRID_SIZE = 6;

  const initGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => 
      Array(GRID_SIZE).fill(0).map(() => ({
        ...ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)],
        id: Math.random()
      }))
    );
    setGrid(newGrid);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const handleCellClick = (r: number, c: number) => {
    const target = grid[r][c];
    const matches: [number, number][] = [[r, c]];
    
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    directions.forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        if (grid[nr][nc].symbol === target.symbol) {
          matches.push([nr, nc]);
        }
      }
    });

    if (matches.length >= 2) {
      const newGrid = [...grid.map(row => [...row])];
      matches.forEach(([mr, mc]) => {
        newGrid[mr][mc] = { ...ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)], id: Math.random() };
      });
      setGrid(newGrid);
      setScore(s => s + matches.length * 10);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">原子消除乐</h2>
          <p className="text-slate-500">点击组合相同的原子来触发反应！</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">得分</div>
          <div className="text-4xl font-black text-indigo-600">{score}</div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border-8 border-slate-800">
        <div className="grid grid-cols-6 gap-2">
          {grid.map((row, r) => row.map((cell, c) => (
            <button
              key={cell.id}
              onClick={() => handleCellClick(r, c)}
              className={`${cell.color} aspect-square rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner hover:scale-105 active:scale-95 transition-all`}
            >
              {cell.symbol}
            </button>
          )))}
        </div>
      </div>

      <div className="mt-10 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl text-indigo-600">
          <i className="fas fa-trophy"></i>
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">实验室趣味化学习</h4>
          <p className="text-sm text-indigo-700">消除元素以了解分子键合。高分可解锁虚拟实验室的新试剂！</p>
        </div>
      </div>
    </div>
  );
};

export default ChemistryGame;
