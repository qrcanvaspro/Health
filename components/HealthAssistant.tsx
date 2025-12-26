
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm tracking-tight">{t.assistant}</p>
            <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">Premium AI Support</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {externalHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
            <Bot size={64} className="text-slate-300" />
            <p className="text-slate-500 max-w-[200px] font-bold">{t.chatPlaceholder}</p>
          </div>
        )}
        {externalHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-slate-100 text-slate-500' : 'bg-teal-600 text-white'}`}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed font-medium ${m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none shadow-md shadow-teal-50' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-5 border-t border-slate-100 bg-white">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="w-full pl-6 pr-14 py-4 bg-slate-50 rounded-[1.5rem] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 border-2 border-transparent focus:border-transparent transition-all text-sm font-medium text-slate-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:grayscale hover:bg-teal-700 transition-all shadow-md active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthAssistant;
