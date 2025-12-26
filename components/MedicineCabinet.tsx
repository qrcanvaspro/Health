
import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, Send, AlertCircle } from 'lucide-react';
import { Medicine, Language } from '../types';
import { TRANSLATIONS, INITIAL_ORDER_ITEMS, ORDER_PHONE } from '../constants';

interface Props {
  lang: Language;
}

const DirectOrder: React.FC<Props> = ({ lang }) => {
  const [orderItems, setOrderItems] = useState<Medicine[]>(INITIAL_ORDER_ITEMS);
  const [showAdd, setShowAdd] = useState(false);
  const t = TRANSLATIONS[lang];

  const [newItem, setNewItem] = useState<Partial<Medicine>>({
    name: '',
    dosage: '',
    timing: '',
    totalStock: 1
  });

  const handleAddItem = () => {
    if (!newItem.name) return;
    const item: Medicine = {
      id: Date.now().toString(),
      name: newItem.name || '',
      dosage: newItem.dosage || '1 Strip',
      timing: newItem.timing || '',
      stock: 1,
      totalStock: Number(newItem.totalStock) || 1,
    };
    setOrderItems([...orderItems, item]);
    setShowAdd(false);
    setNewItem({ name: '', dosage: '', timing: '', totalStock: 1 });
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(m => m.id !== id));
  };

  const sendWhatsAppOrder = () => {
    if (orderItems.length === 0) return;
    
    let message = `Hello, I am Manish Yadav. I want to order the following medicines:\n\n`;
    orderItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Qty: ${item.totalStock} (${item.dosage})${item.timing ? ' - Note: ' + item.timing : ''}\n`;
    });
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ORDER_PHONE}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="text-teal-600" />
          {t.orderSummary}
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-100"
        >
          <Plus size={18} />
          <span>{t.addMedicine}</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder={t.medName}
              className="p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-teal-500"
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
            />
            <input
              placeholder={t.totalStock}
              type="number"
              className="p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-teal-500"
              value={newItem.totalStock}
              onChange={e => setNewItem({...newItem, totalStock: Number(e.target.value)})}
            />
            <input
              placeholder={t.dosage}
              className="p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-teal-500"
              value={newItem.dosage}
              onChange={e => setNewItem({...newItem, dosage: e.target.value})}
            />
            <input
              placeholder={t.timing}
              className="p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-teal-500"
              value={newItem.timing}
              onChange={e => setNewItem({...newItem, timing: e.target.value})}
            />
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-slate-500">{t.cancel}</button>
            <button onClick={handleAddItem} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-semibold">{t.save}</button>
          </div>
        </div>
      )}

      {orderItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <ShoppingBag size={48} className="mb-4 opacity-20" />
          <p>{t.emptyOrder}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {orderItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <span className="font-bold">{item.totalStock}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.dosage} {item.timing && `• ${item.timing}`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={sendWhatsAppOrder}
            className="w-full py-5 bg-green-500 text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-green-100 transform active:scale-[0.98]"
          >
            <Send size={20} />
            {t.sendOrder}
          </button>
          
          <div className="flex items-center gap-2 justify-center text-slate-400 text-xs mt-4">
            <AlertCircle size={14} />
            <span>Order will be sent to +91 96169 21617</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectOrder;
