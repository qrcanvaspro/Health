import React, { useState } from 'react';
import { Search, Loader2, Pill, Activity, ShieldAlert, FlaskConical, AlertCircle, FileText, CheckCircle, ShoppingCart, Sparkles, RefreshCcw } from 'lucide-react';
import { getMedicineDetails } from '../services/geminiService';
import { Language, MedicineDetails } from '../types';
import { TRANSLATIONS, ORDER_PHONE } from '../constants';

interface Props {
  lang: Language;
}

const MedicineExplorer: React.FC<Props> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<MedicineDetails | null>(null);
  const t = TRANSLATIONS[lang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    setDetails(null);
    
    try {
      const result = await getMedicineDetails(query, lang);
      if (result) {
        setDetails(result);
      } else {
        setError(lang === Language.EN 
          ? "Medicine not found in clinical database. Please check spelling." 
          : "दवाई नहीं मिली। कृपया नाम की स्पेलिंग जांचें।");
      }
    } catch (err: any) {
      setError(lang === Language.EN 
        ? `System Error: ${err.message || "Failed to connect to AI"}` 
        : `सिस्टम एरर: AI से कनेक्शन नहीं हो सका।`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 pb-20">
      <div className="text-center mb-4">
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">
          Tablet Optimized Clinical Search
        </span>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500 ${loading ? 'ai-pulse opacity-60' : ''}`}></div>
        <div className="relative flex flex-col md:flex-row items-center bg-white rounded-[1.8rem] shadow-sm overflow-hidden border border-slate-200">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-14 pr-4 py-6 focus:outline-none text-slate-900 font-bold text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-10 py-6 bg-teal-600 text-white font-black hover:bg-slate-900 disabled:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{lang === Language.EN ? 'Analyze' : 'खोजें'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
           <div className="p-4 bg-teal-50 rounded-full text-teal-600">
             <RefreshCcw size={48} className="animate-spin" />
           </div>
           <p className="text-teal-600 font-black uppercase tracking-widest text-sm text-center">
             {lang === Language.EN ? 'Connecting to Medical Database...' : 'मेडिकल डेटाबेस से जुड़ रहे हैं...'}
           </p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 flex flex-col items-center gap-2 animate-in zoom-in-95">
          <AlertCircle size={32} />
          <p className="font-bold text-center">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs underline mt-2">Restart App</button>
        </div>
      )}

      {details && !loading && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-pattern animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-teal-600 rounded-3xl shadow-xl">
                <FileText className="text-white" size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{details.name}</h2>
                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">AI Diagnostics System #V3</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportSection icon={<Activity size={20}/>} title={t.uses} content={details.use} color="border-teal-500 bg-teal-50/30" />
            <ReportSection icon={<Pill size={20}/>} title={t.dosage} content={details.dosage} color="border-blue-500 bg-blue-50/30" />
            <ReportSection icon={<ShieldAlert size={20}/>} title={t.sideEffects} content={details.sideEffects} color="border-red-500 bg-red-50/30" />
            <ReportSection icon={<FlaskConical size={20}/>} title={t.composition} content={details.composition} color="border-amber-500 bg-amber-50/30" />
          </div>

          {/* Footer Action */}
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={() => window.open(`https://wa.me/${ORDER_PHONE}?text=Requesting stock for: ${details.name}`, '_blank')}
              className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
            >
              <ShoppingCart size={22} />
              {t.buyNow}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection: React.FC<{icon: React.ReactNode, title: string, content: string, color: string}> = ({ icon, title, content, color }) => (
  <div className={`p-6 rounded-[2rem] border-l-8 ${color} shadow-sm bg-white`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-700">{icon}</div>
      <span className="font-black text-slate-900 uppercase tracking-tighter text-[10px]">{title}</span>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed font-bold">{content}</p>
  </div>
);

export default MedicineExplorer;