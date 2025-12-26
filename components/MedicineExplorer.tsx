
import React, { useState } from 'react';
import { Search, Loader2, Pill, Activity, ShieldAlert, FlaskConical, AlertCircle, FileText, CheckCircle, ShoppingCart } from 'lucide-react';
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
        setError(lang === Language.EN ? "Medicine data could not be retrieved. Please check the spelling." : "दवाई की जानकारी प्राप्त नहीं हो सकी। कृपया नाम की जांच करें।");
      }
    } catch (err) {
      setError(lang === Language.EN ? "Network error. Please try again." : "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white rounded-[1.8rem] shadow-sm overflow-hidden border border-slate-100">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 pl-14 pr-4 py-5 focus:outline-none text-slate-900 font-bold text-lg"
          />
          <Search className="absolute left-5 text-slate-400" size={24} />
          <button
            type="submit"
            disabled={loading}
            className="mr-3 px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center min-w-[120px] shadow-lg shadow-teal-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (lang === Language.EN ? 'Analyze' : 'विश्लेषण')}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-5 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 flex items-center gap-4 animate-in slide-in-from-top-2">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {details && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden clinical-report-bg animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Clinical Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <FileText className="text-teal-600" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{details.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">MedCenter Verified Report</span>
                  <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200">
              <CheckCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Clinical Accuracy High</span>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReportSection icon={<Activity size={20}/>} title={t.uses} content={details.use} color="border-blue-500" bg="bg-blue-50/50" />
            <ReportSection icon={<Pill size={20}/>} title={t.dosage} content={details.dosage} color="border-teal-500" bg="bg-teal-50/50" />
            <ReportSection icon={<ShieldAlert size={20}/>} title={t.sideEffects} content={details.sideEffects} color="border-red-500" bg="bg-red-50/50" />
            <ReportSection icon={<FlaskConical size={20}/>} title={t.composition} content={details.composition} color="border-amber-500" bg="bg-amber-50/50" />
          </div>

          {/* Footer / Order */}
          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-xs text-slate-400 font-medium italic max-w-md">
                * {lang === Language.EN 
                   ? "Disclaimer: This AI report is for informational purposes. Consult a licensed physician for prescription guidance." 
                   : "अस्वीकरण: यह AI रिपोर्ट केवल जानकारी के लिए है। प्रिस्क्रिप्शन मार्गदर्शन के लिए डॉक्टर से परामर्श लें।"}
              </div>
              <button 
                onClick={() => window.open(`https://wa.me/${ORDER_PHONE}?text=Hello, MedCenter. I am Manish Yadav. Please check availability for: ${details.name}.`, '_blank')}
                className="w-full md:w-auto px-10 py-4 bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95"
              >
                <ShoppingCart size={20} />
                {t.buyNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection: React.FC<{icon: React.ReactNode, title: string, content: string, color: string, bg: string}> = ({ icon, title, content, color, bg }) => (
  <div className={`p-6 rounded-3xl border-l-4 ${color} ${bg} shadow-sm group hover:bg-white transition-colors duration-300`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-700">
        {icon}
      </div>
      <span className="font-black text-slate-800 uppercase tracking-tighter text-sm">{title}</span>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed font-semibold">{content}</p>
  </div>
);

export default MedicineExplorer;
