
import React, { useState } from 'react';
import LabBench from './components/LabBench';
import KnowledgeHub from './components/KnowledgeHub';
import ChemistryGame from './components/ChemistryGame';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LAB);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.LAB: return <LabBench />;
      case AppTab.KNOWLEDGE: return <KnowledgeHub />;
      case AppTab.GAME: return <ChemistryGame />;
      default: return <LabBench />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部 */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fas fa-flask-vial text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">智能化学实验室 AI</h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI 核心已就绪</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100/50 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab(AppTab.LAB)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === AppTab.LAB ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fas fa-vials mr-2"></i> 虚拟实验室
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.KNOWLEDGE)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === AppTab.KNOWLEDGE ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fas fa-brain mr-2"></i> 知识百科
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.GAME)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === AppTab.GAME ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <i className="fas fa-gamepad mr-2"></i> 原子游戏
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400">风险缓解模式</span>
              <span className="text-xs text-indigo-500 font-medium">自动防护已开启</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/seed/lab/40/40" alt="用户头像" />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {renderContent()}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <i className="fas fa-atom text-white text-sm"></i>
              </div>
              <h2 className="text-lg font-bold text-slate-800">智能化学 AI 项目</h2>
            </div>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              将先进的 AI 推理与交互式化学模拟相结合，为学生和研究人员提供安全、有趣且具有教育意义的实验体验。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">快速链接</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">安全指南</li>
              <li className="hover:text-indigo-600 cursor-pointer">试剂数据库</li>
              <li className="hover:text-indigo-600 cursor-pointer">全球排行榜</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">系统状态</h4>
            <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold text-green-700">Gemini 3.0 Flash: 运行中</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs font-medium">
          <p>© 2024 智能化学实验室 AI 项目。科技赋能安全实验。</p>
          <div className="flex gap-4">
            <i className="fab fa-github cursor-pointer hover:text-slate-600"></i>
            <i className="fab fa-twitter cursor-pointer hover:text-slate-600"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
