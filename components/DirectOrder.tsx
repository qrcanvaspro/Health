
import React, { useState, useEffect } from 'react';
/* Added ShoppingCart to the import list to resolve the "Cannot find name 'ShoppingCart'" error */
import { Plus, Trash2, ShoppingBag, Send, AlertCircle, PackageCheck, MapPin, Phone, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Medicine, Language } from '../types';
import { TRANSLATIONS, INITIAL_ORDER_ITEMS, ORDER_PHONE } from '../constants';

interface Props {
  lang: Language;
}

interface UserDetails {
  address: string;
  unit: string;
  mobile: string;
}

const DirectOrder: React.FC<Props> = ({ lang }) => {
  const [orderItems, setOrderItems] = useState<Medicine[]>(INITIAL_ORDER_ITEMS);
  const [showAdd, setShowAdd] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(() => {
    const saved = localStorage.getItem('manish_health_details');
    return saved ? JSON.parse(saved) : { address: '', unit: '', mobile: '' };
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('manish_health_details', JSON.stringify(userDetails));
  }, [userDetails]);

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

  const finalizeAndSend = () => {
    if (!userDetails.address || !userDetails.mobile) {
      alert(lang === Language.EN ? "Please fill in your address and mobile number." : "कृपया अपना पता और मोबाइल नंबर भरें।");
      return;
    }

    let message = `*📦 HEALTHCARE ORDER REQUEST*\n`;
    message += `--------------------------------\n`;
    message += `*Customer:* Manish Yadav\n`;
    message += `*Contact:* ${userDetails.mobile}\n`;
    message += `*Address:* ${userDetails.address}\n`;
    if (userDetails.unit) message += `*Unit/Flat:* ${userDetails.unit}\n`;
    message += `--------------------------------\n`;
    message += `*ORDER ITEMS:*\n`;
    
    orderItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Qty: ${item.totalStock} (${item.dosage})${item.timing ? '\n   _Note: ' + item.timing + '_' : ''}\n`;
    });
    
    message += `--------------------------------\n`;
    message += `_Sent via Manish Yadav Health AI_`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ORDER_PHONE}?text=${encodedMessage}`, '_blank');
  };

  if (showCheckout) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setShowCheckout(false)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={20} />
          {t.back}
        </button>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{t.checkoutHeader}</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.address}</label>
              <textarea
                rows={3}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none resize-none"
                placeholder="Ex: 123 Health Street, City Name..."
                value={userDetails.address}
                onChange={e => setUserDetails({...userDetails, address: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.unitNo}</label>
                <input
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none"
                  placeholder="Ex: Apt 4B"
                  value={userDetails.unit}
                  onChange={e => setUserDetails({...userDetails, unit: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.mobileNo}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 focus:bg-white transition-all outline-none"
                    placeholder="99999 99999"
                    value={userDetails.mobile}
                    onChange={e => setUserDetails({...userDetails, mobile: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-700 text-sm">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p>{t.checkoutNote}</p>
            </div>

            <button 
              onClick={finalizeAndSend}
              className="w-full py-6 bg-green-500 text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-2xl shadow-green-100 transform active:scale-[0.98] mt-4"
            >
              <Send size={24} />
              {t.sendOrder}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-8 rounded-[2rem] text-white shadow-xl shadow-teal-100 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
          <ShoppingBag size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">{t.orderNav}</h2>
          <p className="text-teal-50 opacity-90">Manage your list and checkout with professional delivery details.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">{t.orderSummary}</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-bold rounded-2xl hover:bg-teal-50 border border-teal-100 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>{t.addMedicine}</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.medName}</label>
              <input
                className="w-full p-4 bg-slate-50 rounded-2xl border-transparent focus:border-teal-500 focus:ring-0 transition-all"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.totalStock}</label>
              <input
                type="number"
                className="w-full p-4 bg-slate-50 rounded-2xl border-transparent focus:border-teal-500 focus:ring-0 transition-all"
                value={newItem.totalStock}
                onChange={e => setNewItem({...newItem, totalStock: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.dosage}</label>
              <input
                className="w-full p-4 bg-slate-50 rounded-2xl border-transparent focus:border-teal-500 focus:ring-0 transition-all"
                value={newItem.dosage}
                onChange={e => setNewItem({...newItem, dosage: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">{t.timing}</label>
              <input
                className="w-full p-4 bg-slate-50 rounded-2xl border-transparent focus:border-teal-500 focus:ring-0 transition-all"
                value={newItem.timing}
                onChange={e => setNewItem({...newItem, timing: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-8 py-3 text-slate-500 font-semibold">{t.cancel}</button>
            <button onClick={handleAddItem} className="px-10 py-3 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-100">{t.save}</button>
          </div>
        </div>
      )}

      {orderItems.length === 0 ? (
        <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
          <PackageCheck size={64} className="mb-4 opacity-10" />
          <p className="font-medium">{t.emptyOrder}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {orderItems.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between group transition-all hover:shadow-md hover:border-teal-50">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                    <span className="font-bold text-lg">{item.totalStock}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                    <p className="text-sm text-slate-400 font-medium">{item.dosage} {item.timing && `• ${item.timing}`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full mt-6 py-6 bg-teal-600 text-white rounded-[2rem] font-bold text-xl flex items-center justify-center gap-4 hover:bg-teal-700 transition-all shadow-2xl shadow-teal-100 transform active:scale-[0.98]"
          >
            <ShoppingCart className="w-6 h-6" />
            {lang === Language.EN ? "Proceed to Checkout" : "चेकआउट के लिए आगे बढ़ें"}
          </button>
          
          <div className="flex flex-col items-center gap-2 justify-center text-slate-400 mt-6 bg-slate-100/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <AlertCircle size={16} />
              <span>Verified Direct Channel to Pharmacy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectOrder;