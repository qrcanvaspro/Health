import React, { useState, useEffect } from 'react';
import { LayoutGrid, ShoppingCart, MessageSquare, LineChart, Languages, User, Menu, Home as HomeIcon, Key, Lock } from 'lucide-react';
import { Language, ChatMessage } from './types';
import { TRANSLATIONS } from './constants';

import Home from './components/Home';
import MedicineExplorer from './components/MedicineExplorer';
import HealthAssistant from './components/HealthAssistant';
import DirectOrder from './components/DirectOrder';
import HealthDashboard from './components/HealthDashboard';
import Reminders from './components/Reminders';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Removed readonly modifier to fix TypeScript "identical modifiers" error on property augmentation
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hasKey, setHasKey] = useState(true);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // FIX: Removed password prompt to strictly comply with "must not ask user for it under any circumstances" guideline for API key management
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // FIX: Assume key selection was successful to mitigate platform race conditions as per guidelines
      setHasKey(true);
    }
  };

  const toggleLanguage = () => {
    const nextLang = lang === Language.EN ? Language.HI : Language.EN;
    setLang(nextLang);
    const greeting: ChatMessage = {
      role: 'model',
      text: TRANSLATIONS[nextLang].langSwitchGreeting
    };
    setChatHistory(prev => [...prev, greeting]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home lang={lang} onNavigate={setActiveTab} />;
      case 'explorer': return <MedicineExplorer lang={lang} />;
      case 'assistant': return (
        <HealthAssistant 
          lang={lang} 
          externalHistory={chatHistory} 
          onUpdateHistory={setChatHistory} 
        />
      );
      case 'order': return <DirectOrder lang={lang} />;
      case 'dashboard': return <HealthDashboard lang={lang} />;
      case 'reminders': return <Reminders lang={lang} />;
      default: return <Home lang={lang} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col p-6 sticky top-0 h-screen z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-100">
            MC
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">MedCenter</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Elite AI Healthcare</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'home'} icon={<HomeIcon size={20}/>} label={t.home} onClick={() => setActiveTab('home')} />
          <NavItem active={activeTab === 'explorer'} icon={<LayoutGrid size={20}/>} label={t.explorer} onClick={() => setActiveTab('explorer')} />
          <NavItem active={activeTab === 'order'} icon={<ShoppingCart size={20}/>} label={t.orderNav} onClick={() => setActiveTab('order')} />
          <NavItem active={activeTab === 'assistant'} icon={<MessageSquare size={20}/>} label={t.assistant} onClick={() => setActiveTab('assistant')} />
          <NavItem active={activeTab === 'dashboard'} icon={<LineChart size={20}/>} label={t.dashboard} onClick={() => setActiveTab('dashboard')} />
          <NavItem active={activeTab === 'reminders'} icon={<Languages size={20}/>} label={t.reminders} onClick={() => setActiveTab('reminders')} />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={handleOpenKeySelector}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${!hasKey ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
          >
            <div className="flex items-center gap-2">
              <Lock size={14} className="opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{!hasKey ? 'Key Required' : 'System Locked'}</span>
            </div>
            <Key size={16} />
          </button>
          
          <button 
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-teal-100"
          >
            <span className="text-sm font-bold text-slate-700">{lang === Language.EN ? 'हिन्दी' : 'English'}</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Languages size={18} />
            </div>
          </button>
          
          <div className="flex items-center gap-3 p-4 bg-teal-600 rounded-2xl text-white shadow-xl shadow-teal-100">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">Premium Access</p>
              <p className="text-sm font-bold">Manish Yadav</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden glass-morphism sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-teal-50">MC</div>
          <h1 className="font-bold text-slate-800">MedCenter</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleOpenKeySelector} className={`p-2 rounded-xl ${!hasKey ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
            <Key size={20} />
          </button>
          <button onClick={toggleLanguage} className="p-2 text-teal-600 bg-teal-50 rounded-xl"><Languages size={20} /></button>
          <button className="p-2 text-slate-600"><Menu size={20} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full mb-20 md:mb-0">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.welcome}</h2>
            <p className="text-slate-500 mt-2 font-medium">Advanced medical consultation & healthcare management.</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Consultant Online</span>
          </div>
        </div>
        
        <div className="pb-10">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden glass-morphism fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <MobileNavItem active={activeTab === 'home'} icon={<HomeIcon size={24}/>} onClick={() => setActiveTab('home')} />
        <MobileNavItem active={activeTab === 'explorer'} icon={<LayoutGrid size={24}/>} onClick={() => setActiveTab('explorer')} />
        <MobileNavItem active={activeTab === 'order'} icon={<ShoppingCart size={24}/>} onClick={() => setActiveTab('order')} />
        <MobileNavItem active={activeTab === 'assistant'} icon={<MessageSquare size={24}/>} onClick={() => setActiveTab('assistant')} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{active: boolean, icon: React.ReactNode, label: string, onClick: () => void}> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
      active ? 'bg-teal-600 text-white shadow-xl shadow-teal-100 translate-x-1' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{active: boolean, icon: React.ReactNode, onClick: () => void}> = ({ active, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl transition-all ${active ? 'bg-teal-600 text-white shadow-xl shadow-teal-100' : 'text-slate-400'}`}
  >
    {icon}
  </button>
);

export default App;