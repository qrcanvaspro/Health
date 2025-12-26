
import React, { useState } from 'react';
import { Search, Loader2, Pill, Activity, ShieldAlert, FlaskConical, AlertCircle, FileText, CheckCircle, ShoppingCart, Sparkles } from 'lucide-react';
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
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setDetails(null);
    
    try {
      const result = await getMedicineDetails(query, lang);
      if (result) {
        setDetails(result);
      } else {
        setError(lang === Language.EN ? "The AI could not identify this drug. Please verify the name." : "AI इस दवाई की पहचान नहीं कर सका। कृपया नाम की जांच करें।");
      }
    } catch (err) {
      setError(lang === Language.EN ? "AI Analysis failed due to network issues." : "नेटवर्क समस्या के कारण AI विश्लेषण विफल रहा।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500 ${loading ? 'ai-pulse opacity-60' : ''}`}></div>
        <div className="relative flex items-center bg-white rounded-[1.8rem] shadow-sm overflow-hidden border border-slate-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 pl-14 pr-4 py-6 focus:outline-none text-slate-900 font-bold text-lg"
          />
          <Search className="absolute left-5 text-slate-400" size={24} />
          <button
            type="submit"
            disabled={loading}
            className="mr-3 px-10 py-4 bg-teal-600 text-white rounded-2xl font-black hover:bg-slate-900 disabled:bg-slate-200 transition-all flex items-center justify-center min-w-[150px] gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>AI Processing</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{lang === Language.EN ? 'Analyze' : 'विश्लेषण'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
           <div className="p-4 bg-teal-50 rounded-full text-teal-600">
             <Activity size={48} className="animate-bounce" />
           </div>
           <p className="text-teal-600 font-black uppercase tracking-widest text-sm">AI Consulting Clinical Database...</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-700 flex items-center gap-4 animate-in slide-in-from-top-4">
          <AlertCircle size={24} />
          <p className="font-black">{error}</p>
        </div>
      )}

      {details && !loading && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-pattern animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Official Report Header */}
          <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-teal-600 rounded-3xl shadow-xl">
                <FileText className="text-white" size={36} />
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase">{details.name}</h2>
                <div className="flex items-center gap-3 mt-1 opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-widest">Medical Center Index: #MY-882</span>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              <CheckCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">AI Verified Clinical Data</span>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReportSection icon={<Activity size={20}/>} title={t.uses} content={details.use} color="border-teal-500 bg-teal-50/30" />
            <ReportSection icon={<Pill size={20}/>} title={t.dosage} content={details.dosage} color="border-blue-500 bg-blue-50/30" />
            <ReportSection icon={<ShieldAlert size={20}/>} title={t.sideEffects} content={details.sideEffects} color="border-red-500 bg-red-50/30" />
            <ReportSection icon={<FlaskConical size={20}/>} title={t.composition} content={details.composition} color="border-amber-500 bg-amber-50/30" />
          </div>

          {/* Action Footer */}
          <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-4 max-w-sm">
               <AlertCircle size={20} className="text-slate-300 mt-1 flex-shrink-0" />
               <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                 {lang === Language.EN ? "Confidential AI Report: For informational use only. Consult a physician before medication." : "गोपनीय AI रिपोर्ट: केवल सूचना के लिए। दवा लेने से पहले डॉक्टर से परामर्श लें।"}
               </p>
            </div>
            <button 
              onClick={() => window.open(`https://wa.me/${ORDER_PHONE}?text=Hello, Manish Yadav MedCenter. Requesting stock for: ${details.name}.`, '_blank')}
              className="w-full md:w-auto px-12 py-5 bg-green-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95"
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
  <div className={`p-8 rounded-[2rem] border-l-8 ${color} shadow-sm group bg-white transition-all hover:shadow-md`}>
    <div className="flex items-center gap-4 mb-5">
      <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-700">
        {icon}
      </div>
      <span className="font-black text-slate-900 uppercase tracking-tighter text-xs">{title}</span>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed font-bold">{content}</p>
  </div>
);

export default MedicineExplorer;
