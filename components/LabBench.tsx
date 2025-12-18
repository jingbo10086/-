
import React, { useState, useEffect, useMemo } from 'react';
import { REAGENTS } from '../constants';
import { Reagent } from '../types';
import { analyzeSafety } from '../services/geminiService';

const CATEGORIES = [
  { id: 'all', name: '全部', icon: 'fa-th-large' },
  { id: 'acid', name: '酸类', icon: 'fa-dropper' },
  { id: 'base', name: '碱类', icon: 'fa-vial' },
  { id: 'metal', name: '金属', icon: 'fa-cube' },
  { id: 'salt', name: '盐类', icon: 'fa-mortar-pestle' },
  { id: 'oxidizer', name: '氧化', icon: 'fa-bolt' },
  { id: 'organic', name: '有机', icon: 'fa-leaf' },
  { id: 'indicator', name: '指示剂', icon: 'fa-eye' },
];

const LabBench: React.FC = () => {
  const [flask, setFlask] = useState<Reagent[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiColor, setAiColor] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredReagents = useMemo(() => {
    if (activeCategory === 'all') return REAGENTS;
    return REAGENTS.filter(r => r.category === activeCategory);
  }, [activeCategory]);

  const addToFlask = (reagent: Reagent) => {
    // 限制烧瓶内试剂数量，防止分析过于复杂
    if (flask.length >= 6) {
      alert("烧瓶已满，请清空后再尝试新实验！");
      return;
    }
    setFlask([...flask, reagent]);
  };

  const clearFlask = () => {
    setFlask([]);
    setAnalysis(null);
    setAiColor(null);
  };

  const fallbackColor = useMemo(() => {
    if (flask.length === 0) return 'bg-transparent';
    return flask[flask.length - 1].color;
  }, [flask]);

  const currentLiquidColor = aiColor || fallbackColor;

  // 动态计算烧瓶区域的风险样式
  const flaskAreaStyles = useMemo(() => {
    if (flask.length === 0) {
      return {
        container: "bg-indigo-50/50 border-indigo-200",
        pulse: "bg-indigo-500/5",
        text: "text-indigo-600"
      };
    }
    
    const maxDanger = Math.max(...flask.map(r => r.dangerLevel));
    
    if (maxDanger > 70) {
      return {
        container: "bg-red-50 border-red-300 ring-4 ring-red-500/5",
        pulse: "bg-red-500/10",
        text: "text-red-600"
      };
    } else if (maxDanger > 30) {
      return {
        container: "bg-orange-50 border-orange-200",
        pulse: "bg-orange-500/5",
        text: "text-orange-600"
      };
    } else {
      return {
        container: "bg-green-50 border-green-200",
        pulse: "bg-green-500/5",
        text: "text-green-600"
      };
    }
  }, [flask]);

  useEffect(() => {
    const runAnalysis = async () => {
      if (flask.length < 2) {
        setAnalysis(null);
        setAiColor(null);
        return;
      }
      setLoading(true);
      const result = await analyzeSafety(flask);
      if (result) {
        setAnalysis(result);
        if (result.newColor) setAiColor(result.newColor);
      }
      setLoading(false);
    };

    const timeout = setTimeout(runAnalysis, 1000);
    return () => clearTimeout(timeout);
  }, [flask]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 精美试剂架 */}
        <div className="lg:col-span-4 flex flex-col h-[650px] bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-box-archive text-indigo-500"></i> 智能试剂架
            </h3>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <i className={`fas ${cat.icon}`}></i>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredReagents.map(reagent => (
              <div
                key={reagent.id}
                onClick={() => addToFlask(reagent)}
                className="group relative flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl ${reagent.color} border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-inner overflow-hidden`}>
                  <span className="text-[10px] break-all text-center leading-none px-1">{reagent.formula}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-slate-700 truncate">{reagent.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${reagent.dangerLevel > 70 ? 'bg-red-500' : reagent.dangerLevel > 30 ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${reagent.dangerLevel}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">危险: {reagent.dangerLevel}%</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 text-indigo-400">
                  <i className="fas fa-plus-circle"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 核心实验区 */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className={`${flaskAreaStyles.container} transition-colors duration-700 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 relative overflow-hidden h-[650px]`}>
             {loading && <div className={`absolute inset-0 ${flaskAreaStyles.pulse} animate-pulse`}></div>}
             
             <div className="absolute top-6 right-6 flex gap-2 z-10">
                <button onClick={clearFlask} className="w-10 h-10 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center">
                  <i className="fas fa-trash-can"></i>
                </button>
             </div>

             {loading && (
               <div className="absolute top-20 left-0 right-0 text-center animate-bounce z-10">
                 <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-2 w-max mx-auto">
                   <i className="fas fa-microchip animate-spin"></i>
                   AI 正在分析反应...
                 </span>
               </div>
             )}

             <div className="relative w-56 h-72 border-b-8 border-l-8 border-r-8 border-slate-300 rounded-b-[4rem] bg-white/30 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-2xl transition-all duration-500">
                {loading && (
                  <div className="absolute inset-x-0 h-1 bg-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.8)] z-20 animate-[scan_2s_infinite]"></div>
                )}

                <div 
                  className={`w-full liquid-anim ${currentLiquidColor} relative overflow-hidden`} 
                  style={{ height: `${Math.min(flask.length * 15, 90)}%` }}
                >
                  {loading && (
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute bg-white/40 rounded-full animate-[bubble_3s_infinite]"
                          style={{
                            width: `${Math.random() * 8 + 4}px`,
                            height: `${Math.random() * 8 + 4}px`,
                            left: `${Math.random() * 100}%`,
                            bottom: '-10%',
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.5
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                  {analysis && !loading && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                </div>
                
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-[1px] bg-slate-400"></div>
                      <span className="text-[8px] font-bold text-slate-400">{1000 - i * 125}ml</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="mt-8 text-center max-w-xs z-10">
                <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">实验核心反应器</h4>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {flask.map((f, i) => (
                    <span key={i} className={`px-3 py-1 bg-white rounded-lg text-xs font-bold ${flaskAreaStyles.text} shadow-sm border border-indigo-50 animate-in zoom-in-50`}>
                      {f.name}
                    </span>
                  ))}
                  {flask.length === 0 && <span className="text-slate-400 italic text-sm">暂无添加试剂</span>}
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 overflow-y-auto h-[650px] custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">
                <i className="fas fa-shield-virus text-green-500 mr-2"></i> 安全官报告
              </h3>
              {analysis && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${analysis.riskScore > 70 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {analysis.riskScore > 70 ? '极高风险' : '受控范围'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center py-20">
                   <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <i className="fas fa-bolt text-indigo-400 text-xl animate-pulse"></i>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-indigo-900">正在云端分析分子特性</p>
                        <p className="text-[10px] text-indigo-400 mt-1 uppercase tracking-widest">Generating Insight...</p>
                      </div>
                   </div>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-400">综合风险系数</span>
                      <span className={`text-3xl font-black ${analysis.riskScore > 70 ? 'text-red-500' : 'text-indigo-600'}`}>
                        {analysis.riskScore}%
                      </span>
                   </div>
                   <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${analysis.riskScore > 70 ? 'bg-red-500' : 'bg-indigo-500'}`}
                        style={{ width: `${analysis.riskScore}%` }}
                      ></div>
                   </div>
                </div>

                <section>
                   <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">实验观察</h5>
                   <p className="text-lg font-bold text-slate-700 leading-tight">"{analysis.reaction}"</p>
                </section>

                {analysis.warnings.length > 0 && (
                  <section className="p-5 bg-red-50 rounded-2xl border border-red-100">
                    <h5 className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">关键警报</h5>
                    <ul className="space-y-3">
                      {analysis.warnings.map((w: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-red-700 font-medium">
                          <i className="fas fa-triangle-exclamation mt-1"></i>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                   <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">科学原理解析</h5>
                   <div className="text-sm text-slate-600 leading-relaxed bg-indigo-50/30 p-4 rounded-2xl">
                      {analysis.explanation}
                   </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-microscope text-4xl opacity-20"></i>
                </div>
                <p className="text-sm font-medium">请从左侧试剂架选择至少两种试剂</p>
                <p className="text-[10px] mt-2 text-slate-400 text-center px-6">AI 将基于最新化学研究数据为您提供实时实验结果推演</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabBench;
