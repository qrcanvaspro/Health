
import React, { useState } from 'react';
import { Search, Loader2, Pill, Activity, ShieldAlert, FlaskConical } from 'lucide-react';
import { getMedicineDetails } from '../services/geminiService';
import { Language, MedicineDetails } from '../types';
import { TRANSLATIONS, ORDER_PHONE } from '../constants';

interface Props {
  lang: Language;
}

const MedicineExplorer: React.FC<Props> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<MedicineDetails | null>(null);
  const t = TRANSLATIONS[lang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const result = await getMedicineDetails(query, lang);
    setDetails(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <button
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" /> : (lang === Language.EN ? 'Search' : 'खोजें')}
        </button>
      </form>

      {details && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-100 rounded-2xl">
              <Pill className="text-teal-600" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{details.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<Activity size={20}/>} title={t.uses} content={details.use} color="blue" />
            <InfoCard icon={<Pill size={20}/>} title={t.dosage} content={details.dosage} color="teal" />
            <InfoCard icon={<ShieldAlert size={20}/>} title={t.sideEffects} content={details.sideEffects} color="red" />
            <InfoCard icon={<FlaskConical size={20}/>} title={t.composition} content={details.composition} color="amber" />
          </div>

          <button 
            onClick={() => window.open(`https://wa.me/${ORDER_PHONE}?text=Hello, I am Manish Yadav. I would like to order: ${details.name}.`, '_blank')}
            className="mt-8 w-full py-4 bg-green-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.611-.918-2.21-.242-.588-.487-.508-.67-.517-.172-.008-.37-.01-.567-.01-.197 0-.518.074-.79.37-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.895-5.335 11.898-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t.buyNow}
          </button>
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{icon: React.ReactNode, title: string, content: string, color: 'blue' | 'teal' | 'red' | 'amber'}> = ({ icon, title, content, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700"
  };
  return (
    <div className={`p-5 rounded-2xl ${colors[color]} border border-white shadow-sm`}>
      <div className="flex items-center gap-2 mb-2 font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
};

export default MedicineExplorer;
