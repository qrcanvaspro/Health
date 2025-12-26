
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, ShieldCheck, ClipboardCheck, Award, FileText } from 'lucide-react';
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

    try {
      const historyForAi = externalHistory.map(m => ({ role: m.role, text: m.text }));
      const aiResponse = await getHealthAssistantResponse(input, historyForAi, lang);
      onUpdateHistory(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      onUpdateHistory(prev => [...prev, { role: 'model', text: lang === Language.EN ? "Service interruption." : "सेवा बाधित।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-pattern">
      {/* Consultant Letterhead Header */}
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b-4 border-teal-600">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-teal-500/20">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl tracking-tight">Dr. Manish Yadav AI</h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-500 text-white rounded-full">
                <Award size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">Lead Consultant</span>
              </div>
            </div>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em] mt-0.5">Verified Medical Center Report</p>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-end">
          <p className="text-[10px] font-black text-slate-500 uppercase">Consultation ID</p>
          <p className="text-xs font-bold text-slate-300 font-mono tracking-tighter">MY-AI-88219</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-12 scroll-smooth">
        {externalHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-30">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center border border-slate-200">
              <ClipboardCheck size={48} className="text-slate-400" />
            </div>
            <p className="text-slate-500 max-w-[280px] font-bold text-xl leading-snug">{t.chatPlaceholder}</p>
          </div>
        )}
        
        {externalHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[80%] group">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Inquiry</span>
                  <User size={12} className="text-slate-400" />
                </div>
                <div className="p-5 bg-slate-900 text-white rounded-3xl rounded-tr-none shadow-xl font-bold text-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[95%] w-full">
                <div className="flex items-center gap-2 mb-4 ml-2">
                  <FileText size={14} className="text-teal-600" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Consultation Summary Report</span>
                  <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] rounded-tl-none shadow-sm overflow-hidden border-l-[8px] border-l-teal-600">
                  <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-teal-600" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Official MedCenter Advisory</span>
                    </div>
                    <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                      <Sparkles size={12} />
                    </div>
                  </div>
                  <div className="p-8 text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-semibold italic border-b border-slate-50 bg-white">
                    {m.text}
                  </div>
                  <div className="px-8 py-4 bg-teal-50/20 flex items-center justify-between">
                    <p className="text-[9px] font-black text-teal-700/60 uppercase tracking-widest">Auth: Chief AI Consultant</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>
                      <div className="w-10 h-1 bg-teal-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[95%] w-full animate-pulse">
              <div className="h-4 w-32 bg-slate-100 rounded-full mb-4 ml-2"></div>
              <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-12 space-y-4 shadow-sm border-l-8 border-teal-200">
                <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Input Block */}
      <div className="p-6 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative">
          <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 rounded-[2rem] focus-within:bg-white focus-within:border-teal-600 transition-all overflow-hidden p-1 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="w-full pl-6 pr-16 py-5 bg-transparent focus:outline-none text-slate-900 font-bold text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 w-14 h-14 bg-teal-600 text-white rounded-[1.5rem] flex items-center justify-center disabled:bg-slate-300 hover:bg-slate-900 transition-all shadow-xl active:scale-95 z-10"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
           <ShieldCheck size={12} className="text-teal-600" />
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Encryption Active • Medical Privacy Guaranteed</p>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
