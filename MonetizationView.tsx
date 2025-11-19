import React, { useState } from 'react';
import { AdSlot, Language } from '../types';
import { matchAdContent } from '../services/geminiService';
import { Briefcase, Shield, Plus, Star, Globe } from 'lucide-react';
import { translations } from '../translations';

interface MonetizationViewProps {
  adSlots: AdSlot[];
  onAddSlot: (slot: AdSlot) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const MonetizationView: React.FC<MonetizationViewProps> = ({ adSlots, onAddSlot, lang, setLang }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [verifyingSlotId, setVerifyingSlotId] = useState<string | null>(null);
  
  const t = translations[lang].monetization;

  const handleAddSlot = () => {
    if (!price || !date) return;
    const newSlot: AdSlot = {
        id: Date.now().toString(),
        date: new Date(date),
        price: Number(price),
        status: 'open'
    };
    onAddSlot(newSlot);
    setShowAdd(false);
    setPrice('');
    setDate('');
  };

  const verifyMatch = async (slot: AdSlot) => {
    if (!slot.advertiserName || !slot.adContent) return;
    setVerifyingSlotId(slot.id);
    const channelDesc = "Digital Marketing, Startups, Growth Hacking.";
    const { score, reason } = await matchAdContent(channelDesc, slot.adContent, lang);
    
    alert(`Match Score: ${score}/100\n\nVerdict: ${reason}`);
    setVerifyingSlotId(null);
  };

  return (
    <div className="p-6 pb-32 space-y-6 max-w-md mx-auto">
       <div className="flex justify-between items-start mb-2">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{t.title}</h2>
            <p className="text-xs font-medium text-[#a1a1aa] mt-1">{t.subtitle}</p>
        </div>
        <div className="flex gap-3 items-center">
             <button 
                onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
                className="w-10 h-10 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-white transition-colors"
            >
                <Globe size={18} />
            </button>
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2 flex items-center gap-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-sm">1,250</span>
            </div>
        </div>
      </div>

      {/* Ad Slots List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="font-bold text-sm text-white">{t.your_slots}</h3>
            <button onClick={() => setShowAdd(!showAdd)} className="text-[#a1a1aa] text-sm font-medium flex items-center gap-1 hover:text-white transition-colors">
                <Plus size={16} /> {t.new_slot}
            </button>
        </div>

        {showAdd && (
            <div className="bw-card p-4 mb-4 animate-fade-in">
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 text-sm" 
                    />
                    <div className="relative">
                        <input 
                            type="number" 
                            placeholder="Price (Stars)" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 pl-9 text-sm" 
                        />
                        <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
                    </div>
                </div>
                <button onClick={handleAddSlot} className="w-full bw-button py-3 text-sm">
                    {t.create_btn}
                </button>
            </div>
        )}

        {adSlots.map((slot) => (
            <div key={slot.id} className="bw-card p-5 relative transition-all hover:border-[#3f3f46]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-lg font-bold text-white">{slot.date.toLocaleDateString()}</div>
                        <div className="text-sm text-[#a1a1aa] font-medium flex items-center gap-1 mt-0.5">
                             {slot.price} Stars
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                        slot.status === 'open' ? 'bg-[#27272a] text-[#a1a1aa] border-[#3f3f46]' : 'bg-white text-black border-white'
                    }`}>
                        {slot.status === 'open' ? t.open : t.booked}
                    </span>
                </div>

                {slot.status === 'booked' && slot.advertiserName && (
                    <div className="bg-[#27272a]/50 rounded-xl p-4 border border-[#3f3f46] mt-2">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#3f3f46]">
                            <Briefcase size={14} className="text-white" />
                            <span className="font-semibold text-sm text-white">{slot.advertiserName}</span>
                        </div>
                        <p className="text-[#d4d4d8] text-sm font-medium leading-relaxed mb-3">"{slot.adContent}"</p>
                        
                        <button 
                            onClick={() => verifyMatch(slot)}
                            disabled={verifyingSlotId === slot.id}
                            className="w-full flex items-center justify-center gap-2 bg-[#18181b] text-white py-2.5 rounded-lg border border-[#3f3f46] hover:bg-[#27272a] transition-all font-semibold text-xs"
                        >
                            {verifyingSlotId === slot.id ? (
                                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"/>
                            ) : (
                                <>
                                    <Shield size={14} /> {t.check_match}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};