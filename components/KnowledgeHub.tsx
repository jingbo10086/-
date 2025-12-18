
import React, { useState } from 'react';
import { getKnowledgeCard } from '../services/geminiService';

const KnowledgeHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const data = await getKnowledgeCard(query);
    setCard(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">化学方程式大师 AI</h2>
        <p className="text-slate-500">询问任何化学反应或方程式，深入学习化学知识。</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 flex gap-4">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例如：光合作用、酸碱中和反应..."
          className="flex-1 px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          disabled={loading}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : '咨询 AI'}
        </button>
      </form>

      {card && (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{card.title}</h3>
            </div>
            
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-lg text-slate-600 leading-relaxed">{card.explanation}</p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <i className="fas fa-flask text-6xl text-white"></i>
               </div>
               <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">关键方程式</h4>
               <div className="text-2xl md:text-3xl font-mono text-white text-center py-4">
                 {card.equation}
               </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
               <i className="fas fa-lightbulb text-yellow-500 text-xl mt-1"></i>
               <div>
                 <h5 className="font-bold text-yellow-800 mb-1">趣味知识</h5>
                 <p className="text-yellow-700">{card.funFact}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {!card && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
          {[
            { label: '酸碱滴定', desc: '了解滴定过程及其化学原理。' },
            { label: '共价键', desc: '探索原子间电子共享的奥秘。' },
            { label: '新陈代谢', desc: '生物体内的生化反应网络。' }
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => { setQuery(item.label); }}
              className="p-6 bg-white rounded-2xl border border-slate-100 text-left hover:border-indigo-300 transition-colors"
            >
              <h4 className="font-bold mb-1">{item.label}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeHub;
