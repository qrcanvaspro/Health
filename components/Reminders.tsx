
import React from 'react';
import { Bell, CheckCircle2, Circle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  lang: Language;
}

const Reminders: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const schedule = [
    { id: '1', time: '08:00 AM', name: 'Vitamin C', status: 'completed' },
    { id: '2', time: '01:30 PM', name: 'Paracetamol', status: 'pending' },
    { id: '3', time: '09:00 PM', name: 'Calcium', status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Bell className="text-teal-600" size={20} />
          {t.reminders}
        </h3>
        <span className="text-xs font-medium text-teal-600 px-2 py-1 bg-teal-50 rounded-lg">Today</span>
      </div>
      <div className="divide-y divide-slate-50">
        {schedule.map(item => (
          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400 w-20">{item.time}</span>
              <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">Scheduled</p>
              </div>
            </div>
            {item.status === 'completed' ? (
              <CheckCircle2 className="text-green-500" size={24} />
            ) : (
              <Circle className="text-slate-200" size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
