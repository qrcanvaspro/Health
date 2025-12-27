import React, { useState } from 'react';
import { Search, Loader2, Pill, Activity, ShieldAlert, FlaskConical, AlertCircle, FileText, ShoppingCart, Sparkles, RefreshCcw, Info, Key, Lock } from 'lucide-react';
import { getMedicineDetails } from '../services/geminiService';
import { Language, MedicineDetails } from '../types';
import { TRANSLATIONS, ORDER_PHONE } from '../constants';

interface Props {
  lang: Language;
}

const MedicineExplorer: React.FC<Props> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{title: string, details?: string, isKeyError?: boolean} | null>(null);
  const [details, setDetails] = useState<MedicineDetails | null>(null);
  const t = TRANSLATIONS[lang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    setDetails(null);
    
    try {
      const response = await getMedicineDetails(query, lang);
      
      if (response.data) {
        setDetails(response.data);
      } else {
        setError({
          title: response.isKeyError ? (lang === Language.EN ? "API Key Issue" : "API की समस्या") : (lang === Language.EN ? "Analysis Failed" : "विश्लेषण विफल"),
          details: response.error || (lang === Language.EN ? "Medicine not found." : "दवाई नहीं मिली।"),
          isKeyError: response.isKeyError
        });
      }
    } catch (err: any) {
      setError({
        title: "System Error",
        details: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenKey = async () => {
    // FIX: Removed password prompt to comply with "application must not ask the user for it under any circumstances" guideline
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 pb-20">
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Database v4.8 Protected</span>
        </div>
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
            <span>{loading ? (lang === Language.EN ? 'Analyzing...' : 'जांच जारी...') : (lang === Language.EN ? 'Analyze' : 'खोजें')}</span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white/50 rounded-[3rem] border border-dashed border-teal-200">
           <RefreshCcw size={48} className="text-teal-600 animate-spin" />
           <div className="text-center">
             <p className="text-teal-700 font-black uppercase tracking-widest text-xs">Clinical Intelligence Active</p>
             <p className="text-slate-400 text-[10px] mt-1 italic">Scanning global pharmacological database for {query}...</p>
           </div>
        </div>
      )}

      {error && (
        <div className="p-8 bg-white border-2 border-red-100 rounded-[2.5rem] shadow-xl animate-in zoom-in-95">
          <div className="flex items-center gap-4 text-red-600 mb-4">
            <AlertCircle size={40} strokeWidth={2.5} />
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">{error.title}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Error Log: #MC-AI-KEY-ERR</p>
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
            <code className="text-red-700 text-sm font-bold block whitespace-pre-wrap">{error.details}</code>
          </div>
          
          {error.isKeyError && (
            <button 
              onClick={handleOpenKey}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-teal-600 shadow-xl shadow-slate-100 transition-all mb-4"
            >
              <Lock size={20} />
              {lang === Language.EN ? "Unlock & Update API Key" : "अनलॉक करें और API की अपडेट करें"}
            </button>
          )}

          <div className="flex flex-col gap-3">
             <p className="text-slate-500 text-xs font-medium">Next Steps:</p>
             <ul className="text-xs text-slate-600 space-y-2 list-disc ml-4 font-medium">
               <li>{lang === Language.EN ? 'API Key authentication required. Use the official platform dialog.' : 'API की प्रमाणीकरण आवश्यक है। आधिकारिक प्लेटफॉर्म डायलॉग का उपयोग करें।'}</li>
               <li>{lang === Language.EN ? 'Ensure you select a "Paid" project key from AI Studio once unlocked.' : 'अनलॉक होने के बाद सुनिश्चित करें कि आप AI Studio से "Paid" प्रोजेक्ट की चुनें।'}</li>
             </ul>
             {!error.isKeyError && (
               <button onClick={() => window.location.reload()} className="mt-4 py-4 bg-slate-900 text-white rounded-2xl font-bold">Restart System</button>
             )}
          </div>
        </div>
      )}

      {details && !loading && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-pattern animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-slate-900 text-white p-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-teal-600 rounded-3xl shadow-xl">
                <FileText className="text-white" size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{details.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Verified Pharmacology Profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
            <ReportSection icon={<Activity size={20}/>} title={t.uses} content={details.use} color="border-teal-500" />
            <ReportSection icon={<Pill size={20}/>} title={t.dosage} content={details.dosage} color="border-blue-500" />
            <ReportSection icon={<ShieldAlert size={20}/>} title={t.sideEffects} content={details.sideEffects} color="border-red-500" />
            <ReportSection icon={<FlaskConical size={20}/>} title={t.composition} content={details.composition} color="border-amber-500" />
          </div>

          <div className="p-8 bg-white border-t border-slate-100 flex flex-col items-center gap-4">
            <button 
              onClick={() => window.open(`https://wa.me/${ORDER_PHONE}?text=Hello, I need clinical stock for: ${details.name}`, '_blank')}
              className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
            >
              <ShoppingCart size={24} />
              {t.buyNow}
            </button>
            <div className="flex items-center gap-2 text-slate-400">
               <Info size={12} />
               <p className="text-[10px] font-bold uppercase">Report generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection: React.FC<{icon: React.ReactNode, title: string, content: string, color: string}> = ({ icon, title, content, color }) => (
  <div className={`p-6 rounded-[2rem] border-l-8 ${color} shadow-sm bg-white hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-50 rounded-xl text-slate-700">{icon}</div>
      <span className="font-black text-slate-900 uppercase tracking-tighter text-[10px]">{title}</span>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed font-bold">{content}</p>
  </div>
);

export default MedicineExplorer;