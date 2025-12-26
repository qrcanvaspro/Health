
import React from 'react';
import { ArrowRight, Pill, MessageSquare, ShoppingCart, Activity, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
  onNavigate: (tab: string) => void;
}

const Home: React.FC<Props> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl shadow-teal-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <ShieldCheck size={16} className="text-teal-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-teal-50">AI-Powered Safety</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-teal-50/80 mb-10 leading-relaxed font-medium">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('explorer')}
              className="px-8 py-4 bg-white text-teal-900 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-50 transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-0"
            >
              {t.getStarted}
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('assistant')}
              className="px-8 py-4 bg-teal-500/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <MessageSquare size={20} />
              {t.assistant}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Pill className="text-blue-600" size={32} />}
          title={t.featureExplorerTitle}
          desc={t.featureExplorerDesc}
          color="blue"
          onClick={() => onNavigate('explorer')}
        />
        <FeatureCard 
          icon={<MessageSquare className="text-purple-600" size={32} />}
          title={t.featureAssistantTitle}
          desc={t.featureAssistantDesc}
          color="purple"
          onClick={() => onNavigate('assistant')}
        />
        <FeatureCard 
          icon={<ShoppingCart className="text-teal-600" size={32} />}
          title={t.featureOrderTitle}
          desc={t.featureOrderDesc}
          color="teal"
          onClick={() => onNavigate('order')}
        />
      </div>

      {/* Stats / Health Pulse Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 animate-pulse">
            <Heart size={32} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Health Pulse</h3>
            <p className="text-slate-400 font-medium">Monitoring system active & synchronized.</p>
          </div>
        </div>
        <div className="flex gap-12 text-center">
          <div>
            <div className="text-3xl font-black text-teal-600">98%</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Adherence</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-600">24/7</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Support</div>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-600">1.2k</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Medicines</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, color: string, onClick: () => void}> = ({ icon, title, desc, color, onClick }) => {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    teal: "bg-teal-50 border-teal-100"
  };

  return (
    <button 
      onClick={onClick}
      className={`text-left p-8 rounded-[2rem] border-2 ${bgColors[color]} transition-all hover:scale-[1.03] hover:shadow-xl group active:scale-[0.98]`}
    >
      <div className="mb-6 p-4 bg-white rounded-2xl inline-block shadow-sm group-hover:shadow-md transition-shadow">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <span>Try now</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

export default Home;
