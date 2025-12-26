
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { getHealthAssistantResponse } from '../services/geminiService';
import { Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
  externalHistory: ChatMessage[];
  onUpdateHistory: (history: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

const HealthAssistant: React.FC<Props> = ({ lang, externalHistory, onUpdateHistory }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [externalHistory, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    onUpdateHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const historyForAi = externalHistory.map(m => ({ role: m.role, text: m.text }));
    const aiResponse = await getHealthAssistantResponse(input, historyForAi, lang);
    
    onUpdateHistory(prev => [...prev, { role: 'model', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-slate-50 rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Premium Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-100 ring-4 ring-teal-50">
            <Bot size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-black text-slate-800 tracking-tight">MedCenter Consultant</p>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                <ShieldCheck size={10} fill="currentColor" className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Verified AI</span>
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Senior Clinical Support</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {externalHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
              <ClipboardCheck size={40} className="text-slate-400" />
            </div>
            <p className="text-slate-500 max-w-[250px] font-bold text-lg leading-snug">{t.chatPlaceholder}</p>
          </div>
        )}
        
        {externalHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[80%] flex items-start gap-3">
                <div className="p-4 bg-teal-600 text-white rounded-[1.5rem] rounded-tr-none shadow-lg shadow-teal-100 font-medium text-sm">
                  {m.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <User size={16} />
                </div>
              </div>
            ) : (
              <div className="max-w-[90%] w-full flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 flex-shrink-0 shadow-sm mt-1">
                  <Bot size={20} />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] rounded-tl-none overflow-hidden shadow-sm">
                  {/* AI Response Header/Theming */}
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Response</span>
                    <span className="text-[10px] font-bold text-teal-600">MedCenter Professional AI</span>
                  </div>
                  <div className="p-6 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {m.text}
                  </div>
                  <div className="px-6 py-3 bg-teal-50/30 border-t border-teal-50 flex items-center gap-2">
                    <Sparkles size={12} className="text-teal-500" />
                    <span className="text-[9px] font-bold text-teal-700/60 uppercase">Certified System Intelligence</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-4 max-w-[90%] w-full">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] rounded-tl-none p-6 shadow-sm">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-teal-200 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-teal-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Input Block */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="w-full pl-6 pr-16 py-5 bg-slate-50 rounded-[2rem] focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 border-2 border-slate-100 focus:border-teal-500 transition-all text-sm font-semibold text-slate-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-200 hover:bg-teal-700 transition-all shadow-lg active:scale-95 z-10"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthAssistant;
