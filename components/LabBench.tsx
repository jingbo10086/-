
import React, { useState, useEffect } from 'react';
import { REAGENTS } from '../constants';
import { Reagent, LabState } from '../types';
import { analyzeSafety } from '../services/geminiService';

const LabBench: React.FC = () => {
  const [flask, setFlask] = useState<Reagent[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mixColor, setMixColor] = useState('bg-white');

  const addToFlask = (reagent: Reagent) => {
    setFlask([...flask, reagent]);
  };

  const clearFlask = () => {
    setFlask([]);
    setAnalysis(null);
    setMixColor('bg-white');
  };

  useEffect(() => {
    const runAnalysis = async () => {
      if (flask.length < 2) return;
      setLoading(true);
      const result = await analyzeSafety(flask);
      if (result) {
        setAnalysis(result);
        if (result.newColor) setMixColor(result.newColor);
      }
      setLoading(false);
    };

    const timeout = setTimeout(runAnalysis, 1000);
    return () => clearTimeout(timeout);
  }, [flask]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 试剂架 */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-vial text-indigo-500"></i> 试剂架
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {REAGENTS.map(reagent => (
            <button
              key={reagent.id}
              onClick={() => addToFlask(reagent)}
              className="p-3 text-left border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`w-3 h-3 rounded-full ${reagent.color}`}></span>
                <span className="text-[10px] font-bold text-slate-400">{reagent.formula}</span>
              </div>
              <div className="text-sm font-semibold truncate">{reagent.name}</div>
              <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">
                危险等级: {reagent.dangerLevel}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 主烧杯区域 */}
      <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-indigo-50/30 rounded-3xl border-2 border-dashed border-indigo-100 min-h-[500px] relative overflow-hidden">
        <div className="absolute top-4 right-4">
           <button 
            onClick={clearFlask}
            title="清空烧瓶"
            className="p-2 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow-sm"
           >
             <i className="fas fa-redo"></i>
           </button>
        </div>

        {/* 烧杯可视化 */}
        <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-slate-300 rounded-b-3xl bg-white/20 overflow-hidden flex flex-col justify-end">
          <div 
            className={`w-full liquid-anim ${flask.length > 0 ? (analysis?.newColor || mixColor) : 'bg-transparent'}`} 
            style={{ height: `${Math.min(flask.length * 15, 95)}%` }}
          >
            {/* 反应时的动画气泡 */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <i className="fas fa-spinner fa-spin text-white/50 text-2xl"></i>
              </div>
            )}
          </div>
          {/* 烧杯刻度线 */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 px-1 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-[1px] bg-slate-300"></div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h4 className="text-lg font-bold text-slate-700">实验烧瓶</h4>
          <p className="text-sm text-slate-500">
            {flask.length === 0 ? "添加试剂开始实验" : `已添加 ${flask.length} 种成分`}
          </p>
        </div>

        {/* 危险警报层 */}
        {analysis?.riskScore > 70 && (
          <div className="absolute top-10 animate-bounce bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="font-bold">严重风险</span>
          </div>
        )}
      </div>

      {/* 安全与逻辑分析 */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-y-auto max-h-[600px]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-shield-halved text-green-500"></i> 安全分析报告
        </h3>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-24 bg-slate-100 rounded w-full"></div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-500">风险评分</span>
                <span className={`text-xl font-black ${analysis.riskScore > 70 ? 'text-red-500' : analysis.riskScore > 40 ? 'text-orange-500' : 'text-green-500'}`}>
                  {analysis.riskScore}/100
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${analysis.riskScore > 70 ? 'bg-red-500' : analysis.riskScore > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                  style={{ width: `${analysis.riskScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">实验现象</h4>
              <p className="text-slate-700 font-medium italic">"{analysis.reaction}"</p>
            </div>

            {analysis.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-2">安全警告</h4>
                <ul className="space-y-2">
                  {analysis.warnings.map((w: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <i className="fas fa-circle-exclamation text-red-400 mt-1"></i>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-2">科学原理解析</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.explanation}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <i className="fas fa-microscope text-5xl mb-4 opacity-20"></i>
            <p className="text-sm text-center">混合两种或多种化学物质以查看实时 AI 安全分析</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabBench;
