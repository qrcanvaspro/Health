
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

const DATA = [
  { day: 'Mon', usage: 4, adherence: 90 },
  { day: 'Tue', usage: 3, adherence: 100 },
  { day: 'Wed', usage: 5, adherence: 80 },
  { day: 'Thu', usage: 2, adherence: 100 },
  { day: 'Fri', usage: 4, adherence: 95 },
  { day: 'Sat', usage: 3, adherence: 70 },
  { day: 'Sun', usage: 2, adherence: 100 },
];

interface Props {
  lang: Language;
}

const HealthDashboard: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{t.usageTrend}</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="usage" stroke="#0d9488" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adherence Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Medication Adherence (%)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="adherence" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Meds" value="12" color="bg-teal-50 text-teal-600" />
        <SummaryCard label="Daily Doses" value="4" color="bg-blue-50 text-blue-600" />
        <SummaryCard label="Stock Alerts" value="2" color="bg-red-50 text-red-600" />
        <SummaryCard label="Health Score" value="94%" color="bg-amber-50 text-amber-600" />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{label: string, value: string, color: string}> = ({ label, value, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
    <div className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase mb-2 ${color}`}>
      {label}
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
  </div>
);

export default HealthDashboard;
