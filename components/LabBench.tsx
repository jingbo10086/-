
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
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);

  const filteredReagents = useMemo(() => {
    if (activeCategory === 'all') return REAGENTS;
    return REAGENTS.filter(r => r.category === activeCategory);
  }, [activeCategory]);

  const addToFlask = (reagent: Reagent) => {
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
    setTemperature(25);
    setIsHeating(false);
  };

  const fallbackColor = useMemo(() => {
    if (flask.length === 0) return 'bg-transparent';
    return flask[flask.length - 1].color;
  }, [flask]);

  const currentLiquidColor = aiColor || fallbackColor;

  // 动态计算风险样式，加入温度因素
  const flaskAreaStyles = useMemo(() => {
    const maxDanger = flask.length > 0 ? Math.max(...flask.map(r => r.dangerLevel)) : 0;
    // 温度也会增加风险基础值，每 100 度增加 15 点潜在风险感
    const effectiveRisk = maxDanger + (temperature - 25) / 5;

    if (flask.length === 0) {
      return {
        container: "bg-indigo-50/50 border-indigo-200",
        pulse: "bg-indigo-500/5",
        text: "text-indigo-600",
        glow: "shadow-none"
      };
    }
    
    if (effectiveRisk > 70) {
      return {
        container: "bg-red-50 border-red-300 ring-4 ring-red-500/5",
        pulse: "bg-red-500/10",
        text: "text-red-600",
        glow: "shadow-[0_0_50px_rgba(239,68,68,0.2)]"
      };
    } else if (effectiveRisk > 30) {
      return {
        container: "bg-orange-50 border-orange-200",
        pulse: "bg-orange-500/5",
        text: "text-orange-600",
        glow: "shadow-[0_0_30px_rgba(249,115,22,0.1)]"
      };
    } else {
      return {
        container: "bg-green-50 border-green-200",
        pulse: "bg-green-500/5",
        text: "text-green-600",
        glow: "shadow-none"
      };
    }
  }, [flask, temperature]);

  useEffect(() => {
    const runAnalysis = async () => {
      if (flask.length < 1) { // 即使只有一种试剂，加热也可能有反应（如分解）
        if (flask.length === 0) {
          setAnalysis(null);
          setAiColor(null);
        }
        return;
      }
      setLoading(true);
      const result = await analyzeSafety(flask, temperature);
      if (result) {
        setAnalysis(result);
        if (result.newColor) setAiColor(result.newColor);
      }
      setLoading(false);
    };

    const timeout = setTimeout(runAnalysis, 1200);
    return () => clearTimeout(timeout);
  }, [flask, temperature]);

  // 加热逻辑
  useEffect(() => {
    let interval: any;
    if (isHeating) {
      interval = setInterval(() => {
        setTemperature(prev => Math.min(prev + Math.floor(Math.random() * 5 + 2), 500));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isHeating]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 精美试剂架 */}
        <div className="lg:col-span-4 flex flex-col h-[700px] bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-box-archive text-indigo-500"></i> 智能试剂架
              </h3>
              <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">V2.4</span>
            </div>
            
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
                  <span className="text-[10px] break-all text-center leading-none px-1 font-mono">{reagent.formula}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-700 truncate block">{reagent.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${reagent.dangerLevel > 70 ? 'bg-red-500' : reagent.dangerLevel > 30 ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${reagent.dangerLevel}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">风险: {reagent.dangerLevel}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 核心实验区 */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className={`${flaskAreaStyles.container} ${flaskAreaStyles.glow} transition-all duration-700 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center p-8 relative overflow-hidden h-[700px]`}>
             {loading && <div className={`absolute inset-0 ${flaskAreaStyles.pulse} animate-pulse`}></div>}
             
             {/* 顶部控制栏 */}
             <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                  <i className={`fas fa-thermometer-half ${temperature > 100 ? 'text-red-500' : 'text-blue-500'} animate-pulse`}></i>
                  <span className="text-lg font-black font-mono text-slate-700">{temperature}°C</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setTemperature(25)} className="w-10 h-10 bg-white rounded-full shadow-sm text-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center" title="快速冷却">
                    <i className="fas fa-snowflake"></i>
                  </button>
                  <button onClick={clearFlask} className="w-10 h-10 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center">
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
             </div>

             {loading && (
               <div className="absolute top-24 left-0 right-0 text-center animate-bounce z-10">
                 <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-2 w-max mx-auto">
                   <i className="fas fa-brain animate-spin"></i>
                   AI 正在计算分子动能...
                 </span>
               </div>
             )}

             {/* 烧瓶支架与加热器 */}
             <div className="relative mt-12 flex flex-col items-center">
                <div className="relative w-56 h-72 border-b-8 border-l-8 border-r-8 border-slate-300 rounded-b-[4rem] bg-white/30 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-2xl transition-all duration-500 z-10">
                   {loading && (
                     <div className="absolute inset-x-0 h-1 bg-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.8)] z-20 animate-[scan_2s_infinite]"></div>
                   )}

                   <div 
                     className={`w-full liquid-anim ${currentLiquidColor} relative overflow-hidden`} 
                     style={{ height: `${Math.min(flask.length * 15, 90)}%` }}
                   >
                     {/* 气泡受温度影响 */}
                     {(loading || temperature > 60) && (
                       <div className="absolute inset-0">
                         {[...Array(Math.floor(temperature / 20))].map((_, i) => (
                           <div 
                             key={i} 
                             className="absolute bg-white/40 rounded-full animate-[bubble_2s_infinite]"
                             style={{
                               width: `${Math.random() * 6 + 2}px`,
                               height: `${Math.random() * 6 + 2}px`,
                               left: `${Math.random() * 100}%`,
                               bottom: '-10%',
                               animationDelay: `${Math.random() * 2}s`,
                               animationDuration: `${Math.max(0.5, 3 - temperature/200)}s`
                             }}
                           ></div>
                         ))}
                       </div>
                     )}
                   </div>
                   
                   <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none opacity-30">
                     {[...Array(8)].map((_, i) => (
                       <div key={i} className="flex items-center gap-2">
                         <div className="w-4 h-[1px] bg-slate-400"></div>
                       </div>
                     ))}
                   </div>
                </div>
                
                {/* 加热底座 */}
                <div className="w-64 h-8 bg-slate-800 rounded-full -mt-2 shadow-lg relative overflow-hidden border-t border-slate-600">
                  {isHeating && (
                    <div className="absolute inset-0 flex justify-around items-end px-4">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  )}
                </div>
             </div>

             <div className="mt-12 flex flex-col items-center gap-4 w-full px-12 z-10">
                <button 
                  onMouseDown={() => setIsHeating(true)}
                  onMouseUp={() => setIsHeating(false)}
                  onMouseLeave={() => setIsHeating(false)}
                  className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg ${isHeating ? 'bg-orange-600 scale-105 shadow-orange-200' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  <i className={`fas fa-fire-flame-curved mr-2 ${isHeating ? 'animate-bounce' : ''}`}></i>
                  {isHeating ? '持续加热中...' : '按住开始加热'}
                </button>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {flask.map((f, i) => (
                    <span key={i} className={`px-3 py-1 bg-white rounded-lg text-xs font-bold ${flaskAreaStyles.text} shadow-sm border border-slate-100 animate-in zoom-in-50`}>
                      {f.name}
                    </span>
                  ))}
                </div>
             </div>
          </div>

          {/* AI 报告面板 */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 overflow-y-auto h-[700px] custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">
                <i className="fas fa-shield-virus text-green-500 mr-2"></i> 安全官报告
              </h3>
              {analysis && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${analysis.riskScore > 70 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {analysis.riskScore > 70 ? '危急' : '安全'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center py-20">
                   <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-indigo-900">评估热力学平衡...</p>
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
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-temperature-arrow-up text-4xl opacity-20"></i>
                </div>
                <p className="text-sm font-medium px-10">添加试剂并尝试加热。AI 将实时计算由于温度升高带来的化学键能变化。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabBench;
