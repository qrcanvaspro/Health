
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, ShieldCheck, ClipboardCheck, Award, FileText, Activity } from 'lucide-react';
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
      onUpdateHistory(prev => [...prev, { role: 'model', text: lang === Language.EN ? "Consultation interrupted." : "परामर्श में बाधा आई।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-pattern">
      {/* Consultant Header */}
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b-4 border-teal-600">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 bg-teal-600 rounded-3xl flex items-center justify-center shadow-xl ring-4 ring-teal-500/20">
              <Bot size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-black text-2xl tracking-tighter">Dr. Manish Yadav AI</h3>
              <div className="flex items-center gap-1 px-3 py-1 bg-teal-500 text-white rounded-full">
                <Award size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Chief Consultant</span>
              </div>
            </div>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em] mt-1">Verified Medical Diagnostics System</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase">Consultation Mode</p>
            <div className="flex items-center gap-2 justify-end">
              <Activity size={14} className="text-green-500" />
              <p className="text-xs font-bold text-slate-300">Active Diagnosis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth">
        {externalHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center border border-slate-200">
              <ClipboardCheck size={48} className="text-slate-300" />
            </div>
            <p className="text-slate-500 max-w-[320px] font-black text-2xl leading-tight">{t.chatPlaceholder}</p>
          </div>
        )}
        
        {externalHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[80%] group">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Inquiry</span>
                  <User size={12} className="text-slate-400" />
                </div>
                <div className="p-6 bg-slate-900 text-white rounded-[2rem] rounded-tr-none shadow-xl font-bold text-base">
                  {m.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[95%] w-full">
                <div className="flex items-center gap-3 mb-4 ml-4">
                  <FileText size={16} className="text-teal-600" />
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.1em]">Clinical Consultation Report</span>
                  <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-[3rem] rounded-tl-none shadow-sm overflow-hidden border-l-[10px] border-l-teal-600">
                  <div className="px-10 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={18} className="text-teal-600" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">MedCenter Verified Outcome</span>
                    </div>
                    <Sparkles size={16} className="text-amber-400" />
                  </div>
                  <div className="p-10 text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-bold italic bg-white tracking-tight">
                    {m.text}
                  </div>
                  <div className="px-10 py-5 bg-teal-50/20 flex items-center justify-between border-t border-teal-50/30">
                    <p className="text-[9px] font-black text-teal-800/50 uppercase tracking-[0.2em]">Authorized Signature: MC-AI-CONSULTANT</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                      <div className="w-12 h-1.5 bg-teal-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[90%] w-full animate-pulse">
              <div className="h-5 w-40 bg-slate-100 rounded-full mb-5 ml-4"></div>
              <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-16 space-y-6 shadow-sm border-l-[10px] border-teal-200">
                <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative">
          <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] focus-within:bg-white focus-within:border-teal-600 transition-all overflow-hidden p-1.5 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="w-full pl-8 pr-20 py-6 bg-transparent focus:outline-none text-slate-900 font-bold text-lg"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 w-16 h-16 bg-teal-600 text-white rounded-[1.8rem] flex items-center justify-center disabled:bg-slate-300 hover:bg-slate-900 transition-all shadow-xl active:scale-95 z-10"
            >
              <Send size={28} />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center gap-3 mt-5 opacity-40">
           <ShieldCheck size={14} className="text-teal-600" />
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Clinical Security • HIPAA Compliant Data Stream</p>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
