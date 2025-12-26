
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, ShieldCheck, ClipboardCheck, ArrowDown, Award } from 'lucide-react';
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
      onUpdateHistory(prev => [...prev, { role: 'model', text: lang === Language.EN ? "Service interruption. Please retry." : "सेवा में बाधा। कृपया पुनः प्रयास करें।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-report-bg">
      {/* Consultant Letterhead Header */}
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-teal-900/50">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg tracking-tight">Dr. Gemini AI</h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                <Award size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">Senior Consultant</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Manish Yadav MedCenter</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase">Status</p>
            <p className="text-xs font-bold text-green-400">Consultation Active</p>
          </div>
        </div>
      </div>

      {/* Report Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth">
        {externalHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-inner">
              <ClipboardCheck size={48} className="text-slate-300" />
            </div>
            <p className="text-slate-400 max-w-[280px] font-bold text-xl leading-snug">{t.chatPlaceholder}</p>
          </div>
        )}
        
        {externalHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[80%] group">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Query</span>
                </div>
                <div className="p-5 bg-slate-900 text-white rounded-[2rem] rounded-tr-none shadow-xl font-bold text-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div className="max-w-[95%] w-full">
                <div className="flex items-center gap-2 mb-3 ml-2">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Consultation Summary</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] rounded-tl-none shadow-sm overflow-hidden border-l-[6px] border-l-teal-600">
                  {/* AI Response Header */}
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-teal-600" />
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Official MedCenter Report</span>
                    </div>
                    <Sparkles size={14} className="text-amber-400" />
                  </div>
                  {/* AI Response Text */}
                  <div className="p-8 text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-semibold clinical-report-bg">
                    {m.text}
                  </div>
                  {/* AI Response Footer */}
                  <div className="px-8 py-4 bg-teal-50/30 border-t border-teal-50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-teal-700/60 uppercase">System ID: MC-AI-CONSULTANT-99</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(j => <div key={j} className="w-1.5 h-1.5 bg-teal-200 rounded-full"></div>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="max-w-[95%] w-full">
              <div className="h-4 w-32 bg-slate-100 rounded-full mb-3 ml-2"></div>
              <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] rounded-tl-none p-10 flex flex-col gap-4">
                <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Control Input */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-slate-900 rounded-[2.2rem] blur-sm opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
          <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus-within:bg-white focus-within:border-teal-500 transition-all overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="w-full pl-8 pr-16 py-6 bg-transparent focus:outline-none text-slate-900 font-bold text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-200 hover:bg-slate-900 transition-all shadow-xl shadow-teal-100 active:scale-90"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
          {lang === Language.EN ? "Proprietary AI System by Manish Yadav MedCenter" : "मनीष यादव मेडसेंटर द्वारा मालिकाना AI प्रणाली"}
        </p>
      </div>
    </div>
  );
};

export default HealthAssistant;
